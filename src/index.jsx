import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';

// Switch commented lines to hot-load tests instead of the main
// application:

import App from './ui/covid-demo/demo';
// import App from './ui/test/flip-to-hack.test';
// import App from './ui/test/quest-fth-view.test';
// import App from './ui/test/dialogue.test';
// import App from './ui/test/toolbox.test';
// import App from './ui/test/p5.test';
// import App from './ui/test/html-quest.test';

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
