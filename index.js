const fs = require('fs')
const watch = require('node-watch')
const watchPath = '../coupon_hunter_human_simulator/simulator_config'

/**
 * 
 * @param {String} filePath 
 */
function getChangedJson (filePath){
    const data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }))
    let config_arr = getOverrideConfig(data)
    let override_config_is_in_config = config_arr.every(item => {return data?.[item]})
    
    // 检查override 中的配置是否出现在配置中
    if(!override_config_is_in_config) {
        // 如果override config 中的配置，在配置中未出现，说明有错误，此时打印红色错误信息
        console.log('\x1B[31m%s %s\x1B[0m', 'override config is not in config:', filePath)
        // console.error('override config is not in config: %s', filePath)
    }else {
        // 如果override config 中的配置，在配置中出现，说明没有错误，此时打印绿色信息
        console.log('\x1B[32m%s %s\x1B[0m', 'override config is in config:', filePath)
    }
}

/**
 * 获取配置中的overrideConfig 数据
 * @param {String} file 
 * @returns 
 */
function getOverrideConfig(file) {
    let overrideConfig = file?.overrideConfig
    const checkout_alt = overrideConfig && overrideConfig?.checkout_alt
    const config_arr = checkout_alt?.reduce((acc, cur) => {acc.push(cur?.config); return acc}, [])
    console.log(config_arr.length)
    return config_arr?.length && config_arr
}

/**
 * 监听文件修改
 */
const getChangedFilePath = function(){
    watch(watchPath, { recursive: true }, function(evt, name) {
        getChangedJson(name)
    })
}


getChangedFilePath()