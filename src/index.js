import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AppRouters from './Hoc/Router/AppRouters';

import './Assets/css/grid-system.css'
import './Assets/css/milestone-icons.css'
import './Assets/css/main.css'

ReactDOM.render(<AppRouters />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
