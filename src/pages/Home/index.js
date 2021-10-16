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
    selectedTab: this.props.location.pathname,// 设置选中的selectedTab
    tabBarArr: [
      {
        title: '首页',
        icon: 'icon-ind',
        path: '/home'
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
  /* 
  问题：点击首页导航菜单，导航到 找房列表 页面时，找房菜单没有高亮

  原因：原来我们实现该功能的时候，只考虑了 点击 以及 第一次加载 Home 组件的情况。但是，我们没有考虑不重新加载 Home 组件时的路由切换，因为，这种情况下，我们的代码没有覆盖到

  解决：
    思路：在 路由切换 时，也执行 菜单高亮 的逻辑代码
    1 添加 componentDidUpdate 钩子函数
    2 在钩子函数中判断路由地址是否切换（因为路由的信息是通过 props 传递给组件的，所以，通过比较更新前后的两个props）
    3 在路由地址切换时，让 菜单高亮
*/
componentDidUpdate(preProps){
  // 通过跳转前后的路由地址 判断路由发生了改变
  if(preProps.location.pathname!==this.props.location.pathname){
    this.setState({
      selectedTab: this.props.location.pathname
    })
  }
}
  //遍历渲染tabBar
  renderTabbars() {
    const { tabBarArr, selectedTab } = this.state
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
        {/* 使用ecact精准查询 react默认是模糊匹配 */}
        <Route exact path='/home' component={Index} />
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
