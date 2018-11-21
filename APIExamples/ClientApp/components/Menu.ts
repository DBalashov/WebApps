import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {$bus} from "../boot";

@Component
export default class MenuComponent extends VueEx {
    
    created() {
        $bus.$on("busy", (state:boolean) => {
            this.Busy = state;
        })
    }
    
    mounted() {

    }
}