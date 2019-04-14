import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {store} from "../boot";
import {IEnumParameter} from "../components/ServiceConnector";

@Component
export default class EnumParametersComponent extends VueEx {
    updateItems() {
        this.updateDevices();
    }

    run() {
        this.connector.EnumParameters(this.getCheckedIDs(store.state.Devices)).done((r:IEnumParameter[]) => {
            this.Content = JSON.stringify(r, null, "  ");
            this.Items = r;
        });
    }
}