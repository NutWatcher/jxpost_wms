import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Col, Row, Form, Input, Select } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import TabPane_Department from '../components/AddStuff/TabPane_Department.jsx';
import TabPane_Settlement from '../components/AddStuff/TabPane_Settlement.jsx';
import TabPane_Company from '../components/AddStuff/TabPane_Company.jsx';
import TabPane_Stuff from '../components/AddStuff/TabPane_Stuff.jsx';
import './addStuff.less';

const { Text, Title } = Typography;
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;

class AddStuff extends React.Component {
    state = {
        listData: [],
        isLoading: false,
        pagination: {
            total: 0,
            page: 1,
            limit: 10
        }
    };
    callback = (key) => {
        console.log(key);
    }
    render () {
        return (
            <div id="AddStuff">
                <div className='content'>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab="物料管理" key="1"><TabPane_Stuff /></TabPane>
                        <TabPane tab="机构部门管理" key="2"><TabPane_Department /></TabPane>
                        <TabPane tab="结算方式" key="3"><TabPane_Settlement /></TabPane>
                        <TabPane tab="结算公司" key="4"><TabPane_Company /></TabPane>
                    </Tabs>
                </div>
            </div>
        );
    }
};
export default AddStuff;
