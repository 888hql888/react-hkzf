import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
import axios from 'axios'
import {getCityLocation} from '@/utils/Bdmap'

export default class CityList extends Component {
    state = {

    }
    // 处理城市数据的方法
    handleCityList(list = []) {
        if (list.length == 0) return
        const CityData = {}
        list.map(item => {
            let str = item.short[0]
            if (CityData[str]) {
                CityData[str].push(item)
            } else CityData[str] = []
        })
        const CityIndex = Object.keys(CityData).sort()
        return {
            CityData,
            CityIndex
        }
    }
    componentDidMount() {
        this.getCityList()
    }

    // 获取城市列表数据的方法
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        // 分离各个字母的城市数据
        const { CityData, CityIndex } = this.handleCityList(res.data.body)
        // 添加热门城市
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        // console.log('热门城市数据：', hotRes)
        CityData['hot'] = hotRes.data.body
        // 将索引添加到 cityIndex 中
        CityIndex.unshift('hot')

        // 获取定位城市 
        let  cityLocation = []
        getCityLocation().then(res => {
            cityLocation = [res]
            CityData['#'] = cityLocation
            CityIndex.unshift('#')
        }).catch(err=>{
            console.log(err,'err')
        })
        console.log(CityData,CityIndex,'CityIndex CityIndex')
        
    }

    render() {
        return (
            <div className='cityList'>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                    className='navBar'
                >城市列表</NavBar>
            </div>
        )
    }
}
