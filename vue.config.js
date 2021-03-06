module.exports = {
    // 关闭eslint
    lintOnSave: false,
    // 分离测试和发布打包入口
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            // 发布模式文件打包入口
            config.entry('app').clear().add('./src/main-prod.js')
            // cdn外部加载文件
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                echarts: 'echarts',
                nprogress: 'NProgress'
            })
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}
