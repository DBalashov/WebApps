import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import L from 'leaflet';
import _ from "lodash";
import $ from "jquery";
import {$bus, connector} from "../boot";
import {IEnumDeviceItem, IGeofenceItem, IGetOnlineInfoItem} from "../components/ServiceConnector";
import moment from "moment";
import {buildCircle, buildPolygon, buildTooltip, markerGetIcon} from "./Extenders";
import {CarTrip} from "./CarTrip"
import {GFTrip} from "./GFTrip"

@Component
export default class HomeIndexComponent extends VueEx {
    CurrentTrip: CarTrip;
    GFTrip: GFTrip = new GFTrip();

    carGroups: any = {};
    cars: any = {};

    geofenceFindText: string = "";
    geofenceFindList: IGeofenceItem[] = [];
    geofences: any = {};
    geofenceLoaded: boolean = false;
    geofenceSelected: IGeofenceItem[] = [];
    geofenceList: IGeofenceItem[] = [];

    layerGFCompleted: any = {};
    layerGFs: any = {};

    map: L.Map | undefined;
    layerCars: L.LayerGroup = L.layerGroup([], {});
    groupActiveID: string = "";
    geofenceCompleted: any = {};

    constructor() {
        super();
        this.CurrentTrip = new CarTrip(connector);
    }

    created() {
        $(window).on("resize", this.updateSize);

        $bus.$on("car-group-changed", (id: string) => {
            this.groupActiveID = id;
            this.refreshPositions();
        });

        this.$watch("geofenceFindText", _.debounce(() => {
            let name = this.geofenceFindText.trim();
            this.geofenceFindList = name.length >= 2 ? this.geofenceList.filter(f => f.Name.indexOf(name) >= 0) : [];
        }, 300));

        this.$watch("geofenceLoaded", () => {
            $bus.$on("geo-group-changed", (id: string) => { // todo (all)
                if (this.layerGFs.options) {
                    this.layerGFs.clearLayers();
                    this.layerGFCompleted.clearLayers();
                }
                if (id) {
                    this.geofenceList.forEach((p: IGeofenceItem) => {
                        if (p.ParentID != id) return;

                        let isCompleted = this.geofenceCompleted[p.ID];
                        if (p.IsPolygon) buildPolygon(p, this.layerGFs);
                        else buildCircle(p,
                            isCompleted ? this.layerGFCompleted : this.layerGFs,
                            isCompleted ? 'green' : 'red',
                            (e: any) => this.GFTrip.Show(this.geofences[e.target.options.__id]));
                    })
                }
            });
        })
    }

    mounted() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', () => setTimeout(this.updateSize, 400));

        this.updateSize();
        this.CurrentTrip.map = this.map = L.map('map', {preferCanvas: true, renderer: L.canvas()});
        this.map
            .addLayer(L.tileLayer(
                //'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                '//{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                {
                    updateWhenIdle: true,
                    detectRetina: true
                }))
            .setView([55.5, 61.2], 13)
            .addLayer(this.layerCars)
            .addLayer(this.CurrentTrip.layerTrip);

        this.buildGFClusters();
        connector.EnumDevices()
            .done(r => {
                r.Groups.forEach(g => this.carGroups[g.ID] = g);
                r.Items.forEach(c => this.cars[c.ID] = c);
                $bus.$emit('car-groups-changed', this.carGroups);
                this.refreshAllTrips();
            });

        connector.EnumGeofences()
            .done(r => {
                $bus.$emit('geo-groups-changed', r.Groups);
            })
    }

    refreshAllTrips() {
        let sd = moment().startOf('day').toDate();
        let ed = new Date();

        let ids: any = [];
        for (let cID in this.cars) {
            if (ids.length >= 100) break;
            ids.push(cID);
        }

        this.geofenceCompleted = {};
        connector.GetStage(ids, sd, ed, "GeoFence1").done(cars => {
            cars.forEach(car => {
                if (car.Items) {
                    car.Items.forEach(stageItem => {
                        if (stageItem.StatusIDs) {
                            stageItem.StatusIDs.forEach(gfid => {
                                let items = this.geofenceCompleted[gfid];
                                if (!items) this.geofenceCompleted[gfid] = items = [];
                                items.push(stageItem);
                            })
                        }
                    });
                }
            });
        })
    }

    buildGFClusters() {
        setTimeout(() => {
            this.layerGFs = (<any>window)["L"].markerClusterGroup({
                //spiderfyDistanceMultiplier: 2
                iconCreateFunction: function (c: any) {
                    return new L.DivIcon({
                        html: c ? c.getChildCount().toString() : "",
                        className: "cluster cluster-normal"
                    });
                }
            });

            this.layerGFCompleted = (<any>window)["L"].markerClusterGroup({
                iconCreateFunction: function (c: any) {
                    return new L.DivIcon({
                        html: c ? c.getChildCount().toString() : "",
                        className: "cluster cluster-completed"
                    });
                }
            });

            if (this.map) {
                this.map.addLayer(this.layerGFs);
                this.map.addLayer(this.layerGFCompleted);

                connector.GetGeofences(["all"]).done(r => {
                    this.layerGFs.clearLayers();
                    this.layerGFCompleted.clearLayers();
                    this.geofences = this.CurrentTrip.geofences = {};
                    this.geofenceList = r;
                    this.geofenceFindText = "429";
                    r.forEach(p => this.geofences[p.ID] = p);
                    this.geofenceLoaded = true;
                })
            }
        }, 1000);
    }

    updateSize() {
        let winH: number = (<number>$(window).height());

        let $info: JQuery = $("[data-id='info']");

        let $infoResult: JQuery = $("[data-id='info-result']");

        $("#map").height(winH - (<any>$(".fixed-top").outerHeight()));

        if ($info.is(':visible')) {
            $info.height(winH - (<any>$info.offset()).top);
        }

        if ($infoResult.is(':visible')) {
            $infoResult.height(winH - (<any>$infoResult.offset()).top);
        }
    }

    markersClear() {
        this.layerCars.clearLayers();
    }

    refreshPositions() {
        connector.GetOnlineInfo([this.groupActiveID])
            .done(r => {
                let bounds = L.latLngBounds([]);
                this.markersClear();
                r.filter(p => p != null && p._LastCoords != null)
                    .forEach(p => this.refreshPositionItem(p, bounds));

                if (this.map)
                    this.map.fitBounds(bounds);
            });
    }

    refreshPositionItem(p: IGetOnlineInfoItem, bounds: L.LatLngBounds) {
        let ll = L.latLng(p.LastPosition.Lat, p.LastPosition.Lng);
        let car = this.cars[p.ID];
        if (car) {
            L.marker(ll,
                <any>{
                    icon: markerGetIcon(p, car),
                    __id: p.ID
                })
                .bindTooltip(buildTooltip(car, this.carGroups[car.ParentID], p))
                .on("click", this.markerClick)
                .addTo(this.layerCars)
            bounds.extend(ll);
        }
    }

    markerClick(m: any) {
        let car: IEnumDeviceItem = this.cars[m.target.options.__id];
        let sd = moment().startOf('day').add('month', -1).toDate();
        let ed = moment(sd).add('day', 2).toDate();
        this.CurrentTrip.Build(car, sd, ed);
    }

    gotoPoint(ll: L.LatLng) {
        if (this.map)
            this.map.setView(ll, 17);
    }

    gotoGeofence(p: IGeofenceItem) {
        if (this.map)
            this.map.setView(L.latLng(p.Lat[0], p.Lng[0]), 17);
    }
}
