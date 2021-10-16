import React, { Component, Fragment } from 'react'

import { Carousel } from 'antd-mobile';
import { Flex } from 'antd-mobile';
import axios from 'axios'


// 导入导航菜单图片
import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

// 导入样式文件
import './index.scss'

// 导航菜单数据
const navs = [
    {
        id: 1,
        img: Nav1,
        title: '整租',
        path: '/home/list'
    },
    {
        id: 2,
        img: Nav2,
        title: '合租',
        path: '/home/list'
    },
    {
        id: 3,
        img: Nav3,
        title: '地图找房',
        path: '/map'
    },
    {
        id: 4,
        img: Nav4,
        title: '去出租',
        path: '/rent'
    }
]
export default class Index extends Component {
    state = {
        data: ['1', '2', '3'],
        imgHeight: 220,
        swiperArr: []
    }
    async getSweipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        const { data, status } = res
        if (status == 200) {
            this.setState({
                swiperArr: data.body
            })
        }
    }
    //渲染轮播图
    renderSwiper() {
        return this.state.swiperArr.map(val => (
            <a
                key={val.id}
                href="#"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
                <img
                    src={`http://localhost:8080${val.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))

    }
    //渲染首页导航 
    renderNavs() {
        //千万要记得  遍历返回标签要记得 return !!!!
        return navs.map(item => 
             <Flex.Item onClick={() => { this.props.history.push(item.path) }}>
                <img
                    src={item.img}
                    alt=""
                />
                <h2>{item.title}</h2>
            </Flex.Item>
        )
    }
    componentDidMount() {
        this.getSweipers()
    }
    render() {
        return (
            <div className='index'>
                {/* 轮播图 */}
                {/* Bug  轮播图必须等待有数据的时候才可以自动轮播 否则 卡住不动 */}
                <div className='swipper'>
                    {
                        this.state.swiperArr.length > 0 ? <Carousel
                            autoplay
                            infinite
                            dots
                        >
                            {this.renderSwiper()}
                        </Carousel> : ''
                    }
                </div>
                {/* item 导航跳转区域 */}

                <Flex className='Nav'>
                    {this.renderNavs()}
                </Flex>


            </div>
        )
    }
}
