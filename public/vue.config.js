const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    baseUrl: './',
    chainWebpack: config => {
        // console.log(config.plugin('uglify'))
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'development') {
            config.devtool = 'source-map'
            // mutate config for production...
        }
        config.resolve.alias = {
            '~': path.resolve(__dirname, 'src/')
        }

        // config.plugins.push(new UglifyJsPlugin({
        //     uglifyOptions: {
        //         mangle:{
        //             reserved: ['Buffer', 'BigInteger', 'Point', 'ECPubKey', 'ECKey', 'sha512_asm', 'asm', 'ECPair', 'HDNode']
        //         }
        //     }
        // }))
    }
}