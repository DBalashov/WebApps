import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {$bus} from "../boot";

@Component
export default class FooterComponent extends VueEx {
    editMode: boolean=false;
    Items: any[] = [];

    created() {
        // this.$watch("$route.query.id", this.updateCurrentRoute);
        $bus.$on("mode.update", (newPoints: any[]) => {
            this.Items = newPoints.sort((a,b) => a.name.localeCompare(b.name));
        });
    }

    mounted() {
        
    }

    switchMode() {
        this.editMode = true;
        $bus.$emit("mode.edit", true);
    }

    editAccept() {
        this.editMode = false;
        $bus.$emit("mode.save");
    }
    
    editCancel() {
        this.editMode = false;
        $bus.$emit("mode.cancel");
    }
    
    mapGoto(lat:number, lng:number) {
        $bus.$emit("map.goto", lat, lng);
    }
}