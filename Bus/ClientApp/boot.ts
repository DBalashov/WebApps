import './css/site.css';
import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import 'bootstrap';
import {ServiceConnector} from "./components/ServiceConnector";

export const ExternalSettings:IExternalSettings = (<any>window)["external-settings"];

export const settings = {
    routes: [{}],
    routeSettingName: "routes.json",
    viewSettings: "settings.json",
    aboutSettings: "about-us.json"
};

Vue.use(VueRouter);
Vue.component("MenuMain", require('./components/Menu.vue').default);
Vue.component("FooterMain", require('./components/Footer.vue').default);

export let $bus = new Vue({});

export let connector = new ServiceConnector(
    ExternalSettings.Urls.Service,
    ExternalSettings.Token,
    "BUS",
    ExternalSettings.Organization.UID,
    (state: boolean) => $bus.$emit("busy", state));

let routes:RouteConfig[] = [];
if(ExternalSettings && ExternalSettings.User && ExternalSettings.User.ID)
    routes.push({path: ExternalSettings.Urls.Relative + '/Edit', component: require('./Edit/Index.vue').default});
routes.push({path: ExternalSettings.Urls.Relative + '/:id', component: require('./Home/Index.vue').default});
routes.push({path: ExternalSettings.Urls.Relative, component: require('./Home/Index.vue').default});
routes.push({path: '*', component: require('./Home/NotImplemented.vue').default});

new Vue({
    el: '#app-root',
    router: new VueRouter({
        mode: 'history',
        routes: routes
    }),
    render: h => h(require('./app.vue').default)
}).$on("msg-info", (msg: string | string[], title: string) => {
    if (typeof(msg) == "string") {
    }
    else msg = msg.join("");

    // @ts-ignore
    //    vue.$snotify.success(msg, title);
    console.log(title + ": " + msg);
}).$on("msg-error", (msg: string | string[], title: string) => {
    if (typeof(msg) == "string") {
    }
    else msg = msg.join("");

    console.log(title + ": " + msg);
});