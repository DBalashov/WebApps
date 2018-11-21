<template>
    <div>
        <div class="props-list">
            <div v-for="prop in Items">
                <div class="prop-name">{{prop.Name}}</div>
                <div class="prop-value">{{prop.Value}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "ParamItems",
        props: ["Items"]
    }
</script>