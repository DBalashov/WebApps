<template>
    <div class="col-12">
        <table class="table table-bordered">
            <tr>
                <th class="index">Trip#</th>
                <th class="date">SD</th>
                <th class="date">ED</th>
                <th>PointStart</th>
                <th>PointEnd</th>
            </tr>
            <tbody v-for="trip in Items">
            <tr>
                <td>{{trip.Index}}</td>
                <td>{{trip.SD}}</td>
                <td>{{trip.ED}}</td>
                <td>{{trip.PointStart.Lat.toFixed(7)}} / {{trip.PointStart.Lng.toFixed(7)}}</td>
                <td>{{trip.PointEnd.Lat.toFixed(7)}} / {{trip.PointEnd.Lng.toFixed(7)}}</td>
            </tr>
            <tr>
                <td colspan="5" class="pl-2 pt-2 pr-2">
                    <table class="table table-bordered" v-for="stage in trip.Stages">
                        <thead>
                        <tr>
                            <td colspan="7">Stage "<strong>{{stage.Name}}</strong>", Alias="<strong>{{stage.Alias}}</strong>"</td>
                        </tr>
                        <tr>
                            <th class="index">Index</th>
                            <th class="date">SD</th>
                            <th class="date">ED</th>
                            <th class="status">Status</th>
                            <th class="uid">StatusID</th>
                            <th>Caption</th>
                            <th>Params</th>
                        </tr>
                        </thead>
                        <tr v-for="sit in stage.Items">
                            <td>{{sit.Index}}</td>
                            <td>{{sit.SD}}</td>
                            <td>{{sit.ED}}</td>
                            <td>{{sit.Status}}</td>
                            <td>{{sit.StatusID}}</td>
                            <td>{{sit.Caption}}</td>
                            <td><param-items :Items="getParams(stage, sit)"/></td>
                        </tr>
                        <tr>
                            <td colspan="7"><a href="javascript:void(0)" @click="showTotal(stage.Total)">Show stage total values</a></td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td colspan="5"><a href="javascript:void(0)" @click="showTotal(trip.Total)">Show trip total values</a></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    export default {
        name: "TripItems",
        props: ["Items"],
        events: ["show.total"],
        data: function () {
            return {
                getParams: function (stage, si) {
                    var r = [];
                    for (var i = 0; i < stage.Params.length; i++)
                        r.push({
                            Name: stage.Params[i],
                            Value: si.Values[i]
                        });
                    return r;
                },
                showTotal: function(o) {
                    this.$emit('show-total', o);
                }
            }
        }
    }
</script>

<style scoped>

</style>