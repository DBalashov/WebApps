<template>
    <div class="modal" tabindex="-1" role="dialog" id="showDictionary">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{Caption}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" style="max-height: 700px; overflow-y: auto;">
                    <table class="table">
                        <tr>
                            <th>Name</th>
                            <th>Value</th>
                        </tr>
                        <tr v-for="o in Data">
                            <td>{{o.Name}}</td>
                            <td>{{o.Value}}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import $ from 'jquery';
    export default {
        name: "ShowDictionary",
        props: ["Item", "Caption"],
        data: function () {
            return {
                Data: []
            }
        },
        watch: {
            Item: function () {
                var q = [];
                for (var it in this.Item)
                    q.push({Name: it, Value: this.Item[it]});
                this.Data = q;
                $("#showDictionary").modal('show');
            }
        }
    }
</script>

<style scoped>

</style>