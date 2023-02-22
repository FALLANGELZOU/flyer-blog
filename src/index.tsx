import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import store from '@/redux/store';

import App from './App';
import { styleUtil } from './common/style/flyer.style.custom';

if (module?.hot) {
  module.hot.accept();
}

ReactDOM.render(
  <Provider store={store}>
    {/* Browser路由有点问题 */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);


styleUtil.initFont()