<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <router-link to="/" :exact="true" class="navbar-brand">API Examples</router-link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="enumObjects" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Enum objects</a>
                    <div class="dropdown-menu" aria-labelledby="enumObjects">
                        <router-link :to="ExternalSettings.Urls.Relative + '/Enum/Devices'" class="dropdown-item">Devices</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/Enum/Geofences'" class="dropdown-item">Geofences</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/Enum/Drivers'" class="dropdown-item">Drivers</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/Enum/Implements'" class="dropdown-item">Implements</router-link>
                        <div class="dropdown-divider"></div>
                        <router-link :to="ExternalSettings.Urls.Relative + '/Enum/Parameters'" class="dropdown-item">Parameters</router-link>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="getProperties" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Get properties</a>
                    <div class="dropdown-menu" aria-labelledby="getProperties">
                        <router-link :to="ExternalSettings.Urls.Relative + '/GetProperties/Devices'" class="dropdown-item">Devices</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/GetProperties/Geofences'" class="dropdown-item">Geofences</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/GetProperties/Drivers'" class="dropdown-item">Drivers</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/GetProperties/Implements'" class="dropdown-item">Implements</router-link>
                    </div>
                </li>
                <li class="nav-item">
                    <router-link :to="ExternalSettings.Urls.Relative + '/GetOnlineInfo'" class="nav-link">Get online information</router-link>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="getTrips" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Get trips/stages</a>
                    <div class="dropdown-menu" aria-labelledby="getTrips">
                        <router-link :to="ExternalSettings.Urls.Relative + '/GetTrips'" class="dropdown-item">GetTrips</router-link>
                        <router-link :to="ExternalSettings.Urls.Relative + '/GetTripTables'" class="dropdown-item">GetTripTables</router-link>
                    </div>
                </li>
                <li class="nav-item">
                    <router-link :to="ExternalSettings.Urls.Relative + '/Data'" class="nav-link">Data store/load</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="ExternalSettings.Urls.Relative + '/Reports'" class="nav-link">Reports</router-link>
                </li>
            </ul>
            <ul class="navbar-nav flex-row">
                <li class="nav-item" :style="Busy?'':'display:none'">
                    <a class="nav-link btn-primary" style="color:white" href="#">Загрузка...</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script src="./Menu.ts"></script>