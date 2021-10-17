import './App.css';
import {BrowserRouter as Router,Route,Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import 'antd-mobile/dist/antd-mobile.css';
function App() {
  return (
    <Router>
      <div className="App">
        {/* 配置路由 */}
        {/* Home 组件是父路由的内容 */}
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/citylist" component={CityList} />
        <Route path="/map" component={Map} />
      </div>
    </Router>
  );
}

export default App;
