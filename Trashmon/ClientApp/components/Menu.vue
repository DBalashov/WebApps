<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
        <router-link :to="ExternalSettings.Urls.Relative" :exact="true" class="navbar-brand">Trashmon</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-left">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Транспорт</a>
                    <div class="dropdown-menu">
                        <a :class="['dropdown-item', {'active':CarGroupID==g.ID}, {'separator':!g.ParentID}]" href="#" :id="'navbarDropdown_'+g.ID" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                           v-on:click="changeCarGroup(g.ID)"
                           v-for="g in CarGroups">{{g.Name}}</a>
                    </div>
                </li>
            </ul>

            <ul class="navbar-nav mr-left">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Геозоны</a>
                    <div class="dropdown-menu">
                        <a :class="['dropdown-item', {'active':!GeoGroupID}]" href="#" :id="'navbarDropdown_1'" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                           v-on:click="changeGeoGroup('')">(ничего)</a>

                        <a :class="['dropdown-item', {'active':GeoGroupID==g.ID}, {'separator':!g.ParentID}]" href="#" :id="'navbarDropdown_'+g.ID" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                           v-on:click="changeGeoGroup(g.ID)"
                           v-for="g in GeoGroups">{{g.Name}}</a>
                    </div>
                </li>
                <!--<li class="nav-item">-->
                    <!--<a :class="['nav-link', {'btn-primary':GeofenceOn}]" v-on:click="geofenceSwitch()" href="javascript:void(0)">Включить/выключить геозоны</a>-->
                <!--</li>-->
            </ul>

            <ul class="navbar-nav mr-auto" v-if="Busy">
                <li class="nav-item">
                    <a class="nav-link btn-primary" href="javascript:void(0)">Загрузка...</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script src="./Menu.ts"></script>
<style type="text/css" scoped>
    .separator {
        border-bottom: 1px solid silver;
        margin-bottom: 3px;
        padding-bottom: 8px;
    }
</style>
