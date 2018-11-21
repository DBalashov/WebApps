import {Component} from 'vue-property-decorator';
import {IGetPropertiesResult} from "../components/ServiceConnector";
import {VueEx} from "../VueEx";
import {store} from "../boot";

@Component
export default class GetPropertiesDriversComponent extends VueEx {
    updateItems() {
        this.updateDrivers();
    }

    run() {
        this.connector.GetDriverProperties(this.getCheckedIDs(store.state.Drivers)).done((r:IGetPropertiesResult[]) => {
            this.Content = JSON.stringify(r);
            this.Items = r;
        });
    }
}