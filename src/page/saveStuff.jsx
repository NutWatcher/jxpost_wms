import React from 'react';
import { Tabs, Icon, Button, message, Input, Typography, Modal, Select, Row, Form, Badge, Table } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import TabPane_SaveStuffList from '../components/SaveStuff/TabPane_SaveStuffList.jsx';
import TabPane_SaveStuff_Form from '../components/SaveStuff/TabPane_SaveStuff.jsx';
import './saveStuff.less';

const TabPane = Tabs.TabPane;

class SaveStuff extends React.Component {
    render () {
        return (
            <div id="SaveStuff">
                <div className='content'>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="入库列表" key="1"><TabPane_SaveStuffList /></TabPane>
                        <TabPane tab="新增入库" key="2"><TabPane_SaveStuff_Form /></TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
};
export default SaveStuff;
