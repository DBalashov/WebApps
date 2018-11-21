import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {store} from "../boot";
import {IGetPropertiesResult} from "../components/ServiceConnector";

@Component
export default class GetPropertiesImplementsComponent extends VueEx {
    updateItems() {
        this.updateImplements();
    }

    run() {
        // this.connector.GetImplementProperties(this.getCheckedIDs(store.state.Devices)).done((r:IGetPropertiesResult[]) => {
        //     this.Content = JSON.stringify(r);
        //     this.Items = r;
        // });
    }
}