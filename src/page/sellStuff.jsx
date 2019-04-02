import React from 'react';
import { Tabs, Icon, Button, message, Input, Typography, Modal, Select, Row, Form, Badge, Table } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import TabPane_SellStuffList from '../components/SellStuff/TabPane_SellStuffList.jsx';
import TabPane_SellStuff_Form from '../components/SellStuff/TabPane_SellStuff.jsx';
import './sellStuff.less';

const TabPane = Tabs.TabPane;

class SellStuff extends React.Component {
    render () {
        return (
            <div id="SellStuff">
                <div className='content'>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="出库列表" key="1"><TabPane_SellStuffList /></TabPane>
                        <TabPane tab="新增出库" key="2"><TabPane_SellStuff_Form /></TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
};
export default SellStuff;
