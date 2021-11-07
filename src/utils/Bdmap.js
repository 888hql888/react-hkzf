import axios from "axios"
import resolve from "resolve"
//解决BMap 没有注入windos问题 初始化百度api
export const BaiduMapInit = () => {
    return new Promise(function (resolve, reject) {
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

// 封装获取城市定位方法
export const getCityLocation = () => {

    const localLocation = JSON.parse(localStorage.getItem('hkzf_city')) // 判断本地是否有数据 有就直接取
    if (!localLocation) {
        //1.由于不确定异步接口什么时候返回数据 所以使用 promise的resolve 等接口成功后的回调在返回数据
        //2.防止处理请求出错 可以结合 try catch 使用
        return new Promise((resolve, reject) => {
            BaiduMapInit().then(BMap => {
                try {
                    const curCity = new window.BMap.LocalCity()
                    curCity.get(async res => {
                        const result = await axios.get(
                            `http://localhost:8080/area/info?name=${res.name}`
                        )
                        // console.log(result,'result...')
                        if (result.data.status === 200) {
                            resolve(result.data.body)
                            localStorage.setItem('hkzf_city',JSON.stringify(result.data.body))
                        }
                    })
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
    // 如果本地有数据 则直接 返回成功的Promise对象
    return Promise.resolve(localLocation)
}