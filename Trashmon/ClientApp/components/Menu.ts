import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import {$bus} from "../boot";
import {Vue} from "vue/types/vue";
import {IEnumCommonGroup} from "./ServiceConnector"
import _ from 'lodash';

@Component
export default class MenuComponent extends VueEx {
    $bus: Vue = $bus;
    CarGroups:IEnumCommonGroup[] = [];
    CarGroupID: string = "";
    
    GeoGroups: IEnumCommonGroup[] = [];
    GeoGroupID: string = "";
    
    created() {
        this.$bus = $bus;
    }
    
    mounted() {
        $bus.$on("busy", (state: boolean) => this.Busy = state);
        $bus.$on("car-groups-changed", (groups:any) => {
            this.CarGroups = this.preprocessGroups(groups);
            let rootGroup:any = _(this.CarGroups).find(f => !f.ParentID);
            this.changeCarGroup(rootGroup.ID);
        });

        $bus.$on("geo-groups-changed", (groups:any) => {
            this.GeoGroups = this.preprocessGroups(groups);
            this.changeGeoGroup("");
        });
    }
    
    preprocessGroups(groups:any):IEnumCommonGroup[] {
        let g: IEnumCommonGroup[] = [];
        let rootGroup: any = {};
        for (let groupID in groups) {
            let group = groups[groupID];
            if (group.ParentID) g.push(group);
            else rootGroup = group;
        }

        rootGroup.Name = "(все)";
        return _([rootGroup])
            .chain()
            .concat(
                _(groups)
                    .chain()
                    .filter(a => a.ParentID == rootGroup.ID)
                    .sortBy(a => a.Name).value()
            )
            .value()
    }

    changeCarGroup(id:string) {
        this.CarGroupID = id;
        $bus.$emit("car-group-changed", id);
    }

    changeGeoGroup(id:string) {
        this.GeoGroupID = id;
        $bus.$emit("geo-group-changed", id);
    }
}