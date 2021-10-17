import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import './assets/fonts/iconfont.css'


// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `http://api.map.baidu.com/api?v=3.0&ak=4OPF8BvrpGO71PV5vDodVQWbSU1GYiNU`
    document.head.appendChild(script)

ReactDOM.render(<App />, document.getElementById('root'))


