import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import _ from "lodash";
import $ from "jquery";
import {connector, settings} from "../boot";
const uuid = require("uuid/v4"); 

@Component
export default class EditIndexComponent extends VueEx {
    ULogin:string = "";
    UPassword:string = "";
    Items: any[] = [];
    Cars: any[] = [];
    Geofences: any[] = [];
    
    created() {
        connector.EnumDevices()
            .done(r => {
                let groups:any = {};
                _(r.Groups).each(g => groups[g.ID] = g);
                
                this.Cars = _(r.Items)
                    .sortBy(c => c.Name)
                    .map(c => {
                        let propVRN = _(c.Properties).find(p => p.Name == "VehicleRegNumber");
                        return {
                            ID: c.ID,
                            Name: c.Name,
                            Serial: c.Serial,
                            Checked: false,
                            Group: c.ParentID ? groups[c.ParentID] : null,
                            VRN: propVRN ? propVRN.Value : ""
                        }
                    })
                    .value();
            });

        connector.EnumGeofences()
            .done(r => {
                let groups:any = {};
                _(r.Groups).each(g => groups[g.ID] = g);

                this.Geofences = _(r.Items)
                    .sortBy(c => c.Name)
                    .map(c => {
                        return {
                            ID: c.ID,
                            Name: c.Name,
                            Checked: false,
                            Group: c.ParentID ? groups[c.ParentID] : null
                        }
                    })
                    .value();
            });
    }

    mounted() {
        connector.DataLoad(settings.routeSettingName)
            .done((r:any) => {
                let items = r[settings.routeSettingName] ? JSON.parse(r[settings.routeSettingName]) : [];
                _(items).each((it:any) => {
                    _(it.routes).each(route => {
                        if(route.geofences) return;
                        route.geofences = [];    
                    });
                });
                this.Items = items;
            });
    }
    
    save() {
        connector.DataSave(settings.routeSettingName, JSON.stringify(this.Items))
            .done((r:any) => {
                alert("Сохранено");
            });
    }

    cityAdd() {
        this.Items.push({
            id: uuid(),
            name: "Город "+(this.Items.length+1),
            routes: []
        });
    }

    cityRemove(cityId: string) {
        this.$delete(this.Items, _(this.Items).findIndex((city: any) => city.id == cityId));
    }

    routeAdd(cityId: string) {
        let city = _(this.Items).find(city => city.id == cityId);
        city.routes.push({
            id: uuid(),
            name: "маршрут #" + city.routes.length,
            cars: [],
            geofences: []
        })
    }

    routeRemove(cityId: string, id: string) {
        let city = _(this.Items).find(city => city.id == cityId);
        this.$delete(city.routes, _(city.routes).findIndex((route: any) => route.id == id));
    }

    currentRoute:any = null;

    updateCurrentRoute(cityId: string, routeId: string) {
        let city = _(this.Items).find(city => city.id == cityId);
        this.currentRoute = _(city.routes).find(r => r.id == routeId);
    }
    
    // cars edit
    routeCarsEdit(cityId: string, routeId: string) {
        this.updateCurrentRoute(cityId, routeId);
        _(this.Cars).each(f => {
            f.Checked = _(this.currentRoute.cars).some(q => q == f.ID);
        });
        (<any>$("#routeCarsEdit")).modal('show');
    }
    
    routeCarSave(){
        this.currentRoute.cars = _(this.Cars)
            .chain()
            .filter(c => c.Checked)
            .map(c => c.ID)
            .value();
        (<any>$("#routeCarsEdit")).modal('hide');
    }
    
    groupCarSelect(id:string) {
        _(this.Cars).each(c => {
            if(c.Group && c.Group.ID == id)
                c.Checked = true;
        });
        this.$forceUpdate();
    }

    // geofences
    routeGeofencesEdit(cityId:string, routeId: string) {
        this.updateCurrentRoute(cityId, routeId);
        _(this.Geofences).each(f => {
            f.Checked = _(this.currentRoute.geofences).some(q => q == f.ID);
        });
        (<any>$("#routeGeofencesEdit")).modal('show');
    }

    groupGFSelect(id:string) {
        _(this.Geofences).each(c => {
            if(c.Group && c.Group.ID == id)
                c.Checked = true;
        });
        this.$forceUpdate();
    }

    routeGeofenceSave() {
        this.currentRoute.geofences = _(this.Geofences)
            .chain()
            .filter(c => c.Checked)
            .map(c => c.ID)
            .value();
        (<any>$("#routeGeofencesEdit")).modal('hide');
    }
    
    // view settings
    PropCars: any[] = [];
    PropGFs: any[] = [];
    
    viewSettingsEdit() {
        let d1 = $.Deferred();
        connector.EnumDevices().done(r => d1.resolve(r.Items));

        let d2 = $.Deferred();
        connector.EnumGeofences().done(r => d2.resolve(r.Items));
        
        let d3 = $.Deferred();
        connector.DataLoad(settings.viewSettings)
            .done((r:any) => d3.resolve(r[settings.viewSettings] ? r[settings.viewSettings] : null));
        
        $.when(d1,d2, d3).done((r1,r2,r3) => {
            let settings = r3 == null ? { Cars: [], GFs: [] } : JSON.parse(r3); 
            
            this.PropCars = this.convertProps(r1, settings.Cars);
            this.PropGFs = this.convertProps(r2, settings.GFs);
            (<any>$("#viewSettingsEdit")).modal('show');
        })
    }
    
    convertProps(items:any[], checkedItems:string[]):any[] {
        let props:any = {};
        _(items).each(it => {
            _(it.Properties).each(prop => {
                if(props[prop.Name]) return;
                props[prop.Name] = prop;
            })
        });

        let finalProps:any[] = [];
        for(let k in props) {
            let prop = props[k];
            finalProps.push({
                Name: prop.Name,
                Checked: _(checkedItems).some(f => f == prop.Name)
            });
        }
        return _(finalProps).sortBy(p => p.Name).value();
    }
    
    viewSettingsSave() {
        let data = {
            Cars: _(this.PropCars).filter(f => f.Checked).map(f => f.Name).value(),
            GFs: _(this.PropGFs).filter(f => f.Checked).map(f => f.Name).value()
        };
        
        connector.DataSave(settings.viewSettings, JSON.stringify(data))
            .done(() => (<any>$("#viewSettingsEdit")).modal('hide'));
    }
 
    About = {
        Name: "",
        Text: "",
        Url: "",
        Phones: "",
        Address: ""
    };
    
    aboutEdit() {
        connector.DataLoad(settings.aboutSettings)
            .done((data: any) => {
                this.About = data[settings.aboutSettings] ?
                    JSON.parse(data[settings.aboutSettings])
                    : {
                        Name: "",
                        Text: "",
                        Url: "",
                        Phones: "",
                        Address: ""
                    };

                (<any>$("#aboutEdit")).modal('show');
            });
    }
    
    aboutSave() {
        connector.DataSave(settings.aboutSettings, JSON.stringify(this.About))
            .done(data => (<any>$("#aboutEdit")).modal('hide'));
    }
}