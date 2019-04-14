import {VueEx} from "../VueEx";
import {IEnumCommonGroup} from "../components/ServiceConnector";
import {IElementDataStore} from "../boot";

export default class EnumBase extends VueEx {
    public Content: string = "";

    makeTree(ds:IElementDataStore, additionalInfo?: Function | undefined): string {
        if (ds.Groups.length == 0) return "No items";

        let html: string[] = [];
        ds.Groups
            .filter(g => g.ParentID == null)
            .forEach(g => this.getInner(ds, g, html, additionalInfo));
        return html.join('');
    }

    getInner(ds:IElementDataStore, group: IEnumCommonGroup, html: string[], additionalInfo: Function | undefined) {
        html.push("<div>" + group.Name + "</div>");

        let childGroups = ds.Groups.filter(f => f.ParentID == group.ID);
        let childItems = ds.Items.filter(f => f.ParentID == group.ID);
        if (childGroups.length || childItems.length) {
            html.push("<div class='child'>");
            childGroups.forEach(ch => this.getInner(ds, ch, html, additionalInfo));
            childItems.forEach(ch => html.push("<div>" + ch.Name + (additionalInfo == null ? "" : "  <span class='serial'>(" + additionalInfo(ch) + ")</span>")+"</div>"));
            html.push("</div>");
        }
    }

    propertiesShow() {
        alert("not implemented");
    }
}