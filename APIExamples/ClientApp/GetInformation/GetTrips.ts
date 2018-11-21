import {Component} from 'vue-property-decorator';
import $ from "jquery";
import {VueEx} from "../VueEx";
import {ITripResult} from "../components/ServiceConnector";
import {store} from "../boot";
import * as moment from "moment";
import _ from "lodash";

@Component
export default class GetTripsComponent extends VueEx {
    SD: string = "";
    ED: string = "";
    formattedSD: string = "";
    formattedED: string = "";
    valueSD: number = 0;
    valueED: number = 0;
    tripParams: string = "MoveDuration,TotalDuration,TotalDistance";
    tripSplitterIndex: number = 0;
    formattedTripParams: string = "[]";
    Total:any = {};

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
        this.$watch("tripParams", () => {
            this.formattedTripParams = _(this.tripParams.split(","))
                .map((f: any) => "'" + f + "'")
                .value()
                .join(",");
        });
        this.SD = moment().startOf("day").format(this.FMT_FROM);
        this.ED = moment().format(this.FMT_FROM);
    }
    
    showTotal(o:any) {
        this.Total = o;
    }

    run() {
        this.connector.GetTrips(
            this.getCheckedIDs(store.state.Devices),
            new Date(this.valueSD),
            new Date(this.valueED),
            this.tripSplitterIndex,
            this.tripParams.split(",")).done((r: ITripResult[]) => {
            this.Content = JSON.stringify(r);
            this.Items = r;
        });
    }
}