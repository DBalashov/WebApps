<template>
    <div class="container pt-2 pb-2">
        <div class="row mb-2">
            <div class="col-6">
                <button type="button" class="btn btn-sm btn-primary" @click="cityAdd"><i class="fa fa-plus"></i>&nbsp;Добавить группу</button>
            </div>
            <div class="col-6" style="text-align: right">
                <button type="button" class="btn btn-sm btn-light" @click="viewSettingsEdit"><i class="fa fa-list"></i>&nbsp;Настройки отображения</button>
                <button type="button" class="btn btn-sm btn-light" @click="aboutEdit"><i class="fa fa-list"></i>&nbsp;Данные "О нас"</button>
                <button type="button" class="btn btn-sm btn-light" @click="save"><i class="fa fa-check"></i>&nbsp;Сохранить</button>
            </div>
        </div>
        <div class="row">
            <div class="col-sm-4" v-for="city in Items">
                <fieldset>
                    <legend><input type="text" class="form-control" v-model="city.name"/></legend>
                    
                    <div class="row mb-1 hover" v-for="route in city.routes">
                        <div class="col-7">
                            <input type="text" class="form-control" v-model="route.name"/>
                        </div>
                        <div class="col-5 commands pt-1 pr-0" style="text-align: right">
                            <div class="btn-group btn-group-sm" role="group">
                                <button type="button" class="btn btn-light" @click="routeCarsEdit(city.id, route.id)">
                                    <i class="fa fa-car"></i> <span v-if="route.cars.length">{{route.cars.length}}</span>
                                </button>
                                <button type="button" class="btn btn-light" @click="routeGeofencesEdit(city.id, route.id)">
                                    <i class="fa fa-map-marker"></i> <span v-if="route.geofences.length">{{route.geofences.length}}</span>
                                </button>
                                <button type="button" class="btn btn-light" @click="routeRemove(city.id, route.id)"><i class="fa fa-times"></i></button>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="btn btn-sm btn-primary float-left" @click="routeAdd(city.id)"><i class="fa fa-plus"></i>&nbsp;Добавить элемент</button>
                    <button type="button" class="btn btn-sm btn-light float-right" @click="cityRemove(city.id)"><i class="fa fa-times"></i>&nbsp;Удалить группу</button>
                </fieldset>
            </div>
        </div>
        <div class="modal" tabindex="-1" role="dialog" id="routeCarsEdit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Список машин</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" style="max-height:500px; overflow-y: scroll">
                        <table style="width:100%;" class="table">
                            <tr>
                                <th>Группа</th>
                                <th>Название</th>
                                <th>Госномер</th>
                                <th style="width:7em; text-align:right"># прибора</th>
                            </tr>
                            <tr v-for="o in Cars">
                                <td>
                                    <a href="javascript:void(0)" @click="groupCarSelect(o.Group.ID)" v-if="o.Group">{{o.Group?o.Group.Name:""}}</a>
                                </td>
                                <td>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" :id="'state_'+o.ID" class="custom-control-input" v-model="o.Checked"/>
                                        <label class="custom-control-label" :for="'state_'+o.ID">{{o.Name}}</label>
                                    </div>
                                </td>
                                <td>{{o.VRN}}</td>
                                <td style="text-align:right">{{o.Serial}}</td>
                            </tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="routeCarSave">Сохранить</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" tabindex="-1" role="dialog" id="routeGeofencesEdit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Список геозон</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" style="max-height:500px; overflow-y: scroll">
                        <table style="width:100%;" class="table">
                            <tr>
                                <th>Группа</th>
                                <th>Название</th>
                            </tr>
                            <tr v-for="o in Geofences">
                                <td>
                                    <a href="javascript:void(0)" @click="groupGFSelect(o.Group.ID)" v-if="o.Group">{{o.Group?o.Group.Name:""}}</a>
                                </td>
                                <td>
                                    <div class="custom-control custom-checkbox custom-control-inline">
                                        <input type="checkbox" :id="'state_'+o.ID" class="custom-control-input" v-model="o.Checked"/>
                                        <label class="custom-control-label" :for="'state_'+o.ID">{{o.Name}}</label>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="routeGeofenceSave">Сохранить</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" tabindex="-1" role="dialog" id="viewSettingsEdit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Настройки отображения</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-sm-6">
                                    <h5>Свойства ТС</h5>
                                    <table style="width:100%;">
                                        <tbody v-if="PropCars.length">
                                            <tr v-for="o in PropCars">
                                                <td>
                                                    <div class="custom-control custom-checkbox custom-control-inline">
                                                        <input type="checkbox" :id="'prop_car_state_'+o.Name" class="custom-control-input" v-model="o.Checked"/>
                                                        <label class="custom-control-label" :for="'prop_car_state_'+o.Name">{{o.Name}}</label>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <tbody v-else>
                                            <tr>
                                                <td>Нет свойств для отображения</td>
                                            </tr>
                                        </tbody>
                                    </table>            
                                </div>
                                <div class="col-sm-6">
                                    <h5>Свойства геозон</h5>
                                    <table style="width:100%;">
                                        <tbody v-if="PropGFs.length">
                                        <tr v-for="o in PropGFs">
                                            <td>
                                                <div class="custom-control custom-checkbox custom-control-inline">
                                                    <input type="checkbox" :id="'prop_gf_state_'+o.Name" class="custom-control-input" v-model="o.Checked"/>
                                                    <label class="custom-control-label" :for="'prop_gf_state_'+o.Name">{{o.Name}}</label>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                        <tbody v-else>
                                        <tr>
                                            <td>Нет свойств для отображения</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="viewSettingsSave">Сохранить</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal" tabindex="-1" role="dialog" id="aboutEdit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">О нас</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="aboutName">Название компании</label>
                                        <input type="text" class="form-control" id="aboutName" v-model="About.Name" autofocus>
                                    </div>
                                    <div class="form-group">
                                        <label for="aboutPhones">Телефоны</label>
                                        <input type="text" class="form-control" id="aboutPhones" v-model="About.Phones">
                                    </div>
                                    <div class="form-group">
                                        <label for="aboutAddress">Адрес</label>
                                        <input type="text" class="form-control" id="aboutAddress" v-model="About.Address">
                                    </div>
                                    <div class="form-group">
                                        <label for="aboutUrl">Сайт компании</label>
                                        <input type="text" class="form-control" id="aboutUrl" v-model="About.Url">
                                    </div>
                                    <div class="form-group">
                                        <label for="aboutText">Произвольный текст</label>
                                        <textarea class="form-control" id="aboutText" v-model="About.Text" style="height:8em"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="aboutSave">Сохранить</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./Index.ts"></script>
<style>
    html, body {
        overflow:auto;
    }

    fieldset {
        border: 1px solid silver;
        padding: 0.5em 1em;        
    }
    
    .hover .commands {
        opacity: 0.1;
    }
    
    .hover:hover .commands {
        opacity: initial;
    }
</style>