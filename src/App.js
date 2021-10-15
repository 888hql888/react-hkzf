import './App.css';
import {BrowserRouter as Router,Route,Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import 'antd-mobile/dist/antd-mobile.css';
function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Redirect  to="/home" />
      </div>
    </Router>
  );
}

export default App;
