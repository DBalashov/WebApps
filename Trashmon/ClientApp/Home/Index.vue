<template>
    <div class="row layout">
        <div class="col-9 layout__content">
            <div style="width:100%" id="map"></div>
        </div>
        <div class="col-3 layout__side">
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Оперативная информация</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" id="find-tab" data-toggle="tab" href="#find" role="tab" aria-controls="find" aria-selected="false">Поиск</a>
                </li>
            </ul>
            <div class="tab-content pt-3" id="myTabContent">
                <div class="tab-pane show active" id="home" role="tabpanel" aria-labelledby="home-tab"  style="overflow-y: auto; overflow-x:hidden; margin-right:1rem" data-id="info">
                    <div v-if="CurrentTrip.Car" class="form-group">
                        <table class="table text-muted">
                            <colgroup>
                                <col />
                                <col />
                                <col style="width: 1.25em;" />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th colspan="2">
                                        {{CurrentTrip.Car.Name}} ({{CurrentTrip.Car.Serial}}) - {{CurrentTrip.VRN}}
                                    </th>
                                    <th class="text-center">
                                        <a class="" href="javascript:void(0)" v-on:click="CurrentTrip.ClearTrip()"><i class="fa fa-times"></i></a>
                                    </th>
                                </tr>
                                <tr>
                                    <td>Начало периода</td>
                                    <td>{{CurrentTrip.S.D}} - {{CurrentTrip.S.T}}</td>
                                    <td class="text-center"><a href="javascript:void(0)" v-on:click="CurrentTrip.Shift(-1)"><i class="fa fa-chevron-up"></i></a></td>
                                </tr>
                                <tr>
                                    <td>Конец периода</td>
                                    <td>{{CurrentTrip.E.D}} - {{CurrentTrip.E.T}}</td>
                                    <td class="text-center"><a href="javascript:void(0)" v-on:click="CurrentTrip.Shift(1)"><i class="fa fa-chevron-down"></i></a></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <table v-if="CurrentTrip.Items.length">
                        <tr v-for="o in CurrentTrip.Items" v-if="o.Type>=0">
                            <td v-if="o.Type==0" colspan="2">
                                <span v-if="o.MoveDuration" class="badge badge-success">
                                    <i class="fa fa-play-circle"></i> движение: {{o.MoveDuration}}
                                </span>
                                <span v-if="o.ParkDuration" class="badge badge-primary">
                                    <i class="fa fa-stop-circle"></i> стоянка: {{o.ParkDuration}}
                                </span>
                            </td>

                            <td v-if="o.Type==1">{{o.S.T}}&thinsp;&ndash;&thinsp;{{o.E.T}}</td>
                            <td v-if="o.Type==1" class="pl-2">
                                <i class="fa fa-map-marker text-muted"></i>
                                <a href="javascript:void(0)" v-on:click="gotoPoint(o.PStart)">
                                    {{o.GF.Name}}
                                </a>
                            </td>
                        </tr>
                    </table>
                    <div v-else class="alert alert-primary" role="alert">
                        Нет рейсов за этот период
                    </div>
                </div>
                <div class="tab-pane mr-3" id="find" role="tabpanel" aria-labelledby="find-tab">
                    <form data-id="info-params">
                        <div class="form-row">
                            <div class="col-12 pt-1">
                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Введите название геозоны" v-model="geofenceFindText">
                                </div>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="col-12">
                                <div v-if="this.geofenceFindList.length" class="feedback alert alert-success" role="alert">
                                    Найдено геозон: {{this.geofenceFindList.length}}
                                </div>
                                <div v-else class="feedback alert alert-primary" role="alert">
                                    Не найдено ни одной геозоны
                                </div>
                            </div>
                        </div>
                        <div class="form-row form-group" v-if="this.geofenceFindList.length">
                            <div class="col-12" style="max-height: 10rem; overflow-y: auto;">
                                <table class="table table-hover">
                                    <tbody>
                                        <tr v-for="o in geofenceFindList">
                                            <td><a href="javascript:void(0)" v-on:click="gotoGeofence(o)">{{o.Name}}</a></td>
                                            <td class="text-right"><a href="javascript:void(0)" v-on:click="GFTrip.Show(o)">(рейсы)</a></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </form>
                    <div style="width:100%; overflow-y:auto" data-id="info-result">
                        <table style="width: 100%;" class="form-group text-muted" v-if="GFTrip.S.D">
                            <tr>
                                <td>Начало периода</td>
                                <td class="text-right">{{GFTrip.S.D}} - {{GFTrip.S.T}}</td>
                            </tr>
                            <tr>
                                <td>Конец периода</td>
                                <td class="text-right">{{GFTrip.E.D}} - {{GFTrip.E.T}}</td>
                            </tr>
                            <tr>
                                <td>Геозона</td>
                                <td class="text-right">{{GFTrip.Name}}</td>
                            </tr>
                        </table>
                        <template v-if="GFTrip.Items.length">
                            <table style="width:100%;" class="mt-1">
                                <tbody>
                                <tr v-for="o in GFTrip.Items">
                                    <td>{{o.S.D}} - {{o.S.T}}</td>
                                    <td>{{o.Name}}</td>
                                    <td>{{o.Serial}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </template>
                        <template v-else>
                            <div class="alert alert-primary" role="alert">
                                Не найдено ни одного рейса
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./Index.ts"></script>
<style type="text/css">
    .layout__content {
        padding-right: 0;
    }
    .layout__side {
        padding-top: 15px;
        border-left: 4px solid #343a40;
    }

    .stop-point {
        background-color: rgba(30,125,52, 0.7);
        color: white;
        border-radius: 50%;
        text-align: center;
        line-height: 1.1em;
        padding: 0;
        border: 2px solid #185a27;
        width: 2.6rem !important;
        height: 2.6rem !important;
        padding-top: 0.25rem;
    }

    td.between-time {
        font-size: 8pt;
        padding-top: 0;
        padding-bottom: 0;
        line-height: 1.1rem;
        color:silver;
        border:none;
    }

    .car-marker {
        width:auto !important;
        height:auto !important;
        background: rgba(255,255,255, 0.6);
        border-radius: 5px;
        border: 1.5px solid rgba(0,0,255, 0.4);
        padding:2px 2px 0 2px;
        text-align: center;
        box-shadow: 0 0 10px 0 rgba(0,0,0,0.25);
    }

    .car-marker:after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: -7px;
        margin-left: -6px;
        border-left: 6px solid transparent;
    	border-right: 6px solid transparent;
    	border-top: 6px solid rgba(0,0,255, 0.4);
        z-index: 1;
    }

    .car-marker.old-data {
        border-color: rgba(255,0,0,0.4);
    }
    .car-marker.old-data .car-marker__title {
        background: rgba(255,0,0,0.4);
    }

    .car-marker.old-data:after {
        border-top-color: rgba(255,0,0,0.4);
    }

    .car-marker__image {
        width: 36px;
    }

    .car-marker__title {
        position: absolute;
        left: 0;
        min-width: 100%;
        transform: translateY(-100%);
        margin-top: -6px;
        padding: 0 2px;
        font-size: 7pt;
        color: #fff;
        font-weight: normal;
        text-align:center;
        line-height: 1.1em;
        max-height: 2em;
        overflow:hidden;
        border-radius: 2px;
        background: rgba(255,0,0,0.4);
    }

    .cluster {
        width: 32px !important;
        height: 32px !important;
        border-radius: 50%;
        text-align: center;
        line-height: 32px !important;
        color: white;
        font-weight: normal;
        font-size: 10pt;
    }

    .cluster-normal {
        background-color: rgba(255,0,0,0.5);
        border: 1px solid red;
        box-shadow:0px 0px 10px 0px rgba(255,0,0,0.75);
    }

    .cluster-completed {
        background-color: rgba(0,255,0,0.5);
        border: 1px solid rgba(0,255,0,0.5);
        color: #212529;
        box-shadow:0px 0px 10px 0px rgba(0, 255, 0, 0.8);
    }
</style>
