import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
import axios from 'axios'

export default class CityList extends Component {
    state = {

    }
    componentDidMount() {
        this.getCityList()
      }
    
      // 获取城市列表数据的方法
      async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        console.log('城市列表数据：', res)
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
