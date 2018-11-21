<template>
    <fieldset>
        <legend>Select elements</legend>
        <div v-if="store.state.Devices.Checked.length" class="items-list">
            <div v-for="o in store.state.Devices.Checked">
                <input type="checkbox" :id="o.ID" v-model="o.Checked"/><label :for="o.ID">{{o.Name}}<span>{{o.Data}}</span></label>
            </div>
        </div>
        <a href="javascript:void(0)" class="btn btn-primary mb-2" @click="updateItems" v-else>call EnumDevices first</a>
        <slot></slot>
    </fieldset>
</template>

<script>
    import _ from 'lodash';
    import {store,connector} from '../boot';
    
    export default {
        name: "SelectDevices",
        data: function () {
            return {
                store: store,
                updateItems: function () {
                    connector.EnumDevices().done(function (r) {
                        store.state.Devices.Items = r.Items;
                        store.state.Devices.Groups = r.Groups;
                        store.state.Devices.Checked = _(r.Items)
                            .map(function (it) {
                                return {
                                    ID: it.ID,
                                    Name: it.Name,
                                    Data: it.Serial.toString(),
                                    Checked: false,

                                    Items: it
                                }
                            })
                            .value();
                        return r;
                    });
                }
            }
        }
    }
</script>

<style scoped>

</style>