import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './index.less';
import { Layout_Main } from './layout/main.jsx';

moment.locale('zh-cn');

class App extends React.Component {
  state = {
      date: null
  };
  render () {
      return (
          <Layout_Main>
          </Layout_Main>
      );
  }
}

ReactDOM.render(<LocaleProvider locale={zhCN}><App /></LocaleProvider>, document.getElementById('root'));
