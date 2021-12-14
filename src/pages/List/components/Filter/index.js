import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";
import { API } from "@/utils/api.js";
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
    //回显选中的值.绑定到每一个区域上.默认是null，选中后是一个数组.(做法和教程的不一样.)
    titleArr: [
      {
      key:"area",
      seletedValue:null
    },
    {
      key:"mode",
      seletedValue:null
    },
    {
      key:"price",
      seletedValue:null
    },
    {
      key:"more",
      seletedValue:['more']
    }
  ],
    moreData:[],
    filtersData: [],
    moreSeletedArr:[] // more存储选中数据
  };
  componentDidMount() {
    this.getFiltersData();
  }
  // !注意使用赋值的方式 避免this指向有问题
  handleTitleStatus = (type) => {
    console.log(type,'type..');
    const { titleStatus } = this.state;
    titleStatus[type] = !titleStatus[type];
    this.setState({
      titleStatus,
      titleType: type,
    });
  };
  renderFilterPicker() {
    const { titleType, titleArr, filtersData } = this.state;
    const { area, subway, rentType, price } = filtersData;
    // 根据 openType 来拿到当前筛选条件数据
    let data = [];
    let cols = 3;
    //组装数据 picker 接收 [[],[]] 多个数组 数组有嵌套使用 children 实现多级结构
    switch (titleType) {
      case "area":
        // 获取到区域数据
        data = [area, subway];
        cols = 3;
        break;
      case "mode":
        data = rentType;
        cols = 1;
        break;
      case "price":
        data = price;
        cols = 1;
        break;
      default:
        break;
    }
      return titleArr.map(item => {if(item.key==titleType && item.key!=='more'){ 
        return(
          <FilterPicker
        onCancel={this.onCancel}
        onOk={this.onOk}
        data={data}
        cols={cols}
        titleType={titleType}
        titleArr={titleArr}
        pickerChange={this.pickerChange}
        key={item.value}
      />
        )
      } else return null})
  }
  // picker取消 注意 this指向问题
  onCancel = () => {
    this.setState({
      titleType: "",
      moreSeletedArr:[]
    });
  };
  // picker确定
  onOk = (moreSeletedArr) => {
    this.setState({
      titleType: "",
      moreSeletedArr
    });
  };
  // picer组件的onChange事件
  pickerChange = (val) => {
    console.log(val,'change val');
    const {titleArr,titleType} = this.state
    titleArr.map(item => {if(item.key==titleType){item.seletedValue = val}})
    this.setState({
      titleArr
    })
  }
  // 封装获取所有筛选条件的方法
  async getFiltersData() {
    // 获取当前定位城市id
    const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
    const res = await API.get(`/houses/condition?id=${value}`);
    this.setState({
      filtersData: res.data.body,
    });
  }
  render() {
    const { titleStatus, titleArr, titleType,filtersData,moreSeletedArr} = this.state;
    console.log('执行次数...');
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {
          titleArr.map(item => {if(item.key==titleType && item.key!=='more'){ return  <div className={styles.mask} onClick={this.onCancel} />} else return null})
        }
        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleType={titleType}
            titleArr={titleArr}
            handleTitleStatus={this.handleTitleStatus}
          />

          {/* 区域 方式 租金前三个标题 对应组件 */}
          {this.renderFilterPicker()}

          {/* 筛选标题 最后一个菜单对应的内容： */}
          {
            titleType ==='more' ? <FilterMore filtersData={filtersData} onCancel={this.onCancel} onOk={this.onOk} moreSeletedArr={moreSeletedArr} /> : null
          }
        </div>
      </div>
    );
  }
}
