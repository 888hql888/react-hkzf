 //解决BMap 没有注入windos问题 初始化百度api
 export const BaiduMapInit = () => {
    return new Promise(function(resolve, reject) {
    var script = document.createElement('script')
    const ak = '4OPF8BvrpGO71PV5vDodVQWbSU1GYiNU'
    script.type = 'text/javascript'
    script.src = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=init`;
    document.head.appendChild(script)
    window.init = () => {
        resolve(window.BMap)
    }
    })
}