import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Form, Input, Table } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_Company.less';
class TabPane_Company_Form extends React.Component {
    state = {
        isLoading: false
    }
    fetchAddCompany = async (name) => {
        this.setState({ isLoading: true });
        try {
            let stsFetch = new U_Fetch('/company', { name: name }, { method: 'POST' });
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.state !== true) {
                message.error(`新增失败!:${data.message}` || '新增失败!');
                return;
            }
            this.props.close();
        } catch (e) {
            message.error(`新增失败!:${e.toString()}` || '新增失败!');
            this.setState({ isLoading: false });
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.fetchAddCompany(values.name);
            }
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} layout='vertical'>
                <Form.Item label="公司名称">
                    {getFieldDecorator('name', {
                        initialValue: this.props.name,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                {/* <Form.Item label="上级机构">
                    {getFieldDecorator('conditions', {
                        initialValue: this.props.class,
                        rules: [{ type: 'array' }]
                    })(
                        <Select size="large" mode="multiple" optionFilterProp={'name'} placeholder="选择约课条件，没有类型请联系平台人员添加">
                            {
                                this.props.conditionList.map((item, key) => {
                                    return <Select.Option key={key} name={item.name} value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )}
                </Form.Item> */}
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" loading={this.state.isLoading}>新增</Button>
                </Form.Item>
            </Form>
        );
    }
}
const Wrap_TabPane_Company_Form = Form.create({ name: 'TabPane_Company_Form' })(TabPane_Company_Form);

const columns = [{
    title: '结算公司',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '公司地址',
    dataIndex: 'address',
    key: 'address'
}, {
    title: '备注',
    dataIndex: 'misc',
    key: 'misc'
}];
class TabPane_Company extends React.Component {
    state = {
        isLoading: false,
        visible: false,
        data: []
    }
    showModal = () => {
        this.setState({ visible: true });
    }
    close = () => {
        this.setState({ visible: false });
    }
    addSuccess = () => {
        this.close();
        this.fetchCompany();
    }
    fetchCompany = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                query: '',
                page: 0,
                limit: 200
            };
            let stsFetch = new U_Fetch('/company', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.state !== true) {
                message.error(`获取分类列表失败!:${data.message}` || '获取分类列表失败!');
                return;
            }
            this.setState({ data: data.rowList });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchCompany();
    }
    render () {
        const list = [];
        this.state.data.forEach((item, key) => { list.push({ key: key, name: item.name, address: item.address, misc: item.misc }); });
        return (
            <div id="TabPane_Company">
                <div className='content'>
                    <Modal title="新结算公司" visible={this.state.visible}
                        onOk={this.close} onCancel={this.close}
                        footer={null}>
                        <Wrap_TabPane_Company_Form close={this.addSuccess}/>
                    </Modal>
                    <Button type="primary" htmlType="submit" onClick={this.showModal} className="add_button">新结算公司</Button>
                    <Table columns={columns} dataSource={list} loading={this.state.isLoading}/>
                </div>
            </div>
        );
    }
}
export default TabPane_Company;
