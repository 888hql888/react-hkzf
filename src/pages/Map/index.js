import React, { Component } from 'react'
import  './index.scss'
import {BaiduMapInit} from '../../utils/Bdmap'
export default class Map extends Component {
    componentDidMount(){
        BaiduMapInit().then(BMap=>{
            var map = new BMap.Map('container');            // 创建Map实例
            var point = new BMap.Point(116.404, 39.915); // 创建点坐标
            map.centerAndZoom("深圳",15);                 
            map.enableScrollWheelZoom();                 //启用滚轮放大缩小
        });
    }
    render() {
        return (
            <div className='map'>
                    <div id='container'></div>
            </div>
        )
    }
}
