import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import L from 'leaflet';
import _ from "lodash";
import $ from "jquery";
import {$bus, connector} from "../boot";
import {IEnumDeviceItem, IGeofenceItem, IGetOnlineInfoItem, ITrackInfo} from "../components/ServiceConnector";
import moment from "moment";
import {buildCircle, buildPolygon, buildTooltip, getDT, markerGetIcon, tripConvert} from "./Extenders";

@Component
export default class HomeIndexComponent extends VueEx {
    carGroups:any = {};
    cars: any = {};
    geofences: any = {};

    geofenceLoaded: boolean = false;
    geofenceSelected: IGeofenceItem[] = [];
    geofenceFindText: string="";
    geofenceFindList: IGeofenceItem[] = [];
    geofenceList: IGeofenceItem[] = [];
    map: L.Map | undefined;

    layerGFCompleted: any = {};
    layerGFs: any = {};
    layerTrip: L.LayerGroup = L.layerGroup([], {});
    layerCars: L.LayerGroup = L.layerGroup([], {});
    groupActiveID: string = "";

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
                if(this.layerGFs.options) {
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
                            (e:any) => this.showTrips(this.geofences[e.target.options.__id]));
                    })
                }
            });
        })
    }

    mounted() {
        $('a[data-toggle="tab"]').on('shown.bs.tab', () => setTimeout(this.updateSize, 400));

        this.updateSize();
        this.map = L.map('map', {preferCanvas: true, renderer: L.canvas()});
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
            .addLayer(this.layerTrip);

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

    geofenceCompleted: any={};
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
                iconCreateFunction: function(c:any) {
                    return new L.DivIcon({
                        html: c ? c.getChildCount().toString() : "",
                        className: "cluster cluster-normal"
                    });
                }
            });

            this.layerGFCompleted = (<any>window)["L"].markerClusterGroup({
                iconCreateFunction: function(c:any) {
                    return new L.DivIcon({
                        html: c ? c.getChildCount().toString() : "",
                        className: "cluster cluster-completed"
                    });
                }
            });

            if(this.map) {
                this.map.addLayer(this.layerGFs);
                this.map.addLayer(this.layerGFCompleted);

                connector.GetGeofences(["all"]).done(r => {
                    this.layerGFs.clearLayers();
                    this.layerGFCompleted.clearLayers();
                    this.geofences = {};
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

                if(this.map)
                    this.map.fitBounds(bounds);
            });
    }

    refreshPositionItem(p: IGetOnlineInfoItem, bounds: L.LatLngBounds) {
        let ll = L.latLng(p.LastPosition.Lat, p.LastPosition.Lng);
        let car = this.cars[p.ID];
        if(car) {
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

    markerClick(m:any) {
        let car:IEnumDeviceItem = this.cars[m.target.options.__id];
        let sd = moment().startOf('day').add('month', -1).toDate();
        let ed = moment(sd).add('day', 2).toDate();
        this.tripBuild(car, sd, ed);
    }

    tripBuild(car:IEnumDeviceItem, sd:Date, ed:Date) {
        connector.GetTrips([car.ID], sd, ed, -1, ["TotalDistance", "MoveDuration", "ParkDuration"])
            .done(r => {
                let propVRN = car.Properties.filter(p => p.Name == "VehicleRegNumber");
                this.CurrentTrip = r.length == 0 || r[0].Trips.length == 0 ? {
                    SD: sd,
                    ED: ed,
                    Car: car,
                    VRN: propVRN.length ? propVRN[0].Value : "",
                    Items: [],
                    S: getDT(sd),
                    E: getDT(ed),
                } : tripConvert(car, sd, ed, r[0].Trips[0], this.geofences);
                if (this.CurrentTrip.Items.length == 0) this.layerTrip.clearLayers();
                else connector.GetTrack([car.ID], sd, ed)
                    .done(r => {
                        this.layerTrip.clearLayers();
                        if (r.length && r[0].Item && r[0].Item.length)
                            this.tripTrackBuild(r[0].Item[0]);
                    });
            });
    }

    tripShift(value:number) {
        if(this.CurrentTrip.SD)
            this.tripBuild(this.CurrentTrip.Car,
                moment(this.CurrentTrip.SD).add(value, 'days').toDate(),
                moment(this.CurrentTrip.ED).add(value, 'days').toDate());
    }

    tripTrackBuild(item:ITrackInfo) {
        let ll:L.LatLng[] = [];
        let bounds = L.latLngBounds([]);
        for(let i=0; i<item.Lat.length; i++) {
            let p = L.latLng(item.Lat[i], item.Lng[i]);
            ll.push(p);
            bounds.extend(p);
        }

        L.polyline(ll, {
            color:'green',
            weight: 8,
            opacity: 0.5
        }).addTo(this.layerTrip);

        for(let i=0, index=1; i < this.CurrentTrip.Items.length; i++) {
            let pnt = this.CurrentTrip.Items[i];
            if(pnt.Type>0) {
                L.marker(
                    pnt.PStart,
                    {
                        icon: L.divIcon({
                            html: ['<div>', (index + 1).toString(), '</div><div>', pnt.S.T, '</div>'].join(''),
                            className: "stop-point"
                        })
                    })
                    .bindTooltip(pnt.GF.Name)
                    .addTo(this.layerTrip);
                index++;
            }
        }

        if(this.map)
            this.map.fitBounds(bounds);
    }

    gotoPoint(ll:L.LatLng) {
        if(this.map)
            this.map.setView(ll, 17);
    }

    gotoGeofence(p:IGeofenceItem) {
        if(this.map)
            this.map.setView(L.latLng(p.Lat[0], p.Lng[0]), 17);
    }

    clearInfo() {
        this.layerTrip.clearLayers();
        this.CurrentTrip = {
            Items: []
        };
    }

    showTrips(p:IGeofenceItem) {
        let sd = moment().startOf('month').add('month', -1).toDate();
        let ed = new Date();

        this.GFTrips.S = getDT(sd);
        this.GFTrips.E = getDT(ed);
        this.GFTrips.Items = [];
        this.GFTrips.Name = p.Name;
        connector.CacheFind([], sd, ed, "GeoFence1", [p.ID])
            .done(r => {
                let items: any[] = [];
                r.forEach(f => {
                    f.Items.forEach(it => {
                        items.push({
                            S: getDT(it.SD, true),
                            E: getDT(it.ED, true),
                            Name: f.Name,
                            Serial: f.Serial
                        });
                    });
                });
                this.GFTrips.Items = items.sort((a,b) => a.S.V.localeCompare(b.S.V));
            });
    }

    GFTrips: any = {
        S: {D: "", T: ""},
        E: {D: "", T: ""},
        Name: "",
        Items: []
    }

    CurrentTrip: any = {
        Items: []
    };
}
