<template>
    <div class="row mt-4">
        <div class="col-2">
            
        </div>
        <div class="col-8">
            <div class="card">
                <div class="card-header">
                    Settings
                </div>
                <div class="card-body">
                    <p class="card-text">
                        window["external-settings"] = 
                        <pre v-html="JSON.stringify(ExternalSettings, null, '  ')"></pre>
                    </p>
                </div>
            </div>
        </div>
        
        <div class="col-2">
            
        </div>
    </div>
</template>

<script src="./Index.ts"></script>