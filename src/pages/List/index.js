import React, { Component } from "react";
import SearchHeader from "../../components/SearchHeader";
import { Flex } from "antd-mobile";
import styles from "./index.module.css";
import Filter from "./components/Filter";
const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"))
export default class List extends Component {
  render() {
    return (
      <div>
        <Flex className={styles.header}>
          <i
            className="iconfont icon-back"
            onClick={() => this.props.history.go(-1)}
          />
          {/* 给searchHeader传递新的类名 */}
          <SearchHeader cityName={label} className={styles.searchHeader} />
        </Flex>
        <Filter></Filter>
      </div>
    );
  }
}
