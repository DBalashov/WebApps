import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {store} from "../boot";
import {IGetPropertiesResult} from "../components/ServiceConnector";

@Component
export default class GetPropertiesDevicesComponent extends VueEx {
    run() {
        this.connector.GetProperties(this.getCheckedIDs(store.state.Devices)).done((r:IGetPropertiesResult[]) => {
            this.Content = JSON.stringify(r, null, "  ");
            this.Items = r;
        });
    }
}