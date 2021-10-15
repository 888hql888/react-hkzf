import React, { Component } from 'react'

import List from '../List'
import News from '../News'
import Profile from '../Profile'
import Index from '../Index'
import { TabBar } from 'antd-mobile';
import { Route } from 'react-router';

import './index.css'

export default class Home extends Component {

    state = {
      selectedTab:'/home/index',// 设置选中的selectedTab
      tabBarArr:[
        {
          title: '首页',
          icon: 'icon-ind',
          path: '/home/index'
        },
        {
          title: '找房',
          icon: 'icon-findHouse',
          path: '/home/list'
        },
        {
          title: '资讯',
          icon: 'icon-infom',
          path: '/home/news'
        },
        {
          title: '我的',
          icon: 'icon-my',
          path: '/home/profile'
        }
      ]
    }
    //遍历渲染tabBar
    renderTabbars() {
      const { tabBarArr,selectedTab } = this.state
        return (
          tabBarArr.map(item => {
            return <TabBar.Item
                title={item.title}
                key={item.title}
                icon={<i className={`iconfont ${item.icon}`} />}
                selectedIcon={<i className={`iconfont ${item.icon}`} />}
                selected={selectedTab === item.path}
                onPress={() => {
                  //编程式导航跳转
                  this.props.history.push(item.path)
                  this.setState({
                    selectedTab: item.path,
                  });
                }}
              >
              </TabBar.Item>
          })
        );
      }
      render() {
        return (
          <div className='home'>
            {/* 设置tabbar的嵌套路由 */}
            <Route path='/home/index' component={Index} />
            <Route path='/home/list' component={List} />
            <Route path='/home/news' component={News} />
            <Route path='/home/profile' component={Profile} />
            <TabBar
              tintColor="#21b97a" noRenderContent={true} barTintColor="white"
            >
              {this.renderTabbars()}
            </TabBar>
          </div>
        );
      }
}
