<template>
    <table class="table" v-if="Items.length">
        <tr>
            <th class="uid">ID</th>
            <th style="width:30%;">Name</th>
            <th>Properties</th>
        </tr>
        <tr v-for="o in Items">
            <td>{{o.ID}}</td>
            <td>{{o.Name}}</td>
            <td>
                <div class="props-list">
                    <div v-for="prop in getProperty(o)">
                        <div class="prop-name">{{prop.Name}}</div>
                        <div class="prop-type">{{prop.Type}}</div>
                        <div class="prop-value">{{prop.Value}}</div>
                    </div>
                </div>
            </td>
        </tr>
    </table>
</template>

<script>
    export default {
        name: "PropertyItems",
        props: ["Items"],
        data: function () {
            return {
                getProperty: function(r) {
                    var items = [];
                    if (r.Properties)
                        for (var prop in r.Properties)
                            items.push({
                                Name: prop,
                                Value: r.Properties[prop],
                                Type: r.PropertyTypes[prop]
                            });
                    return items;
                }
            }
        }
    }
</script>
