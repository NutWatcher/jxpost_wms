import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Form, Input, Table } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_Department.less';
class TabPane_Department_Form extends React.Component {
    state = {
        isLoading: false
    }
    fetchAddDepartment = async (name) => {
        this.setState({ isLoading: true });
        try {
            let stsFetch = new U_Fetch('/department', { name: name }, { method: 'POST' });
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
                this.fetchAddDepartment(values.name);
            }
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} layout='vertical'>
                <Form.Item label="机构名称">
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
const Wrap_TabPane_Department_Form = Form.create({ name: 'TabPane_Department_Form' })(TabPane_Department_Form);

const columns = [{
    title: '部门名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '上级部门',
    dataIndex: 'parent',
    key: 'parent'
}];
class TabPane_Department extends React.Component {
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
        this.fetchDepartment();
    }
    fetchDepartment = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                query: '',
                page: 0,
                limit: 200
            };
            let stsFetch = new U_Fetch('/department', params);
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
        this.fetchDepartment();
    }
    render () {
        const list = [];
        this.state.data.forEach((item, key) => { list.push({ key: key, name: item.name, parent: item.parentName }); });
        return (
            <div id="TabPane_Department">
                <div className='content'>
                    <Modal title="新部门" visible={this.state.visible}
                        onOk={this.close} onCancel={this.close}
                        footer={null}>
                        <Wrap_TabPane_Department_Form close={this.addSuccess}/>
                    </Modal>
                    <Button type="primary" htmlType="submit" onClick={this.showModal} className="add_button">新增部门</Button>
                    <Table columns={columns} dataSource={list} loading={this.state.isLoading}/>
                </div>
            </div>
        );
    }
}
export default TabPane_Department;
