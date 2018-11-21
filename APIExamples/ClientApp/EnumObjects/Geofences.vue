<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-4 pt-2">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">JQuery</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">ServiceConnector class</a>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div class="example">
<pre>
$.post("{{ExternalSettings.Urls.Service}}/EnumGeofences",
{
    session: "{{shorten(ExternalSettings.Token)}}",
    schemaID: "{{ExternalSettings.Organization.UID}}"
}).done((r: IEnumGeofencesResult) => {
    // r.Items, r.Groups 
})
</pre>
                        </div>

                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="example">
<pre>
this.connector.EnumGeofences().done((r: IEnumGeofencesResult) => {
    // r.Items, r.Groups
})
</pre>
                        </div>
                    </div>
                </div>

                <div class="mt-2">
                    <a href="javascript:void(0)" class="btn btn-primary" @click="run">Execute</a>
                </div>
            </div>
            <div class="col-8">
                <ul class="nav nav-tabs pt-2" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="grid-tab" data-toggle="tab" href="#grid-content" role="tab" aria-selected="true">Result as grid</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="tree-tab" data-toggle="tab" href="#grid-tree" role="tab" aria-selected="false">Result as tree</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="json-tab" data-toggle="tab" href="#text-json" role="tab" aria-selected="false">Result as JSON</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="grid-content" role="tabpanel">
                        <div class="row items">
                            <table class="table" v-if="store.state.Geofences.Groups.length">
                                <tr>
                                    <th colspan="4">Groups</th>
                                </tr>
                                <tr>
                                    <th class="uid">ID</th>
                                    <th class="uid">ParentID</th>
                                    <th>Name</th>
                                    <th class="prop">Properties</th>
                                </tr>
                                <tr v-for="o in store.state.Geofences.Groups">
                                    <td>{{o.ID}}</td>
                                    <td>{{o.ParentID || 'null'}}</td>
                                    <td>{{o.Name}}</td>
                                    <td class="c">
                                        <a href="javascript:void(0)" @click="propertiesShow(o)">{{o.Properties && o.Properties.length ? o.Properties.length : 0}}</a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                        <div class="row items">
                            <table class="table" v-if="store.state.Geofences.Items.length">
                                <tr>
                                    <th colspan="5">Items</th>
                                </tr>
                                <tr>
                                    <th class="uid">ID</th>
                                    <th class="uid">ParentID</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th class="prop">Properties</th>
                                </tr>
                                <tr v-for="o in store.state.Geofences.Items">
                                    <td>{{o.ID}}</td>
                                    <td>{{o.ParentID || 'null'}}</td>
                                    <td>{{o.Name}}</td>
                                    <td>{{o.Image}}</td>
                                    <td class="c">
                                        <a href="javascript:void(0)" @click="propertiesShow(o)">{{o.Properties.length}}</a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="grid-tree" role="tabpanel">
                        <div style="width:100%;" v-html="getTree()" class="items"></div>
                    </div>
                    <div class="tab-pane fade" id="text-json" role="tabpanel">
                        <div v-html="Content" class="items"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./Geofences.ts"></script>