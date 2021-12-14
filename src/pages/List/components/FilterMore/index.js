import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {

  state = {
    moreSeletedArr:this.props.moreSeletedArr || []
  }
  //单元格 选中事件
  cellSeleted = (sItem) => {
    let {moreSeletedArr} = this.state
    //如果数组中不存在该元素则添加该元素，存在就删除掉
    if(moreSeletedArr.includes(sItem)){
      let index = moreSeletedArr.findIndex(item => item === sItem)
      moreSeletedArr.splice(index,1)
    }else moreSeletedArr = [...moreSeletedArr,sItem]
    //更改数据
    this.setState({
      moreSeletedArr
    })
  }
  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    const {moreSeletedArr} = this.state
    return (
      data.map(item => { return (
        <span className={[styles.tag,moreSeletedArr.includes(item.value) ? styles.tagActive : ''].join(' ')} key={item.value} onClick={()=>{this.cellSeleted(item.value)}}>{item.label}</span>
      )})
    )
  }

  render() {
    const {oriented,floor,characteristic,roomType} = this.props.filtersData
    const {onCancel,onOk} = this.props
    const {moreSeletedArr} = this.state
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter className={styles.footer} cancelText='清除' onOk={()=>{onOk(moreSeletedArr)}} onCancel={onCancel} />
      </div>
    )
  }
}
