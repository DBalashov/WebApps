<template>
    <div class="row">
        <div class="col-sm-12">
            <div style="width:100%" id="map"></div>
        </div>
        <div class="modal" tabindex="-1" role="dialog" id="pointEdit">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Редактирование остановки</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <input type="text" class="form-control" v-model="pointName" autofocus/>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="pointSave">Сохранить</button>
                        <button type="button" class="btn btn-danger" @click="pointDelete">Удалить</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отменить</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./Index.ts"></script>