import {Component} from 'vue-property-decorator';
import {VueEx} from "../VueEx";
import moment from "moment";

@Component
export default class DataSaveLoadComponent extends VueEx {
    EnumFilter: string = "*";
    NameFilter: string = "*";
    ItemsLoaded: any[] = [];
    Name: string="";
    Data: string="";
    
    run() {
        // this.connector.GetOnlineInfo(this.getCheckedIDs(store.state.Devices)).done((r:IGetOnlineInfoItem[]) => {
        //     this.Content = JSON.stringify(r);
        //     this.Items = r;
        // });
    }

    itemsEnum() {
        this.connector.DataEnum(this.EnumFilter).done(r => {
            let p = [];
            if (r)
                for (let it in r)
                    p.push({Name: it, Value: moment(r[it]).format("DD.MM.YYYY HH:mm:SS") });
            this.Items = p;
        });
    }

    itemLoad(name:string) {
        this.NameFilter = name;
        this.connector.DataLoad(name).done(r => {
            let p = [];
            if (r)
                for (let it in r)
                    p.push({
                        Name: it,
                        Value: r[it]
                    });
            this.ItemsLoaded = p;
        });
    }
    
    itemSave() {
        if (this.Name.length == 0) {
            alert("Name must be set!");
            return;
        }

        this.connector.DataSave(this.Name, this.Data).done((r: any) => {
            if (r) {
                alert("Item " + (this.Data.length ? "updated" : "deleted"));
                this.itemsEnum();
            }
            else {
                alert("Error occured");
            }
        });
    }
}