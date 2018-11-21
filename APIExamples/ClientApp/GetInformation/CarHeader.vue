<template>
    <div class="col-12">
        <div class="row">
            <div class="col-3">
                <div>Name: <strong>{{Item.Name}}</strong>, VRN: <strong>{{Item.VRN}}</strong></div>
                <div>Trips: <strong>{{Item.Trips.length}}</strong></div>
            </div>
            <div class="col-3">ID: <strong>{{Item.ID}}</strong></div>
            <div class="col-2" v-if="Item.LastCoords">LastCoords: <strong>{{Item.LastCoords}}</strong></div>
            <div class="col-2" v-if="Item.SD || Item.ED">
                <div>SD: <strong>{{Item.SD}}</strong></div>
                <div>ED: <strong>{{Item.ED}}</strong></div>
            </div>
            <div class="col-2">Serial=<strong>{{Item.Serial}}</strong></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CarHeader",
        props: ["Item"],
    }
</script>

<style scoped>

</style>