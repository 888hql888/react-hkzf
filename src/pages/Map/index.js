import React, { Component } from 'react'
import './index.scss'
import { BaiduMapInit } from '@/utils/Bdmap'
import NavHeader from '@/components/NavHeader'
import { Link } from 'react-router-dom'
import { Toast } from 'antd-mobile'

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
    state = {
        housesList: [],
        // 展示房源列表
        isShowList: false
    }
    componentDidMount() {
        // BaiduMapInit 向window对象中注入 百度地图api
        BaiduMapInit().then(BMap => {
            if (!BMap) return
            this.initMap()
        });
    }
    // ** 亮点之一 ** 
    // 封装 地图找房的方法
    // 思想: 1.渲染覆盖物方法 2.判断缩放等级以及渲染覆盖物类型方法 3. 3.1 渲染区级 镇级 圆形覆盖物方法 3.2 渲染 小区 方形覆盖物方法
    //  1.调用渲染覆盖物方法 ==> 调用判断类型和缩放方法 ==> 2.1如果是区/镇 则调用圆形覆盖物方法 => 注册点击事件 ==> 继续调用方法1.渲染覆盖物 ===>
    // 2.2 如果是小区 则调用方形覆盖物方法 ===> 注册点击事件 ==>  3.封装 方形覆盖物特有事件
    // 3.1 方形覆盖物点击事件包含如下 : 3.1.1 获取对应的房源数据 并 渲染数据渐进弹窗显示出来(此处还需要封装获取数据方法) 
    // 3.1.2 将所点击小区动态计算需要移动的距离 并 定位📌到 地图可视区域中心 3.1.3 移动地图 隐藏 刚才点击的房源数据



    // 初始化地图
    initMap() {
        // 获取当前定位城市
        const { label, value } = JSON.parse(localStorage.getItem('hkzf_city'))
        // console.log(label, value)

        // 初始化地图实例
        const map = new window.BMap.Map('container')
        this.map = map
        // 创建地址解析器实例
        const myGeo = new window.BMap.Geocoder()
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    //  初始化地图
                    this.map.centerAndZoom(point, 11)
                    // 添加常用控件
                    map.addControl(new window.BMap.NavigationControl())
                    map.addControl(new window.BMap.ScaleControl())
                    this.renderOverlays(value)
                }
            },
            label
        )
        // 给地图绑定移动事件
        map.addEventListener('movestart', () => {
            // console.log('movestart')
            if (this.state.isShowList) {
                this.setState({
                    isShowList: false
                })
            }
        })
    }

    // 创建覆盖物方法
    async renderOverlays(id) {
        // 获取房源数据
        const res = await axios.get(
            `http://localhost:8080/area/map?id=${id}`
        )
        console.log('房源数据：', res)
        // 判断类型和缩放等级
        const { type, nextZoom } = this.getTypeAndZoom()
        console.log(type, nextZoom, '......type nextzoom')
        res.data.body.forEach(item => {
            // 为每一条数据创建覆盖物
            const {
                coord: { longitude, latitude }, // coord原数据对象 => longitude latitude 解构后的数据
                label: areaName,
                count,
                value
            } = item
            // 创建覆盖物
            const areaPoint = new window.BMap.Point(longitude, latitude)
            this.createOverlays(type, nextZoom, areaName, count, areaPoint, value)
        })
    }
    // 类型和缩放等级判断
    // 区级:缩放13
    // 镇级:缩放15
    // 小区:缩放15
    getTypeAndZoom() {
        let type, nextZoom
        let zoom = this.map.getZoom() //默认当前是11
        console.log(zoom, 'zoom')
        if (10 <= zoom && zoom < 12) {
            nextZoom = 13
            type = 'circle'
        }
        else if (12 <= zoom && zoom < 15) {
            nextZoom = 15
            type = 'circle'
        } else {
            nextZoom = 15
            type = 'rect'
        }
        return {
            type,
            nextZoom
        }
    }
    //创建覆盖物
    createOverlays(type, nextZoom, areaName, count, areaPoint, value) {
        if (type == 'circle') {
            this.createCircle(nextZoom, areaName, count, areaPoint, value)
        } else {
            this.createRect(areaName, count, areaPoint, value)

        }
    }
    //创建 圆形(小区/镇级) 覆盖物
    createCircle(nextZoom, areaName, count, areaPoint, value) {
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
            // 放大地图，以当前点击的覆盖物为中心放大地图 第一个参数：坐标对象 第二个参数：放大级别
            this.map.centerAndZoom(areaPoint, nextZoom)
            this.renderOverlays(value)
            // 解决清除覆盖物时，百度地图API的JS文件自身报错的问题
            setTimeout(() => {
                // 清除当前覆盖物信息
                this.map.clearOverlays()
            }, 0)
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }
    // 创建小区覆盖物
    createRect(areaName, count, areaPoint, value) {
        // 创建覆盖物
        const label = new BMap.Label('', {
            position: areaPoint,
            offset: new BMap.Size(-50, -28)
        })

        // 给 label 对象添加一个唯一标识
        label.id = value

        // 设置房源覆盖物内容
        label.setContent(`
      <div class="${styles.rect}">
        <span class="${styles.housename}">${areaName}</span>
        <span class="${styles.housenum}">${count}套</span>
        <i class="${styles.arrow}"></i>
      </div>
    `)

        // 设置样式
        label.setStyle(labelStyle)

        // 添加单击事件
        label.addEventListener('click', e => {
            // 获取并渲染房源数据
            this.getHousesList(value)

            // 获取当前被点击项
            const target = e.changedTouches[0]
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY
            )
        })

        // 添加覆盖物到地图中
        this.map.addOverlay(label)
    }
    // 获取小区房源数据
    async getHousesList(id) {
        try {
            // 开启loading
            Toast.loading('加载中...', 0, null, false)

            const res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
            // 关闭 loading
            Toast.hide()

            this.setState({
                housesList: res.data.body.list,
                // 展示房源列表
                isShowList: true
            })
        } catch (e) {
            // 关闭 loading
            Toast.hide()
        }
    }
    renderHousesList() {
        return this.state.housesList.map(item => (
          <div className={styles.house} key={item.houseCode}>
            <div className={styles.imgWrap}>
              <img
                className={styles.img}
                src={`http://localhost:8080${item.houseImg}`}
                alt=""
              />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{item.title}</h3>
              <div className={styles.desc}>{item.desc}</div>
              <div>
                {/* ['近地铁', '随时看房'] */}
                {item.tags.map((tag, index) => {
                  const tagClass = 'tag' + (index + 1)
                  return (
                    <span
                      className={[styles.tag, styles[tagClass]].join(' ')}
                      key={tag}
                    >
                      {tag}
                    </span>
                  )
                })}
              </div>
              <div className={styles.price}>
                <span className={styles.priceNum}>{item.price}</span> 元/月
              </div>
            </div>
          </div>
        ))
      }
    render() {
        return (
            <div className='map'>
                <NavHeader>地图找房</NavHeader>
                <div id='container'></div>
                 {/* 添加 styles.show 展示房屋列表 */}
        <div
          className={[
            styles.houseList,
            this.state.isShowList ? styles.show : ''
          ].join(' ')}
        >
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <Link className={styles.titleMore} to="/home/list">
              更多房源
            </Link>
          </div>

          <div className={styles.houseItems}>
            {/* 房屋结构 */}
            {this.renderHousesList()}
          </div>
        </div>
            </div>
        )
    }
}
