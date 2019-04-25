import moment from "moment";
import {IEnumCommonGroup, IEnumDeviceItem, IGeofenceItem, IGetOnlineInfoItem, ITripItem, ITripStage} from "../components/ServiceConnector"
import L from "leaflet"
import {ExternalSettings} from "../boot"
import _ from "lodash";

export function getDT(dt:any, asutc:boolean = false):any {
    let parsed = asutc ? moment.utc(dt).local() : moment(dt);
    return {
        D: parsed.format("DD.MM.YYYY"),
        T: parsed.format("HH:mm"),
        V: parsed.format("YYYYMMDDHHmm")
    };
}

export function formatDuration(d:string):any {
    let parsed = moment(d, 'HH:mm:ss');
    if (parsed.hours() == 0 && parsed.minutes() < 5) return "";
    return (parsed.hours() > 0 ? parsed.hours() + ' ч ' : '') + parsed.minutes() + " мин";
}

export function markerGetIcon(p: IGetOnlineInfoItem, car:IEnumDeviceItem): L.DivIcon {
    let lastData = ((+new Date()) - (<any>(moment(p._LastData).toDate()))) / 1000;

    return L.divIcon({
        html: ["<div class='car-marker__title title'>", car.Name, "</div><img src='", ExternalSettings.Urls.Image, "/Car/", car.ImageColored, "' class='car-marker__image' />"].join(''),
        className: "car-marker " + (lastData < (60*60*10*24) ? "" : "old-data")
    });
}

export function convertLL(lat: number[], lng: number[]): L.LatLng[] {
    let ll = [];
    for (let i = 0; i < lat.length; i++)
        ll.push(L.latLng(lat[i], lng[i]));
    return ll;
}

export function buildPolygon(p:IGeofenceItem, targetLayer:L.LayerGroup) { // todo geofence properties
    L.polygon(convertLL(p.Lat, p.Lng),
        <any>{
            color: p.Line,
            fillColor: p.Fill,
            fillOpacity: 0.5,
            weight: 1,
            __id: p.ID
        })
        .bindTooltip(p.Name)
        .addTo(targetLayer);
}

export function buildCircle(p:IGeofenceItem, targetLayer:L.LayerGroup, fillColor:string, onclickHandler:any) { // todo geofence properties
    if (p.R) {
        L.circle(L.latLng(p.Lat[0], p.Lng[0]),
            <any>{
                radius: p.R,
                color: p.Line,
                fillColor: fillColor || p.Fill,
                weight: 1,
                __id: p.ID
            })
            .bindTooltip(p.Name)
            .addTo(targetLayer)
            .on("click", onclickHandler);
    }
}

export function buildTooltip(car:IEnumDeviceItem, group:IEnumCommonGroup, p:IGetOnlineInfoItem): string {
    let popupContent:string[] = [];
    if(group)
        popupContent.push(group.Name);

    popupContent.push("<div><strong>" + p.Name + " (" + car.Serial.toString() + ")</strong></div>");
    popupContent.push("<table class='table mb-0'>");
    popupContent.push("<tbody>");
    popupContent.push("<tr><td>Скорость:</td><td class='text-right'>" + (p.Speed < 0.5 ? "Стоит" : p.Speed.toFixed(2)+" км/ч") + "</td></tr>");
    popupContent.push("<tr><td>Данные:</td><td class='text-right'>" + moment(p._LastData).fromNow() + "</td></tr>");
    popupContent.push("</tbody>");
    popupContent.push("</table>");

    let propValues: any[] = [];
    _(propValues).each((f:any) => popupContent.push(f.Name + ": " + (f.Value || "")));
    return popupContent.join("");
}


export function tripConvert(car:IEnumDeviceItem, sd:Date, ed:Date, trip:ITripItem, geofences:any):any {
    let r = {
        S: getDT(trip.SD),
        E: getDT(trip.ED),
        Items: [],
        SD: sd,
        ED: ed,
        Car: car,
        VRN: (_(car.Properties).find(p => p.Name == "VehicleRegNumber") || {Value: ""}).Value
    };

    let stage:ITripStage|undefined = _(trip.Stages).find(st => st.Name.indexOf("GeoFence") == 0);
    if(stage) {
        let parmDistanceIndex = stage.Params.indexOf('TotalDistance');
        let parmDurationMoveIndex = stage.Params.indexOf('MoveDuration');
        let parmDurationParkIndex = stage.Params.indexOf('ParkDuration');

        r.Items = <any> _(stage.Items)
            .chain()
            .map(sti => {
                if(sti.StatusIDs == null) {
                    let moveDuration = formatDuration(sti.Values[parmDurationMoveIndex]);
                    let parkDuration = formatDuration(sti.Values[parmDurationParkIndex]);

                    if(moveDuration || parkDuration)
                        return {
                            Type: 0,
                            MoveDuration: moveDuration,
                            ParkDuration: parkDuration
                        }
                    else
                        return { Type: -1 };
                }
                else {
                    return {
                        Type: 1,
                        S: getDT(sti.SD, true),
                        E: getDT(sti.ED, true),
                        GF: geofences[sti.StatusID],
                        PStart: L.latLng(sti.StartPoint.Lat, sti.StartPoint.Lng),
                        PEnd: L.latLng(sti.EndPoint.Lat, sti.EndPoint.Lng),
                        Distance: sti.Values[parmDistanceIndex]
                    }
                }
            })
            .value();
    }
    return r;
}
