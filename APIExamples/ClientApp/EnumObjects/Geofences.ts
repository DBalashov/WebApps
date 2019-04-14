import {Component} from 'vue-property-decorator';
import {store} from "../boot";
import EnumBase from "./EnumBase";

@Component
export default class EnumGeofencesComponent extends EnumBase {
    run() {
        this.updateGeofences().done(r => this.Content = JSON.stringify(r, null, "  "));
    }

    getTree():string {
        return this.makeTree(store.state.Geofences);
    }
}