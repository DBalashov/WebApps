import {Component} from 'vue-property-decorator';
import {store} from "../boot";
import EnumBase from "./EnumBase";

@Component
export default class EnumImplementsComponent extends EnumBase {
    run() {
        this.updateImplements().done(r => this.Content = JSON.stringify(r));
    }

    getTree():string {
        return this.makeTree(store.state.Implements);
    }
}