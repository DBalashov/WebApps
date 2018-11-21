import {Component} from 'vue-property-decorator';
import {IGetPropertiesResult} from "../components/ServiceConnector";
import {VueEx} from "../VueEx";
import {store} from "../boot";

@Component
export default class GetPropertiesGeofencesComponent extends VueEx {
    updateItems() {
        this.updateGeofences();
    }

    run() {
        this.connector.GetGFProperties(this.getCheckedIDs(store.state.Geofences)).done((r:IGetPropertiesResult[]) => {
            this.Content = JSON.stringify(r);
            this.Items = r;
        });
    }
}