import {Component} from 'vue-property-decorator';
import {store} from "../boot";
import {IEnumDriverItem} from "../components/ServiceConnector";
import EnumBase from "./EnumBase";

@Component
export default class EnumDriversComponent extends EnumBase {
    run() {
        this.updateDrivers().done(r => this.Content = JSON.stringify(r));
    }

    getTree():string {
        return this.makeTree(store.state.Drivers, (c:IEnumDriverItem) => c.DriverID);
    }
}