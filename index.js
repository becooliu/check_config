const fs = require('fs')
const watch = require('node-watch')
const watchPath = '../coupon_hunter_human_simulator/simulator_config'

/**
 * 
 * @param {String} filePath 
 */
function getChangedJson (filePath){
    const data = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' }))
    checkOverrideConfig(data, 'checkout_alt', filePath)
    checkOverrideConfig(data, 'product_alt', filePath)
}

/**
 * 
 * @param {*} file 
 * @param {String} alt_name 
 */
function checkOverrideConfig(file_data, alt_name, file_path){
    let config_arr = getOverrideConfig(file_data, alt_name)
    if(!config_arr.length) return

    let override_config_is_in_config = config_arr?.every(item => {return file_data?.[item]})
    
    // 检查override 中的配置是否出现在配置中
    if(!override_config_is_in_config) {
        // 如果override config 中的配置，在配置中未出现，说明有错误，此时打印红色错误信息
        console.log('\x1B[31m%s [%s] %s \x1B[0m', 'override config is not in config:', alt_name, file_path)
    }else {
        // 如果override config 中的配置，在配置中出现，说明没有错误，此时打印绿色信息
        console.log('\x1B[32m%s [%s] %s \x1B[0m', 'override config is in config:', alt_name, file_path)
    }
}

/**
 * 获取配置中的overrideConfig 数据
 * @param {String} file 
 * @param {string} alt_name
 * @returns 
 */
function getOverrideConfig(file, alt_name) {
    let overrideConfig = file?.overrideConfig
    if(!overrideConfig) return

    const alt_config = overrideConfig[alt_name]
    const config_arr = (alt_config || [])?.reduce((acc, cur) => {acc.push(cur?.config); return acc}, [])
    return config_arr?.length && config_arr?.filter(item => item != undefined && item)
}

/**
 * 监听某路径下的文件是否发生变化，监听到变化后进行检测
 * @param {String} filePath 
 */
const getChangedFilePath = function(filePath){
    watch(filePath, { recursive: true }, function(evt, name) {
        getChangedJson(name)
    })
}


getChangedFilePath(watchPath)