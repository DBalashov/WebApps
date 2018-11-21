import './css/site.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import 'bootstrap';
import Vuex from 'vuex';
import {
    IEnumCommonGroup,
    IEnumCommonItem,
    ServiceConnector
} from "./components/ServiceConnector";

Vue.use(VueRouter);
Vue.use(Vuex);

export const ExternalSettings:IExternalSettings = (<any>window)["external-settings"];

export interface IElementItem {
    ID: string;
    Name: string;
    Data: string;
    Checked: boolean;
    
    Item: any
}

export interface IElementDataStore {
    Groups: IEnumCommonGroup[];
    Items: IEnumCommonItem[];
    Checked: IElementItem[]
}

export interface IDataStore {
    Devices: IElementDataStore,
    Geofences: IElementDataStore,
    Drivers: IElementDataStore,
    Implements: IElementDataStore;
}

export const store = new Vuex.Store<IDataStore>({
    state: {
        Devices: {Items:[], Groups:[], Checked: []},
        Geofences: {Items:[], Groups:[], Checked: []},
        Drivers: {Items:[], Groups:[], Checked: []},
        Implements: {Items:[], Groups:[], Checked: []}
    }
});

Vue.component("MenuMain", require('./components/Menu.vue').default);
Vue.component("PropertyItems", require('./GetProperties/PropertyItems.vue').default);
Vue.component("ParamItems", require('./GetInformation/ParamItems.vue').default);
Vue.component("TripItems", require('./GetInformation/TripItems.vue').default);
Vue.component("TripTableItems", require('./GetInformation/TripTableItems.vue').default);
Vue.component("CarHeader", require('./GetInformation/CarHeader.vue').default);
Vue.component("ParameterList", require('./EnumObjects/ParameterList.vue').default);
Vue.component("ShowDictionary", require('./components/ShowDictionary.vue').default);
Vue.component("SelectDevices", require('./components/SelectDevices.vue').default);

export let $bus = new Vue({});
export let connector = new ServiceConnector(ExternalSettings.Urls.Service, ExternalSettings.Token, "APIExamples", ExternalSettings.Organization.UID);
new Vue({
    el: '#app-root',
    router: new VueRouter({
        mode: 'history',
        routes: [
            { path: ExternalSettings.Urls.Relative + '/', component: require('./Home/Index.vue').default },
            
            { path: ExternalSettings.Urls.Relative + '/Enum/Devices', component: require('./EnumObjects/Devices.vue').default },
            { path: ExternalSettings.Urls.Relative + '/Enum/Geofences', component: require('./EnumObjects/Geofences.vue').default },
            { path: ExternalSettings.Urls.Relative + '/Enum/Drivers', component: require('./EnumObjects/Drivers.vue').default },
            { path: ExternalSettings.Urls.Relative + '/Enum/Implements', component: require('./EnumObjects/Implements.vue').default },
            { path: ExternalSettings.Urls.Relative + '/Enum/Parameters', component: require('./EnumObjects/Parameters.vue').default },
            
            { path: ExternalSettings.Urls.Relative + '/GetOnlineInfo', component: require('./GetInformation/GetOnlineInfo.vue').default },
            { path: ExternalSettings.Urls.Relative + '/GetTrips', component: require('./GetInformation/GetTrips.vue').default },
            { path: ExternalSettings.Urls.Relative + '/GetTripTables', component: require('./GetInformation/GetTripTables.vue').default },
            { path: ExternalSettings.Urls.Relative + '/Data', component: require('./Data/Data.vue').default },
            
            { path: ExternalSettings.Urls.Relative + '/GetProperties/Devices', component: require('./GetProperties/Devices.vue').default },
            { path: ExternalSettings.Urls.Relative + '/GetProperties/Drivers', component: require('./GetProperties/Drivers.vue').default },
            { path: ExternalSettings.Urls.Relative + '/GetProperties/Geofences', component: require('./GetProperties/Geofences.vue').default },
            { path: ExternalSettings.Urls.Relative + '/GetProperties/Implements', component: require('./GetProperties/Implements.vue').default },
            
            { path: '*', component: require('./Home/NotImplemented.vue').default }
        ]
    }),
    render: h => h(require('./app.vue').default)
}).$on("msg-info", (msg:string|string[], title: string) => {
    if(typeof(msg)=="string") {}
    else msg = msg.join("");

    // @ts-ignore
    //    vue.$snotify.success(msg, title);
    console.log(title + ": " + msg);
}).$on("msg-error", (msg:string|string[], title: string) => {
    if(typeof(msg)=="string") {}
    else msg = msg.join("");

    console.log(title + ": " + msg);
});