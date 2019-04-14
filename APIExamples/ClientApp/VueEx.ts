import Vue from 'vue';
import {$bus, ExternalSettings, store, IDataStore, IElementDataStore} from "./boot";
import {IConvertedProperty, IEnumDevicesResult, IEnumDriversResult, IEnumGeofencesResult, IEnumImplementsResult, IGetPropertiesResult, ServiceConnector} from "./components/ServiceConnector";
import {Store} from "vuex";

export class VueEx extends Vue {
    public Busy: boolean = false;
    ExternalSettings = ExternalSettings;
    store:Store<IDataStore> = store;
    protected connector: ServiceConnector = new ServiceConnector(ExternalSettings.Urls.Service, ExternalSettings.Token, "APIExamples", ExternalSettings.Organization.UID, (state:boolean) => $bus.$emit("busy", state));
    protected FMT_FROM: string = "DD.MM.YYYY HH:mm";
    protected FMT_TO: string = "YYYYMMDD-HHmm";

    public Content:string="";
    public Items:any[] = [];

    getChecked(ds:IElementDataStore) {
        return ds.Checked
            .filter(it => it.Checked)
            .map(it => "'" + it.ID + "'")
            .join(",");
    }

    getCheckedIDs(ds:IElementDataStore): string[] {
        return ds.Checked
            .filter(it => it.Checked)
            .map(it => it.ID);
    }

    getProperty(r:IGetPropertiesResult):IConvertedProperty[] {
        let items: IConvertedProperty[] = [];
        if (r.Properties)
            for (let prop in r.Properties)
                items.push({
                    Name: prop,
                    Value: r.Properties[prop],
                    Type: r.PropertyTypes[prop]
                });
        return items;
    }
    
    shorten(s1:string) {
        if(s1.length<24) return s1;
        return s1.substring(0,8)+"........"+s1.substring(s1.length-8, s1.length);
    }
    
    updateDevices():JQueryPromise<IEnumDevicesResult> {
        return this.connector.EnumDevices().done((r: IEnumDevicesResult) => {
            store.state.Devices.Items = r.Items;
            store.state.Devices.Groups = r.Groups;
            store.state.Devices.Checked = <any> r.Items
                .map(it => {
                    return {
                        ID: it.ID,
                        Name: it.Name,
                        Data: it.Serial.toString(),
                        Checked: false,

                        Items: it
                    }
                });
            return r;
        });
    }

    updateGeofences():JQueryPromise<IEnumGeofencesResult> {
        return this.connector.EnumGeofences().done((r: IEnumGeofencesResult) => {
            store.state.Geofences.Items = r.Items;
            store.state.Geofences.Groups = r.Groups;
            store.state.Geofences.Checked = <any> r.Items
                .map(it => {
                    return {
                        ID: it.ID,
                        Name: it.Name,
                        Data: "",
                        Checked: false,

                        Items: it
                    }
                });
            return r;
        });
    }

    updateDrivers():JQueryPromise<IEnumDriversResult> {
        return this.connector.EnumDrivers().done((r:IEnumDriversResult) => {
            store.state.Drivers.Items = r.Items;
            store.state.Drivers.Groups = r.Groups;
            store.state.Drivers.Checked = <any>r.Items
                .map(it => {
                    return {
                        ID: it.ID,
                        Name: it.Name,
                        Data: it.DriverID,
                        Checked: false,

                        Items: it
                    }
                });
            return r;
        });
    }

    updateImplements():JQueryPromise<IEnumImplementsResult> {
        return this.connector.EnumImplements().done((r:IEnumImplementsResult) => {
            store.state.Implements.Items = r.Items;
            store.state.Implements.Groups = r.Groups;
            store.state.Implements.Checked = <any>r.Items
                .map(it => {
                    return {
                        ID: it.ID,
                        Name: it.Name,
                        Data: "",
                        Checked: false,

                        Items: it
                    }
                });
            return r;
        });
    }
}