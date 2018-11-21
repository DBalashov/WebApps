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
                    <table class="table table-bordered">
                        <tr>First 1000 items, total items: {{trip.DT.length}}</tr>
                        <tr>
                            <td v-for="value in getHeaders(trip)">{{value}}</td>
                        </tr>
                        <tr v-for="row in getValues(trip)">
                            <td v-for="value in row">{{value}}</td>
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
        name: "TripTableItems",
        props: ["Items"],
        events: ["show.total"],
        data: function () {
            return {
                getHeaders: function(trip) {
                    var headers = ["DT"];
                    for(var val=0; val < trip.Values.length; val++)
                        headers.push(trip.Values[val].Name);
                    return headers;
                },
                getValues: function (trip) {
                    var result = [];
                    for (var i = 0; i < Math.min(trip.DT.length, 1000); i++) {
                        var o = [trip.DT[i]];

                        for (var val = 0; val < trip.Values.length; val++) {
                            var v = trip.Values[val];
                            var value = v.Values[i];
                            if (v.Statuses.length) {
                                var suffix = "";
                                for (var k = 0; k < v.Statuses.length; k++)
                                    if (v.Statuses[k].Value == value) {
                                        suffix = " (" + v.Statuses[k].Caption + ")";
                                        break;
                                    }
                                o.push(v.Values[i] + suffix);
                            } else o.push(value);
                        }

                        result.push(o);
                    }
                    return result;
                }
            }
        }
    }
</script>

<style scoped>

</style>