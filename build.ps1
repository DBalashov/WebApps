$CD    = (Get-Item -Path ".\" -Verbose).FullName
$BUILD = "$CD\_Build"
$PKZ   = "$CD\..\_SharedExt\pkz.exe"

Remove-Item $BUILD -Force -Recurse -ErrorAction SilentlyContinue
New-Item $BUILD -ItemType directory | Out-Null

$APPS = @("Bus", "APIExamples")

foreach($app in $APPS) {
    "------------------------------------------------------------------------------------------------------"
    "   $app"
    "------------------------------------------------------------------------------------------------------"
    cd "$CD\$app"
    Remove-Item "wwwroot\dist" -Force -Recurse -ErrorAction SilentlyContinue | Out-Null
    
    npm install
    node node_modules/webpack/bin/webpack.js --config webpack.config.vendor.js --env.prod
    node node_modules/webpack/bin/webpack.js --env.prod

    cd $CD\$app\wwwroot
    & $PKZ @("-add", "-directories", "$BUILD\$app", "*.*", "-Silent")

    New-Item "$BUILD\$app" -ItemType directory | Out-Null
    Copy-Item * "$BUILD\$app" -Recurse
}

cd $CD