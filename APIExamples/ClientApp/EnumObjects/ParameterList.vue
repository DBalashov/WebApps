<template>
    <table style="border-right:1px solid silver">
        <tr>
            <th colspan="2">{{Caption}}</th>
        </tr>
        <tr v-for="o in Items">
            <td>{{o.Name}}<span v-if="o.Statuses && o.Statuses.length" :title="'Statuses:' + getStatuses(o.Statuses)">*</span></td>
            <td title="ReturnType">[{{o.ReturnType}}]</td>
            <td>{{o.Caption}}</td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: "ParameterList",
        props: ["Items", "Caption"],
        data: function () {
            return {
                getStatuses: function (o) {
                    var p = [];
                    for (var i = 0; i < o.length; i++)
                        p.push("[" + o[i].Value + "] " + o[i].Caption);
                    return '\n' + p.join("\n");
                }
            }
        }
    }
</script>

<style scoped>

</style>