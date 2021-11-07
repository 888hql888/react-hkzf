import React, { Component } from 'react'
import './index.scss'
import { BaiduMapInit } from '@/utils/Bdmap'
import NavHeader from '@/components/NavHeader'

import axios from 'axios'
import styles from './index.module.css'

const BMap = window.BMap
// 覆盖物样式
const labelStyle = {
    cursor: 'pointer',
    border: '0px solid rgb(255, 0, 0)',
    padding: '0px',
    whiteSpace: 'nowrap',
    fontSize: '12px',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
}

export default class Map extends Component {
    componentDidMount() {
        // BaiduMapInit 向window对象中注入 百度地图api
        BaiduMapInit().then(BMap => {
            if (!BMap) return
            this.initMap()
        });
    }
    // 初始化地图
    initMap() {
        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        // console.log(label, value)

        // 初始化地图实例
        const map = new window.BMap.Map('container')
        // 创建地址解析器实例
        const myGeo = new window.BMap.Geocoder()
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    //  初始化地图
                    map.centerAndZoom(point, 11)
                    // 添加常用控件
                    map.addControl(new window.BMap.NavigationControl())
                    map.addControl(new window.BMap.ScaleControl())

                    /* 
                      1 获取房源数据。
                      2 遍历数据，创建覆盖物，给每个覆盖物添加唯一标识（后面要用）。
                      3 给覆盖物添加单击事件。
                      4 在单击事件中，获取到当前单击项的唯一标识。
                      5 放大地图（级别为13），调用 clearOverlays() 方法清除当前覆盖物。
                    */
                    const res = await axios.get(
                        `http://localhost:8080/area/map?id=${value}`
                    )
                    console.log('房源数据：', res)
                    res.data.body.forEach(item => {
                        // 为每一条数据创建覆盖物
                        const {
                            coord: { longitude, latitude },
                            label: areaName,
                            count,
                            value
                        } = item
                        // 创建覆盖物
                        const areaPoint = new window.BMap.Point(longitude, latitude)

                        const label = new window.BMap.Label('', {
                            position: areaPoint,
                            offset: new window.BMap.Size(-35, -35)
                        })

                        // 给 label 对象添加一个唯一标识
                        label.id = value

                        // 设置房源覆盖物内容
                        label.setContent(`
              <div class="${styles.bubble}">
                <p class="${styles.name}">${areaName}</p>
                <p>${count}套</p>
              </div>
            `)

                        // 设置样式
                        label.setStyle(labelStyle)

                        // 添加单击事件
                        label.addEventListener('click', () => {
                            console.log('房源覆盖物被点击了', label.id)

                            // 放大地图，以当前点击的覆盖物为中心放大地图
                            // 第一个参数：坐标对象
                            // 第二个参数：放大级别
                            map.centerAndZoom(areaPoint, 13)

                            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
                            setTimeout(() => {
                                // 清除当前覆盖物信息
                                map.clearOverlays()
                            }, 0)
                        })

                        // 添加覆盖物到地图中
                        map.addOverlay(label)
                    })
                }
            },
            label
        )
    }
    render() {
        return (
            <div className='map'>
                <NavHeader>地图找房</NavHeader>
                <div id='container'></div>
            </div>
        )
    }
}
