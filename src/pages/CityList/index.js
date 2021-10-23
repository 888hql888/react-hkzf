import React, { Component } from 'react'
import { NavBar, Icon,Toast } from 'antd-mobile';
import './index.scss'
import axios from 'axios'
import { getCityLocation } from '@/utils/Bdmap'
import { AutoSizer, List } from 'react-virtualized';

const TITLE_HEIGHT = 36
const CITY_HEIGHT = 50
const HOUSE_CITY = ['北京', '上海', '广州', '深圳']

export default class CityList extends Component {
    constructor(props){
        super(props)
        this.state = {
            CityData: {}, //存储 城市数据 A:['安徽','安庆']
            CityIndex: [], //存储 城市索引 ['a','b']
            activeIndex:0
        }
        this.listRef = React.createRef()
    }
    
    // 处理城市数据的方法
    handleCityList(list = []) {
        if (list.length == 0) return
        const CityData = {}
        list.map(item => {
            let str = item.short[0]
            if (CityData[str]) {
                CityData[str].push(item)
            } else CityData[str] = [item]
        })
        const CityIndex = Object.keys(CityData).sort()
        return {
            CityIndex,
            CityData
        }
    }
    async componentDidMount() {
        await this.getCityList()
        // ps:注意📢 此实例方法必须在获取城市数据才能调用 否则报错 所以使用 await 保证城市数据先拿到
        this.listRef.current.measureAllRows()
    }
    // 处理标题 首字母
    formatCityIndex = (letter) => {
        switch (letter) {
            case '#':
                return '当前定位'
            case 'hot':
                return '热门城市'
            default:
                return letter.toUpperCase()
        }
    }
    //渲染 虚拟列表 List组件的方法 渲染每一行的 方法
    // 每一行指的是 比如A : 安徽 安庆 所有有A的城市都算是一行 ps:这边this指向有问题 特意将方法改成 xx = () =>{}赋值形式
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        const { CityData, CityIndex } = this.state
        // 我们可以通过 上面拿到的 index 去拿到城市数据和城市索引
        let letter = CityIndex[index]
        return (
            <div key={key} style={style} className="city">
                <div className="title">{this.formatCityIndex(letter)}</div>
                {CityData[letter].map(item => (
                    <div className="name" key={item.value} onClick={()=>this.changeCity(item)}>
                        {item.label}
                    </div>
                ))}
            </div>
        );
    }
    //获取每一个row的行高
    getRowHeight = ({index}) => {
        // 行高 = 标题高度 + 城市个数*高度
        const { CityData, CityIndex } = this.state
        const CityHeight = CityData[CityIndex[index]].length * CITY_HEIGHT
        const rowHeight = TITLE_HEIGHT + CityHeight
        return rowHeight
    }

    // 获取城市列表数据的方法
    async getCityList() {
        const res = await axios.get('http://localhost:8080/area/city?level=1')
        // 分离各个字母的城市数据
        const { CityData, CityIndex } = this.handleCityList(res.data.body)
        // 添加热门城市
        const hotRes = await axios.get('http://localhost:8080/area/hot')
        // console.log('热门城市数据：', hotRes)
        CityData['hot'] = hotRes.data.body
        // 将索引添加到 cityIndex 中
        CityIndex.unshift('hot')
        // 获取定位城市 
        let cityLocation = []
        let result = await getCityLocation()
        if(result=='上海') result = {value:"上海",label:'上海'}
        cityLocation = [result]
        CityData['#'] = cityLocation
        CityIndex.unshift('#')
        this.setState({
            CityData,
            CityIndex
        })
    }
    renderCityIndex() {
        // 获取到 cityIndex，并遍历其，实现渲染
        const { CityIndex, activeIndex } = this.state
        return CityIndex.map((item, index) => (
          <li className="city-index-item" key={item} onClick={()=>{
              //点击序号 让List 组件滚动到对应的 行( 但是默认不是滚动到顶部 需要设置属性滚动到顶部)
              // ps:调用List组件实例scrollToRow方法 只能滚动当前可视区域的行 定位才准确 当点击后续看不见的行 x y z这些行时 
              // 需要在 componentDidMount 钩子调用List实例的 measureAllRows 提前计算好 那些 暂时看不见的高度 确保定位的准确性
              this.listRef.current.scrollToRow(index) 
          }}>
            <span className={activeIndex == index ? 'index-active' : ''}>
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </li>
        ))
      }
    // 滚动时触发该函数 并拿到顶部的索引
    onRowsRendered = ({startIndex}) => {
        // 判断当前 startIndex 和 activeIndex是否相等 ，应该在不等的时候进行赋值
        // ps:这样可以避免 setState一直调用 进而一直更新render函数 造成严重性能浪费
        if(startIndex!=this.state.activeIndex){
            this.setState({
                activeIndex:startIndex
            })
        }
    }

    // 改变定位📌城市
    changeCity({value,label}){
        if (HOUSE_CITY.indexOf(label) > -1) {
            // 有
            localStorage.setItem('hkzf_city', JSON.stringify({ label, value }))
            this.props.history.go(-1)
          } else {
            Toast.info('该城市暂无房源数据', 1, null, false)
          }
    }
    

    render() {
        return (
            <div className='cityList'>
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                    className='navBar'
                >城市列表</NavBar>

                {/* AutoSizer作用是可以拿到页面的全部宽度和全部高度 通过render-props 渲染 结构height width */}
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            ref = {this.listRef}
                            width={width}
                            height={height}
                            rowCount={this.state.CityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment="start"
                        />
                    )}
                </AutoSizer>
                {/* 右侧虚拟列表 */}
                <ul className="city-index">{this.renderCityIndex()}</ul>
            </div>
        )
    }
}
