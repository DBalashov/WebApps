<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-4 pt-2">
                <select-devices/>
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
$.post("{{ExternalSettings.Urls.Service}}/GetOnlineInfo",
{
    session: "{{shorten(ExternalSettings.Token)}}",
    schemaID: "{{ExternalSettings.Organization.UID}}",
    IDs: [{{getChecked(store.state.Devices)}}]
}).done((r: IGetPropertiesResult[]) => {
    // r.Items, r.Groups 
})
</pre>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div class="example">
<pre>
this.connector.GetOnlineInfo([
    {{getChecked(store.state.Devices)}}
]).done((r: IGetPropertiesResult[]) => {
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
                        <a class="nav-link" id="json-tab" data-toggle="tab" href="#text-json" role="tab" aria-selected="false">Result as JSON</a>
                    </li>
                </ul>
                <div class="tab-content">
                    <div class="tab-pane fade show active" id="grid-content" role="tabpanel">
                        <div class="row items-2x">
                            <table class="table" v-if="Items.length">
                                <tr>
                                    <th class="uid">ID</th>
                                    <th>Name</th>
                                    <th>DT</th>
                                    <th>LastCoords</th>
                                    <th style="width:15em">Speed/Course</th>
                                    <th style="width:11em">LastPosition</th>
                                    <th style="width:6em">Final data</th>
                                </tr>
                                <tr v-for="o in Items">
                                    <td>{{o.ID}}</td>
                                    <td>{{o.Name}}</td>
                                    <td>{{o.DT}}</td>
                                    <td>{{o.LastCoords}}</td>
                                    <td>Speed={{o.Speed.toFixed(2)}} km/h, Course={{o.Course.toFixed(1)}}</td>
                                    <td>{{o.LastPosition?o.LastPosition.Lat.toFixed(7) + " / " + o.LastPosition.Lng.toFixed(7):""}}</td>
                                    <td class="c">
                                        <a href="javascript:void(0)" @click="FinalData=o.Final">show</a>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="tab-pane fade" id="text-json" role="tabpanel">
                        <div v-html="Content" class="items"></div>
                    </div>
                </div>
                
                <show-dictionary :Item="FinalData" Caption="Final data"/>
            </div>
        </div>
    </div>
</template>

<script src="./GetOnlineInfo.ts"></script>