import React, { Component } from 'react'
import  './index.scss'
export default class Map extends Component {
    MP(ak) {
        return new Promise(function(resolve, reject) {
        var script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `http://api.map.baidu.com/api?v=2.0&ak=${ak}&callback=init`;
        document.head.appendChild(script)
        window.init = () => {
            resolve(window.BMap)
        }
        })
    }
    componentDidMount(){
        this.MP("4OPF8BvrpGO71PV5vDodVQWbSU1GYiNU").then(BMap=>{
            var map = new BMap.Map('container');            // 创建Map实例
            var point = new BMap.Point(116.404, 39.915); // 创建点坐标
            map.centerAndZoom("深圳",15);                 
            map.enableScrollWheelZoom();                 //启用滚轮放大缩小
        });
        const curCity = new window.BMap.LocalCity()
        curCity.get(async res => {
          console.log('当前城市信息：', res)
        })
    }
    render() {
        return (
            <div className='map'>
                    <div id='container'></div>
            </div>
        )
    }
}
