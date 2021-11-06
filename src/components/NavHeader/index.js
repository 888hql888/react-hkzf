import React from "react";

import { NavBar, Icon } from 'antd-mobile'

// 引入高阶组件 withRoute 使一般的非路由组件也有 路由组件的属性 ps:非路由组件使没有 props 属性使用的
import { withRouter } from 'react-router-dom'

// props校验
import PropTypes from 'prop-types'

import styles from './index.module.css'

function NavHeader({history,children,onLeftClick}) {
    const defaultBack = () => {history.go(-1)}
    return (
        <NavBar
        mode="light"
        className={styles.navHeader}
        icon={<Icon type="left" />}
        onLeftClick={onLeftClick || defaultBack}
      >{children}</NavBar>  
    )
}

// 添加props校验
NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func
}

//使用 高阶组件包裹 使其拥有 props 属性
export default withRouter(NavHeader)
