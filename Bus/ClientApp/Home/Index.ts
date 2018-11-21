import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import L from 'leaflet';
import _ from "lodash";
import $ from "jquery";
import Cookies from 'universal-cookie';
import {$bus, connector, ExternalSettings, settings} from "../boot";
import {IEnumDeviceItem, IGeofenceItem, IGetOnlineInfoItem} from "../components/ServiceConnector";

@Component
export default class HomeIndexComponent extends VueEx {
    carIDs: any = [];
    carsAll: any = {};
    needToFitBounds: boolean = true;
    map: L.Map | undefined;
    layerGeofences: L.LayerGroup = L.layerGroup([], {});
    layerPositions: L.LayerGroup = L.layerGroup([], {});
    layerPoints: L.LayerGroup = L.layerGroup([], {});
    pointName: string = "";
    currentTooltip: L.Tooltip | undefined;
    currentMarker: L.Marker | undefined;
    editMode: boolean = false;
    viewSettings = {
        Cars: [],
        GFs: []
    };
    cookies = new Cookies();

    created() {
        this.$watch("$route.params.id", () => this.changeRoute(this.$route.params.id));
        $(window).on("resize", this.updateSize);
        $bus.$on("mode.edit", this.modeEdit);
        $bus.$on("mode.save", () => this.modeSave());
        $bus.$on("mode.cancel", () => this.modeCancel());
        $bus.$on("map.goto", this.mapGoto);
    }
    
    pointAdd(ll: L.LatLng) {
        if(!this.editMode) return;
        
        let m = this.buildPointMarker(ll, "Stop #" + (this.layerPoints.getLayers().length + 1), true);
        m.on("click", () => this.pointEdit(m));
    }
    
    buildPointMarker(ll:L.LatLng, name: string, draggable:boolean):L.Marker {
        let tooltip = L.tooltip(
            {
                permanent: true,
                direction: "bottom",
                offset: [-2, 8]
            })
            .setContent(name);
        
        let m = L.marker(
            ll,
            {
                draggable: draggable,
                icon: L.divIcon({
                    html: ["<img src='", ExternalSettings.Urls.Content, "/stop.png'/>"].join(""),
                    iconSize: [28, 28],
                    className: "stop-marker"
                })
            })
            .bindTooltip(tooltip)
            .addTo(this.layerPoints);
        return m;
    }
    
    pointEdit(m:L.Marker) {
        if(!this.editMode) return;
        
        let t = m.getTooltip();
        if(t == null) return;
        
        let tc = t ? t.getContent() : null;
        this.pointName = tc ? tc.toString() : "";
        this.currentTooltip = t;
        this.currentMarker = m;
        (<any>$("#pointEdit")).modal('show');
    }

    pointSave() {
        (<any>$("#pointEdit")).modal('hide');
        if(this.currentTooltip)
            this.currentTooltip.setContent(this.pointName);
    }
    
    pointDelete() {
        (<any>$("#pointEdit")).modal('hide');
        if(this.currentMarker)
            this.layerPoints.removeLayer(this.currentMarker);
    }

    modeEdit() {
        this.editMode = true;
        this.layerPoints.clearLayers();
        let points = this.cookies.get("bus-points") || [];
        _(points).each((f:any) => {
            let m = this.buildPointMarker(L.latLng(f.ll.lat, f.ll.lng), f.name, true);
            m.on("click", () => this.pointEdit(m));
        });
    }
    
    modeSave() {
        this.editMode = false;

        let p: any[] = _(this.layerPoints.getLayers())
            .map((m: any) => {
                let ll = m.getLatLng();
                let content = m.getTooltip().getContent().toString();
                return {
                    ll: {lat: ll.lat, lng: ll.lng},
                    name: content
                }
            })
            .value();
        this.cookies.set("bus-points", JSON.stringify(p));
        this.updateSavedPoints();
        $bus.$emit("mode.update", p);
    }
    
    modeCancel() {
        this.editMode = false;
        this.updateSavedPoints();
    }
    
    updateSavedPoints():any[] {
        this.layerPoints.clearLayers();
        let points = this.cookies.get("bus-points") || [];
        _(points).each((f:any) => {
            this.buildPointMarker(L.latLng(f.ll.lat, f.ll.lng), f.name, false);
        });
        return points;
    }

    updateSize() {
        $("#map").height(
            (<any>$(window).height()) -
            (<any>$(".fixed-top").outerHeight()));
    }

    mounted() {
        this.updateSize();
        this.map = L.map('map', {preferCanvas: true});
        this.map
            .addLayer(L.tileLayer(
                //'//{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                '//{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',
                {
                    //subdomains: "abc",
                    //maxZoom: 19,
                    reuseTiles: true,
                    updateWhenIdle: true,
                    detectRetina: false
                }))
            .on("click", (ev:any) => this.pointAdd(ev.latlng))
            .setView([33.4501001, -101.9107704], 4)
            .addLayer(this.layerGeofences)
            .addLayer(this.layerPositions)
            .addLayer(this.layerPoints);

        connector.EnumDevices()
            .done(r => {
                let groups: any = {};
                _(r.Groups).each(g => groups[g.ID] = g);
                _(r.Items).each(i => this.refreshCarsInfoItem(groups, i));
                if (this.$route.params.id)
                    this.changeRoute(this.$route.params.id);
            });
        connector.DataLoad(settings.viewSettings).done((r: any) => {
            if (r && r[settings.viewSettings]) 
                this.viewSettings = JSON.parse(r[settings.viewSettings]);
        });
        
        let points = this.updateSavedPoints();
        $bus.$emit("mode.update", points);
        setInterval(this.refreshPositions, 100000);
    }

    refreshCarsInfoItem(groups: any, f: IEnumDeviceItem) {
        let item = this.carsAll[f.ID];
        if (item) {
        }
        else this.carsAll[f.ID] = item = f;

        item.group = item.ParentID ? groups[item.ParentID] : null;
        item.marker = null;
        item.position = null;
    }

    changeRoute(id: string) {
        this.markersClear();
        this.needToFitBounds = true;
        let newRoute: any = _(settings.routes).find((r: any) => r.id == id);
        if (newRoute.cars)
            this.carIDs = newRoute.cars;

        this.loadGeofences(newRoute);
        this.refreshPositions();
    }

    loadGeofences(newRoute: any) {
        this.layerGeofences.clearLayers();
        if (newRoute.geofences.length == 0) return;
        connector.GetGeofences(newRoute.geofences).done(r => {
            _(r).each(p => {
                if (p.IsPolygon) {
                    this.buildPolygon(p, this.layerGeofences);
                }
                else {
                    this.buildCircle(p, this.layerGeofences);
                }
            });
        })
    }
    
    buildPolygon(p:IGeofenceItem, targetLayer:L.LayerGroup) { // todo geofence properties
        let lls = this.convertLL(p.Lat, p.Lng);
        L.polygon(lls,
            {
                color: p.Line,
                fillColor: p.Fill,
                fillOpacity: 0.5,
                weight: 1,
            })
            .bindTooltip(p.Name)
            .addTo(targetLayer);
        L.marker(
            L.latLngBounds(lls).getCenter(),
            {
                icon: L.divIcon({
                    html: ["<img src='", ExternalSettings.Urls.Content, "/geofence.png' />"].join(""),
                    iconSize: [28, 28],
                    className: "gf-marker"
                })
            })
            .bindTooltip(p.Name)
            .addTo(targetLayer);
    }
    
    buildCircle(p:IGeofenceItem, targetLayer:L.LayerGroup) { // todo geofence properties
        if (p.R) {
            L.circle(L.latLng(p.Lat[0], p.Lng[0]),
                {
                    radius: p.R,
                    color: p.Line, fillColor: p.Fill
                })
                .bindTooltip(p.Name)
                .addTo(targetLayer);
        }
        L.marker(
            L.latLng(p.Lat[0], p.Lng[0]),
            {
                icon: L.divIcon({
                    html: ["<img src='", ExternalSettings.Urls.Content, "/geofence.png'/>"].join(""),
                    iconSize: [28, 28],
                    className: "gf-marker"
                })
            })
            .bindTooltip(p.Name)
            .addTo(targetLayer);
    }

    convertLL(lat: number[], lng: number[]): L.LatLng[] {
        let ll = [];
        for (let i = 0; i < lat.length; i++)
            ll.push(L.latLng(lat[i], lng[i]));
        return ll;
    }

    markersClear() {
        for (let i = 0; i < this.carIDs.length; i++) {
            let id = this.carIDs[i];
            let m = this.carsAll[id].marker;
            if (m)
                this.layerPositions.removeLayer(m);
            this.carsAll[id].marker = null;
        }
        this.carIDs = [];
    }

    refreshPositions() {
        if (this.carIDs.length == 0) return;
        if (this.layerPositions == null) return;

        connector.GetOnlineInfo(this.carIDs)
            .done(r => {
                let bounds = L.latLngBounds([]);
                _(r).filter((p: IGetOnlineInfoItem) => p != null && p._LastCoords != null)
                    .each((p: IGetOnlineInfoItem) => this.refreshPositionItem(p, bounds));

                if (this.map && this.needToFitBounds) {
                    this.map.fitBounds(bounds);
                    this.needToFitBounds = false;
                }
            });
    }

    refreshPositionItem(p: IGetOnlineInfoItem, bounds: L.LatLngBounds) {
        let ll = L.latLng(p.LastPosition.Lat, p.LastPosition.Lng);
        let car = this.carsAll[p.ID];
        car.position = p;

        let m: L.Marker = car.marker;
        if (m) {
            m.setIcon(this.markerGetIcon(p.Name, p.Course, p.Speed<0.5 ? "car-marker-blue" : "car-marker-green"));     

            let llOld = m.getLatLng();
            if(this.needToMove(llOld, ll))
                m.setLatLng(ll);
            
            let tooltip = m.getTooltip();
            if(tooltip)
                tooltip.setContent(this.buildTooltip(car, p));
        }
        else {
            this.carsAll[p.ID].marker =
                L.marker(ll, {icon: this.markerGetIcon(p.Name, p.Course, p.Speed<0.5 ? "car-marker-blue" : "car-marker-green")})
                    .bindTooltip(this.buildTooltip(car, p))
                    .addTo(this.layerPositions);
        }

        bounds.extend(ll);
    }
    
    needToMove(from:L.LatLng, to:L.LatLng) {
        return from.distanceTo(to) > 10;
    } 
    
    buildTooltip(car:any, p:IGetOnlineInfoItem):string {
        let group = car.group;
        let popupContent:string[] = [];
        popupContent.push("<strong>" + p.Name + "</strong>");
        
        //popupContent.push("<div class='float-right'>" + (((+new Date) - (+new Date(p._LastData)))/1000000) + "</div>");
        
        if(group)
            popupContent.push("Группа: " + group.Name);
        popupContent.push("Скорость: " + (p.Speed < 0.5 ? "Стоит" : p.Speed.toFixed(2)+" км/ч"));

        let propValues: any[] = [];
        if (car.Properties && car.Properties.length)
            _(this.viewSettings.Cars).each(f => {
                let propValue = _(car.Properties).find(pr => pr.Name == f);
                if (propValue && propValue.Value && propValue.Value.length)
                    propValues.push(propValue);
            });

        _(propValues).each((f:any) => popupContent.push(f.Name + ": " + (f.Value || "")));
        return popupContent.map(p => "<div>"+p+"</div>").join("");
    }

    markerGetIcon(name: string, course: number, image:string): L.DivIcon {
        return L.divIcon({
            html: ["<img src='", ExternalSettings.Urls.Content, "/", image, ".png' style='transform: rotate(", course.toString(), "deg)'/><div class='title'>", name, "</div>"].join(''),
            iconSize: [28, 28],
            className: "car-marker"
        })
    }
    
    mapGoto(lat:number, lng:number) {
        if(this.map)
            this.map.setView(L.latLng(lat, lng), 17);
    }
}