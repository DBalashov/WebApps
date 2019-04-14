import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {IGetOnlineInfoItem} from "../components/ServiceConnector";
import {store} from "../boot";

@Component
export default class GetOnlineInfoComponent extends VueEx {
    FinalData:any = {};

    updateItems() {
        this.updateDevices();
    }

    run() {
        this.connector.GetOnlineInfo(this.getCheckedIDs(store.state.Devices)).done((r:IGetOnlineInfoItem[]) => {
            this.Content = JSON.stringify(r, null, "  ");
            this.Items = r;
        });
    }
}