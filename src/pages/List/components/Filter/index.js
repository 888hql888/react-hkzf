import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";
import {API} from "@/utils/api.js"
import axios from "axios";
export default class Filter extends Component {
  state = {
    titleStatus: {
      area: false,
      mode: false,
      price: false,
      more: false,
    },
    titleType: "", //控制过滤picker组件的展示
    titleArr: ["area", "mode", "price"],
    filtersData:[]
  };
  componentDidMount(){
    this.getFiltersData()
  }
  // !注意使用赋值的方式 避免this指向有问题
  handleTitleStatus = (type) => {
    const { titleStatus } = this.state;
    titleStatus[type] = !titleStatus[type];
    this.setState({
      titleStatus,
      titleType: type,
    });
  };
  renderFilterPicker() {
    const { titleType, titleArr,filtersData} = this.state;
    const { area, subway, rentType, price } = filtersData
    // 根据 openType 来拿到当前筛选条件数据
    let data = []
    let cols = 3
    switch (titleType) {
      case 'area':
        // 获取到区域数据
        data = [area, subway]
        cols = 3
        break
      case 'mode':
        data = rentType
        cols = 1
        break
      case 'price':
        data = price
        cols = 1
        break
      default:
        break
    }
    return titleArr.includes(titleType) ? (
      // 将事件onCancel和onOk 当属性传递给子组件 子组件通过回调方式调用父组件的事件
      <FilterPicker onCancel={this.onCancel} onOk={this.onOk} data={data} cols={cols}/>
    ) : null;
  }
  // picker取消 注意 this指向问题
  onCancel = () => {
    this.setState({
      titleType: "",
    });
  };
  // picker确定
  onOk = () => {
    this.setState({
      titleType: "",
    });
  }
  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem('hkzf_city'))
    const res = await API.get(`/houses/condition?id=${value}`)
    this.setState({
      filtersData: res.data.body
    })
  }
  render() {
    const { titleStatus, titleArr, titleType } = this.state;
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {titleArr.includes(titleType) ? (
          <div className={styles.mask} onClick={this.onCancel} />
        ) : null}
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleStatus={titleStatus}
            onClick={this.handleTitleStatus}
            city
          />

          {/* 区域 方式 租金前三个标题 对应组件 */}
          {this.renderFilterPicker()}

          {/* 筛选标题 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    );
  }
}
