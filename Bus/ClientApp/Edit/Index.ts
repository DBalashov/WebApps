import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
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
                r.Groups.forEach(g => groups[g.ID] = g);
                
                this.Cars = r.Items
                    .sort((a,b) => a.Name.localeCompare(b.Name))
                    .map(c => {
                        let propVRN = c.Properties.filter(p => p.Name == "VehicleRegNumber");
                        return {
                            ID: c.ID,
                            Name: c.Name,
                            Serial: c.Serial,
                            Checked: false,
                            Group: c.ParentID ? groups[c.ParentID] : null,
                            VRN: propVRN.length ? propVRN[0].Value : ""
                        }
                    });
            });

        connector.EnumGeofences()
            .done(r => {
                let groups:any = {};
                r.Groups.forEach(g => groups[g.ID] = g);
                
                this.Geofences = r.Items
                    .sort((a,b) => a.Name.localeCompare(b.Name))
                    .map(c => {
                        return {
                            ID: c.ID,
                            Name: c.Name,
                            Checked: false,
                            Group: c.ParentID ? groups[c.ParentID] : null
                        }
                    });
            });
    }

    mounted() {
        connector.DataLoad(settings.routeSettingName)
            .done((r:any) => {
                let items:any[] = r[settings.routeSettingName] ? JSON.parse(r[settings.routeSettingName]) : [];
                items.forEach(it => {
                    it.routes.forEach((route:any) => {
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
        this.$delete(this.Items, this.Items.indexOf((city:any) => city.id == cityId));
    }

    routeAdd(cityId: string) {
        let city:any[] = this.Items.filter(city => city.id == cityId);
        if(city.length)
            city[0].routes.push({
                id: uuid(),
                name: "маршрут #" + city[0].routes.length,
                cars: [],
                geofences: []
            });
    }

    routeRemove(cityId: string, id: string) {
        let city = this.Items.filter(city => city.id == cityId);
        if (city.length)
            this.$delete(city[0].routes, city[0].routes.indexOf((route: any) => route.id == id));
    }

    currentRoute:any = null;

    updateCurrentRoute(cityId: string, routeId: string) {
        let city = this.Items.filter(city => city.id == cityId);
        if(city.length)
            this.currentRoute = city[0].routes.filter((r:any) => r.id == routeId)[0];
    }
    
    // cars edit
    routeCarsEdit(cityId: string, routeId: string) {
        this.updateCurrentRoute(cityId, routeId);
        this.Cars.forEach(f => f.Checked = this.currentRoute.cars.filter((q: any) => q == f.ID).length > 0);
        (<any>$("#routeCarsEdit")).modal('show');
    }
    
    routeCarSave(){
        this.currentRoute.cars = this.Cars
            .filter(c => c.Checked)
            .map(c => c.ID);
        (<any>$("#routeCarsEdit")).modal('hide');
    }
    
    groupCarSelect(id:string) {
        this.Cars.forEach(c => {
            if(c.Group && c.Group.ID == id)
                c.Checked = true;
        });
        this.$forceUpdate();
    }

    // geofences
    routeGeofencesEdit(cityId:string, routeId: string) {
        this.updateCurrentRoute(cityId, routeId);
        this.Geofences.forEach(f => {
            f.Checked = this.currentRoute.geofences.filter((q:any) => q == f.ID).length>0;
        });
        (<any>$("#routeGeofencesEdit")).modal('show');
    }

    groupGFSelect(id:string) {
        this.Geofences.forEach(c => {
            if(c.Group && c.Group.ID == id)
                c.Checked = true;
        });
        this.$forceUpdate();
    }

    routeGeofenceSave() {
        this.currentRoute.geofences = this.Geofences
            .filter(c => c.Checked)
            .map(c => c.ID);
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
            .done((r:any) => {
                d3.resolve(r && r[settings.viewSettings] ? r[settings.viewSettings] : null);
            });
        
        $.when(d1,d2, d3).done((r1,r2,r3) => {
            let settings = r3 == null ? { Cars: [], GFs: [] } : JSON.parse(r3); 
            
            this.PropCars = this.convertProps(r1, settings.Cars);
            this.PropGFs = this.convertProps(r2, settings.GFs);
            (<any>$("#viewSettingsEdit")).modal('show');
        })
    }
    
    convertProps(items:any[], checkedItems:string[]):any[] {
        let props:any = {};
        items.forEach(it => {
            it.Properties.forEach((prop:any) => {
                if(props[prop.Name]) return;
                props[prop.Name] = prop;
            })
        });

        let finalProps:any[] = [];
        for(let k in props) {
            let prop = props[k];
            finalProps.push({
                Name: prop.Name,
                Checked: checkedItems.filter(f => f == prop.Name).length>0
            });
        }
        return finalProps.sort((a,b) => a.Name.localeCompare(b.Name));
    }
    
    viewSettingsSave() {
        let data = {
            Cars: this.PropCars.filter(f => f.Checked).map(f => f.Name),
            GFs: this.PropGFs.filter(f => f.Checked).map(f => f.Name)
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
            .done(data => {
                this.About = data && data[settings.aboutSettings] ?
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