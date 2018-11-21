import {Component} from 'vue-property-decorator';
import $ from "jquery";
import {VueEx} from "../VueEx";
import {ITripTableResult} from "../components/ServiceConnector";
import {store} from "../boot";
import * as moment from "moment";
import _ from "lodash";

@Component
export default class GetTripsTablesComponent extends VueEx {
    SD: string = "";
    ED: string = "";
    formattedSD: string = "";
    formattedED: string = "";
    valueSD: number = 0;
    valueED: number = 0;
    onlineParams: string = "Dist,Move,Park,Speed,Motion";
    tripSplitterIndex: number = 0;
    formattedOnlineParams: string = "[]";

    mounted() {
        this.$watch("SD", () => {
            let d = moment(this.SD, this.FMT_FROM);
            this.formattedSD = d.format(this.FMT_TO);
            this.valueSD = d.toDate().getTime();
        });
        this.$watch("ED", () => {
            let d = moment(this.ED, this.FMT_FROM);
            this.formattedED = d.format(this.FMT_TO);
            this.valueED = d.toDate().getTime();
        });
        this.$watch("onlineParams", () => {
            this.formattedOnlineParams = _(this.onlineParams.split(","))
                .map((f: any) => "'" + f + "'")
                .value()
                .join(",");
        });
        this.SD = moment().startOf("day").format(this.FMT_FROM);
        this.ED = moment().format(this.FMT_FROM);
    }

    updateItems() {
        this.updateDevices();
    }
    
    Total:any[] = [];
    showTotal(o:any) {
        this.Total = [];
        for(let it in o)
            this.Total.push({Name:it, Value:o[it]});
        (<any>$("#showTotal")).modal('show');
    }

    run() {
        this.connector.GetTripTables(
            this.getCheckedIDs(store.state.Devices),
            new Date(this.valueSD),
            new Date(this.valueED),
            this.tripSplitterIndex,
            this.onlineParams.split(",")).done((r: ITripTableResult[]) => {
            this.Content = JSON.stringify(r);
            this.Items = r;
        });
    }
}