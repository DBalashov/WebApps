<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-4 pt-2">
                <select-devices>
                    <div class="row mt-3">
                        <div class="col-12">
                            <form>
                                <div class="form-group row">
                                    <label for="sd" class="col-4 col-form-label">Date (From/to)</label>
                                    <div class="col-4">
                                        <input type="text" class="form-control" id="sd" v-model="SD" placeholder="yyyyMMdd">
                                    </div>
                                    <div class="col-4">
                                        <input type="text" class="form-control" id="ed" v-model="ED" placeholder="yyyyMMdd">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="tripSplitterIndex" class="col-4 col-form-label">Trip splitter index</label>
                                    <div class="col-2">
                                        <input type="text" class="form-control" id="tripSplitterIndex" v-model="tripSplitterIndex">
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="tripParams" class="col-4 col-form-label">Trip params</label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" id="tripParams" v-model="tripParams">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </select-devices>
              
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
    IDs: [{{getChecked(store.state.Devices)}}],
    SD: "{{formattedSD}}",
    ED: "{{formattedED}}",
    tripSplitterIndex: {{tripSplitterIndex}},
    tripParams: "{{tripParams||''}}"
}).done((r: ITripResult[]) => {
    // result
})
</pre>
                        </div>

                    </div>
                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                        <div class="example">
<pre>
this.connector.GetTrips([
    {{getChecked(store.state.Devices)}}
],
    SD: new Date({{valueSD}}),
    ED: new Date({{valueED}}),
    {{tripSplitterIndex}},
    "{{formattedTripParams}}"
]).done((r: ITripResult[]) => {
    // result
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
                        <div class="items-2x" style="overflow-x:hidden">
                            <div class="row mb-3 trip-item" v-for="o in Items">
                                <car-header :Item="o"/>
                                <trip-items :Items="o.Trips" @show-total="showTotal"/>
                                <div><a href="javascript:void(0)" @click="showTotal(o.Total)">Show total values</a></div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="tab-pane fade" id="text-json" role="tabpanel">
                        <div v-html="Content" class="items"></div>
                    </div>
                </div>
            </div>
        </div>
        <show-dictionary :Item="Total" Caption="Total values"/>
    </div>
</template>

<script src="./GetTrips.ts"></script>