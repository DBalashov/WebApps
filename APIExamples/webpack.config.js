var path = require('path');
var webpack = require('webpack');
var pluginExtractText = require('extract-text-webpack-plugin');
var pathOUTPUT = './wwwroot/dist';
var pluginVueLoader = require('vue-loader/lib/plugin');
var pluginUglifyJS = require('uglifyjs-webpack-plugin');

module.exports = function(env) {
    var isDevBuild = !(env && env.prod);
    return [{
        mode: isDevBuild ? 'development':'production',
        stats: { modules: false },
        context: __dirname,
        resolve: { extensions: [ '.js', '.ts' ] },
        entry: { 'main': './ClientApp/boot.ts' },
        module: {
            rules: [
                { test: /\.vue$/, include: /ClientApp/, loader: 'vue-loader', options: { loaders: { js: 'ts-loader' } } },
                { test: /\.ts$/, include: /ClientApp/, use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            appendTsSuffixTo: [/\.vue$/]
                        }
                    }
                ] },
                { test: /\.css$/, use: isDevBuild ? [ 'style-loader', 'css-loader' ] : pluginExtractText.extract({ use: 'css-loader?minimize' }) },
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=25000' }
            ]
        },
        output: {
            path: path.join(__dirname, pathOUTPUT),
            filename: '[name].js',
            publicPath: 'dist/'
        },
        plugins: [
            new pluginVueLoader(),
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify(isDevBuild ? 'development' : 'production')
                }
            }),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // Plugins that apply in development builds only
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', // Remove this line if you prefer inline source maps
                moduleFilenameTemplate: path.relative(pathOUTPUT, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // Plugins that apply in production builds only
            new pluginUglifyJS(),
            new pluginExtractText('site.css')
        ])
    }];
};