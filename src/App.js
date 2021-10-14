import './App.css';
import {BrowserRouter as Router,Route,Link} from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import 'antd-mobile/dist/antd-mobile.css';
function App() {
  return (
    // <Router>
    // <div className="App">
    //     <ul>
    //       <li>
    //         <Link to="/home">首页</Link>
    //       </li>
    //       <li>
    //         <Link to="/citylist">城市选择</Link>
    //       </li>
    //     </ul>
    //      <div>
    //        <Route path="/home" component={Home} />
    //        <Route path="/citylist" component={CityList} />
    //      </div>
        
    // </div>
    // </Router>
    <Router>
      <div className="App">
        {/* 项目根组件 <Button>登录</Button> */}

        {/* 配置导航菜单 */}
        {/* <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/citylist">城市选择</Link>
          </li>
        </ul> */}

        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
      </div>
    </Router>
  );
}

export default App;
