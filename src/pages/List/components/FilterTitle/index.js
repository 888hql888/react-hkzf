import React, { Component } from 'react'

import { Flex } from "antd-mobile";

import styles from "./index.module.css";

// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" },
];

// 原教程的函数式组件

// export default function FilterTitle({ titleType, onClick }) {
//   return (
//     <Flex align="center" className={styles.root}>
//       {titleList.map((item) => {
//         const isSeleted = titleType == item.type
//         return (
//           <Flex.Item key={item.type} onClick={()=>{onClick(item.type)}}>
//             {/* 选中类名： selected */}
//             <span className={[styles.dropdown, isSeleted ? styles.selected : ''].join(" ")}>
//               <span>{item.title}</span>
//               <i className="iconfont icon-arrow" />
//             </span>
//           </Flex.Item>
//         );
//       })}
//     </Flex>
//   );
// }

// 使用类组件改写
export default class FilterTitle extends Component {
  handleTitleStatus = (type) => {
    this.props.handleTitleStatus(type)
  }
  // 只有选中有值(如果是三项则必须三项都必须有值.)的title 才允许高亮.
  handleIsSeleted = (type) => {
    const {titleType,titleArr} = this.props
    if(type === titleType ){
      let targetObj = titleArr.filter(item => {return item.key === titleType})
      targetObj = targetObj[0]
      if(targetObj.seletedValue!==null && !targetObj.seletedValue.includes('null')){
        return true
      }else return false
    }
  }
  render() {
    return (
      <Flex align="center" className={styles.root}>
      {titleList.map((item) => {
        const isSeleted = this.handleIsSeleted(item.type)
        return (
          <Flex.Item key={item.type} onClick={()=>{this.handleTitleStatus(item.type)}}>
            {/* 选中类名： selected */}
            <span className={[styles.dropdown, isSeleted ? styles.selected : ''].join(" ")}>
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        );
      })}
    </Flex>
    )
  }
}
