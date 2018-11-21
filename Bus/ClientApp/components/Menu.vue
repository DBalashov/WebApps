<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
        <router-link :to="ExternalSettings.Urls.Relative" :exact="true" class="navbar-brand">BUS</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item dropdown" v-for="city in Items">
                    <a :class="'nav-link dropdown-toggle '+(city.active?'nav-link-selected':'')" href="#" :id="'navbarDropdown_'+city._id" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{city.name}}</a>
                    <div class="dropdown-menu" :aria-labelledby="'navbarDropdown_'+city._id">
                        <router-link :to="ExternalSettings.Urls.Relative + '/' + route.id" :class="'dropdown-item '+(route.active?'dropdown-item-selected':'')" v-for="route in city.routes" :key="route._id">{{route.name}}</router-link>
                    </div>
                </li>
            </ul>
            
            <ul class="navbar-nav flex-row">
                <li class="nav-item" :style="Busy?'':'display:none'">
                    <a class="nav-link btn-primary" style="color:white" href="#">Загрузка...</a>
                </li>
                <li class="nav-item">
                    <router-link :to="ExternalSettings.Urls.Relative + '/Edit'" class="nav-link" v-if="showEdit">Редактирование</router-link>
                </li>
                <li class="nav-item">
                    <a href="javascript:void(0)" class="nav-link" @click="aboutShow">О нас</a>
                </li>
            </ul>
        </div>
        <div class="modal" tabindex="-1" role="dialog" id="aboutInfo" data-backdrop="false">
            <div class="modal-dialog" role="document" style="max-width:400px;">
                <div class="modal-content" style="border-width: 5px; background: rgba(200, 200, 200, 1);">
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
                                    <h5 v-html="About.Name"></h5>
                                    <div v-if="About.Address.length" v-html="About.Address" class="mt-2"></div>
                                    <div v-if="About.Phones.length" v-html="About.Phones"></div>
                                    <div v-if="About.Url.length" class="mt-2">
                                        <a :href="'http://' + About.Url" target="_blank">{{About.Url}}</a>
                                    </div>
                                    <p v-if="About.Text" v-html="About.Text" class="mt-4"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script src="./Menu.ts"></script>