import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import _ from 'lodash';
import {$bus, connector, settings} from "../boot";
import {Vue} from "vue/types/vue";
import $ from "jquery";

@Component
export default class MenuComponent extends VueEx {
    Items: any[] = [];
    Breadcrumb: string[] = [];
    $bus: Vue = $bus;
    showEdit: boolean=false;

    created() {
        this.$watch("$route.params.id", this.updateCurrentRoute);
        this.$bus = $bus;
        if(this.ExternalSettings && this.ExternalSettings.User && this.ExternalSettings.User.ID>0)
            this.showEdit=true;
    }
    
    updateCurrentRoute() {
        let routeId = this.$route.params.id;
        let i = 1;
        this.Breadcrumb = [];
        settings.routes = [];
        _(this.Items).each((it:any) => {
            it.active = false;
            it._id = i++;
            if(it.routes) {
                _(it.routes).each((route: any) => {
                    route.active = routeId == route.id;
                    route._id = i++;
                    settings.routes.push(route);
                });
                
                let activeItem = _(it.routes).find(r => routeId == r.id);
                it.active = activeItem != null;
                if(it.active)
                    this.Breadcrumb.push(it.name);
                if(activeItem)
                    this.Breadcrumb.push(activeItem.name);
            }
        });
        this.$forceUpdate();
    }
    
    mounted() {
        $bus.$on("busy", (state: boolean) => this.Busy = state);

        connector.DataLoad(settings.routeSettingName)
            .done((r: any) => {
                this.Items = r && r[settings.routeSettingName] ? JSON.parse(r[settings.routeSettingName]) : [];
                this.updateCurrentRoute();
            });
    }

    menuRouteClick(id:string) {
        this.$router.push("/?id=" + id);
    }

    About = {
        Name: "",
        Text: "",
        Url: "",
        Phones: "",
        Address: ""
    };

    aboutShow() {
        connector.DataLoad(settings.aboutSettings).done((data: any) => {
            this.About = data && data[settings.aboutSettings] ?
                JSON.parse(data[settings.aboutSettings])
                : {
                    Name: "",
                    Text: "",
                    Url: "",
                    Phones: "",
                    Address: ""
                };

            (<any>$("#aboutInfo")).modal('show');
        });
    }
}