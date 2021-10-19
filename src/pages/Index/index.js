import React, { Component, Fragment } from 'react'

import { Carousel, WingBlank, Flex, Grid } from 'antd-mobile';
import axios from 'axios'


// 导入导航菜单图片
import Nav1 from '@/assets/images/nav-1.png'
import Nav2 from '@/assets/images/nav-2.png'
import Nav3 from '@/assets/images/nav-3.png'
import Nav4 from '@/assets/images/nav-4.png'

// 导入样式文件
import './index.scss'
import {getCityLocation} from '@/utils/Bdmap'

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
        swiperArr: [],
        groups: [],
        news: [],
        curCityName: ""
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
    // 获取租房小组数据的方法
    async getGroups() {
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        // console.log(res)
        this.setState({
            groups: res.data.body
        })
    }
    // 获取最新资讯
    async getNews() {
        const res = await axios.get(
            'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
        )

        this.setState({
            news: res.data.body
        })
    }
    // 渲染最新资讯
    renderNews() {
        return this.state.news.map(item => (
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img
                        className="img"
                        src={`http://localhost:8080${item.imgSrc}`}
                        alt=""
                    />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">{item.title}</h3>
                    <Flex className="info" justify="between">
                        <span>{item.from}</span>
                        <span>{item.date}</span>
                    </Flex>
                </Flex>
            </div>
        ))
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
   
    // 调用api得到城市 并查询接口
    getLocalCity(){
        //获取定位城市 如果查询不匹配接口会返回 上海
        getCityLocation().then(res => {
            this.setState({
                curCityName:res
            })
        }).catch(err=>{
            console.log(err,'err')
        })
    }
    componentDidMount() {
        this.getSweipers()
        this.getGroups()
        this.getNews()
        this.getLocalCity()
        

    }
    render() {
        return (
            <div className='index'>

                {/* 轮播图 start*/}
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
                    <Flex className="search-box">
                        {/* 左侧白色区域 */}
                        <Flex className="search">
                            {/* 位置 */}
                            <div
                                className="location"
                                onClick={() => this.props.history.push('/citylist')}
                            >
                                <span className="name">{this.state.curCityName}</span>
                                <i className="iconfont icon-arrow" />
                            </div>

                            {/* 搜索表单 */}
                            <div
                                className="form"
                                onClick={() => this.props.history.push('/search')}
                            >
                                <i className="iconfont icon-seach" />
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        {/* 右侧地图图标 */}
                        <i
                            className="iconfont icon-map"
                            onClick={() => this.props.history.push('/map')}
                        />
                    </Flex>
                </div>
                {/* 轮播图 end*/}

                {/* item 导航跳转区域 start*/}
                <Flex className='Nav'>
                    {this.renderNavs()}
                </Flex>
                {/* item 导航跳转区域 end*/}

                {/* 租房小组 start*/}
                <div className='rentGroup'>
                    <WingBlank>
                        <div className='title'>
                            <h3>租房小组</h3>
                            <span>更多</span>
                        </div>
                        <Grid data={this.state.groups}
                            square={false}
                            hasLine={false}
                            columnNum={2}
                            renderItem={item => (
                                <div className='rendGridItem'>
                                    <Flex>
                                        <Flex.Item style={{ marginRight: '8px' }}>
                                            <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </Flex.Item>
                                        <Flex.Item>
                                            <img src={`http://localhost:8080${item.imgSrc}`}></img>
                                        </Flex.Item>
                                    </Flex>
                                </div>
                            )}
                        />
                    </WingBlank>

                </div>
                {/* 租房小组 end*/}

                {/* 最新资讯 start */}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">{this.renderNews()}</WingBlank>
                </div>
                {/* 最新资讯 end */}

            </div>
        )
    }
}
