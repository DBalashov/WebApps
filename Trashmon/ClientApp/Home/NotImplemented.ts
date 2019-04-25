import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";

@Component
export default class NotImplementedComponent extends VueEx {
    mounted() {
        this.refresh();
    }

    refresh() {
        // this.post("/Devices/Types/Load", {})
        //     .done((r: any) => {
        //         this.Items = r.Items;
        //     });
    }
}