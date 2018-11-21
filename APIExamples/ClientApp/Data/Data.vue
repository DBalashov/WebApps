<template>
    <div class="container-fluid">
        <div class="row mt-2">
            <div class="col-4">
                <fieldset class="pb-2">
                    <legend>Enum data items</legend>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">Filter</label>
                        </div>
                        <div class="col-10">
                            <input type="text" class="form-control" v-model="EnumFilter"/>
                        </div>
                    </div>
                    <div v-if="Items.length">
                        <table class="table" style="width:100%;">
                            <tr>
                                <th>Name</th>
                                <th>Last modified (UTC)</th>
                            </tr>
                            <tr v-for="o in Items">
                                <td><a href="javascript:void(0)" title="Click to load" @click="itemLoad(o.Name)">{{o.Name}}</a></td>
                                <td>{{o.Value}}</td>
                            </tr>
                        </table>
                    </div>
                    <div v-else>No items loaded</div>
                    <div>
                        <a href="javascript:void(0)" class="btn btn-primary" @click="itemsEnum">Execute</a>
                    </div>
                </fieldset>
            </div>
            <div class="col-4">
                <fieldset class="pb-2">
                    <legend>Load data</legend>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">Filter</label>
                        </div>
                        <div class="col-10">
                            <input type="text" class="form-control" v-model="NameFilter"/>
                        </div>
                    </div>
                    <div v-if="ItemsLoaded.length" class="row">
                        <div class="col-12 items-2x">
                            <div class="card mt-2" v-for="o in ItemsLoaded">
                                <div class="card-header">{{o.Name}}</div>
                                <div class="card-body">
                                    <p class="card-text">{{o.Value}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>No items loaded</div>
                    <div class="mt-2">
                        <a href="javascript:void(0)" class="btn btn-primary" @click="itemLoad(NameFilter)">Execute</a>
                    </div>
                </fieldset>
            </div>
            <div class="col-4">
                <fieldset class="pb-2">
                    <legend>Save data</legend>
                    <div class="row">
                        <div class="col-2">
                            <label class="col-form-label">Name</label>
                        </div>
                        <div class="col-10">
                            <input type="text" class="form-control" v-model="Name"/>
                        </div>
                    </div>
                    <div class="row mt-2 mb-2">
                        <div class="col-12">
                            <textarea class="form-control" v-model="Data" placeholder="Item will deleted if content remain empty" style="height:10em"></textarea>
                        </div>
                    </div>
                    <div>
                        <a href="javascript:void(0)" class="btn btn-primary" @click="itemSave">Execute</a>
                    </div>
                </fieldset>
            </div>
        </div>
       
    </div>
</template>

<script src="./Data.ts"></script>