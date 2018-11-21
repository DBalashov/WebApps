import $ from "jquery";
import Vue from 'vue';
import {ExternalSettings} from "./boot";

export class VueEx extends Vue {
    public Busy: boolean = false;
    ExternalSettings = ExternalSettings;
    
    protected sendPost<T>(url: string, data: any): JQueryPromise<T> {
        return this.ajax<T>("POST", url, data);
    }

    protected sendGet<T>(url: string, data: any): JQueryPromise<T> {
        return this.ajax<T>("GET", url, data);
    }

    private ajax<T>(method: string, url:string, data:any):JQueryPromise<T> {
        let def = $.Deferred<T>();
        let me = this;
        this.Busy = true;
        $.ajax(url, {
            contentType: (data && typeof(data) == "string" ? "application/json" : "application/x-www-form-urlencoded") + "; charset=UTF-8",
            data: data,
            method: method,
            timeout: 5000,
            success: (r: any, textStatus: string) => {
                if (r.msg && r.msg.length) {
                    me.$root.$emit(r.ok ? "msg-info" : "msg-error", r.msg.join(''));
                    if (r.ok) def.resolve(r);
                }
                else def.resolve(r);
            },
            error: (r: any) => {
                me.$root.$emit("msg-error",
                    url,
                    r.responseJSON && r.responseJSON.msg
                        ? r.responseJSON.msg.join('')
                        : r.statusText);
            },
            complete: xhr => me.Busy = false,
        });
        return def.promise();
    }
}