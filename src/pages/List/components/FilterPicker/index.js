import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'


export default class FilterPicker extends Component {
  render() {
    const {onCancel,onOk,data,cols,titleType,pickerChange,titleArr} = this.props
    const tarobj = titleArr.filter(item => {return item.key==titleType})
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={tarobj[0].seletedValue} cols={cols} onChange={val=>{pickerChange(val)}} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onOk={onOk}/>
      </>
    )
  }
}
