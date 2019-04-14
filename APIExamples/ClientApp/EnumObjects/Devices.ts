import {Component} from 'vue-property-decorator';
import {IEnumDeviceItem} from "../components/ServiceConnector";
import EnumBase from "./EnumBase";
import {store} from "../boot";

@Component
export default class EnumDevicesComponent extends EnumBase {
    getTree():string {
        return this.makeTree(store.state.Devices, (c:IEnumDeviceItem) => c.Serial.toString());
    }
    
    run() {
        this.updateDevices().done(r => this.Content = JSON.stringify(r, null, "  "));
    }
}