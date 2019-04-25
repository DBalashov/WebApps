import {IEnumDeviceItem, ITrackInfo, ServiceConnector} from "../components/ServiceConnector"
import {formatDuration, getDT} from "./Extenders"
import moment from "moment";
import L from "leaflet"

export class CarTrip {
    public SD: Date = new Date();
    public S: string = "";
    public ED: Date = new Date();
    public E: string = "";
    
    public Car: IEnumDeviceItem | undefined;
    public VRN: string = "";
    public Items: any[] = [];

    connector: ServiceConnector;
    geofences: any = {};

    map: L.Map | undefined;
    layerTrip: L.LayerGroup = L.layerGroup([], {});

    constructor(connector: ServiceConnector) {
        this.connector = connector;
    }

    public Build(car: IEnumDeviceItem, sd: Date, ed: Date) {
        this.Car = car;

        this.connector.GetTrips([car.ID], sd, ed, -1, ["TotalDistance", "MoveDuration", "ParkDuration"])
            .done(r => {
                let propVRN = car.Properties.filter(p => p.Name == "VehicleRegNumber");

                this.Items = [];
                this.SD = sd;
                this.ED = ed;

                if (r.length == 0 || r[0].Trips.length == 0) {
                    this.VRN = propVRN.length ? propVRN[0].Value : "",

                        this.S = getDT(sd);
                    this.E = getDT(ed);
                } else {
                    let trip = r[0].Trips[0];

                    this.S = getDT(trip.SD);
                    this.E = getDT(trip.ED);
                    let propVRN = car.Properties.filter(p => p.Name == "VehicleRegNumber");
                    this.VRN = propVRN.length ? propVRN[0].Value : "";

                    trip.Stages
                        .filter(stage => stage.Name.indexOf("GeoFence") == 0)
                        .forEach(stage => {
                            let parmDistanceIndex = stage.Params.indexOf('TotalDistance');
                            let parmDurationMoveIndex = stage.Params.indexOf('MoveDuration');
                            let parmDurationParkIndex = stage.Params.indexOf('ParkDuration');
                            this.Items = stage.Items
                                .map(sti => {
                                    if (sti.StatusIDs == null) {
                                        let moveDuration = formatDuration(sti.Values[parmDurationMoveIndex]);
                                        let parkDuration = formatDuration(sti.Values[parmDurationParkIndex]);
                                        if (moveDuration || parkDuration)
                                            return {
                                                Type: 0,
                                                MoveDuration: moveDuration,
                                                ParkDuration: parkDuration
                                            }
                                        else
                                            return {Type: -1};
                                    } else {
                                        return {
                                            Type: 1,
                                            S: getDT(sti.SD, true),
                                            E: getDT(sti.ED, true),
                                            GF: this.geofences[sti.StatusID],
                                            PStart: L.latLng(sti.StartPoint.Lat, sti.StartPoint.Lng),
                                            PEnd: L.latLng(sti.EndPoint.Lat, sti.EndPoint.Lng),
                                            Distance: sti.Values[parmDistanceIndex]
                                        }
                                    }
                                });
                        })
                }
                if (this.Items.length == 0) this.layerTrip.clearLayers();
                else this.connector.GetTrack([car.ID], sd, ed)
                    .done(r => {
                        this.layerTrip.clearLayers();
                        if (r.length && r[0].Item && r[0].Item.length)
                            this.trackBuild(r[0].Item[0]);
                    });
            });
    }

    public Shift(value: number) {
        if (this.SD && this.Car)
            this.Build(this.Car,
                moment(this.SD).add(value, 'days').toDate(),
                moment(this.ED).add(value, 'days').toDate());
    }

    trackBuild(item: ITrackInfo) {
        let ll: L.LatLng[] = [];
        let bounds = L.latLngBounds([]);
        for (let i = 0; i < item.Lat.length; i++) {
            let p = L.latLng(item.Lat[i], item.Lng[i]);
            ll.push(p);
            bounds.extend(p);
        }

        L.polyline(ll, {
            color: 'green',
            weight: 8,
            opacity: 0.5
        }).addTo(this.layerTrip);

        for (let i = 0, index = 1; i < this.Items.length; i++) {
            let pnt = this.Items[i];
            if (pnt.Type > 0) {
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

        if (this.map)
            this.map.fitBounds(bounds);
    }

    public ClearTrip() {
        this.layerTrip.clearLayers();
        this.Items = [];
    }
}