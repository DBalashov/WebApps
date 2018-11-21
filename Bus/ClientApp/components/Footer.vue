<template>
    <nav class="navbar navbar-expand-sm navbar-dark bg-dark fixed-bottom">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item" v-if="!editMode">
                <a href="javascript:void(0)" class="nav-link" @click="switchMode"><i class="fa fa-pencil"></i></a>
            </li>
            <li class="nav-item dropup" v-if="Items.length">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Мои остановки</a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                    <a href="javascript:void(0)" class="dropdown-item" v-for="o in Items" @click="mapGoto(o.ll.lat, o.ll.lng)">{{o.name}}</a>
                </div>
            </li>
            <li class="nav-item" v-if="editMode">
                <a href="javascript:void(0)" class="nav-link">Кликайте на карту для добавления точек</a>
            </li>
        </ul>
        
        <ul class="navbar-nav flex-row" v-if="editMode">
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link" @click="editAccept"><i class="fa fa-check"></i> Сохранить</a>
            </li>
            <li class="nav-item">
                <a href="javascript:void(0)" class="nav-link" @click="editCancel"><i class="fa fa-ban"></i> Отменить</a>
            </li>
        </ul>
    </nav>
</template>

<script src="./Footer.ts"></script>