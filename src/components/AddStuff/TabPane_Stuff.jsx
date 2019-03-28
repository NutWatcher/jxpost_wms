import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Col, Select, Form, Input, Table } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_Stuff.less';
const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
class TabPane_Stuff_Form extends React.Component {
    state = {
        companyList: [],
        isLoading: false
    }
    fetchAddSettlement = async (values) => {
        this.setState({ isLoading: true });
        try {
            let stsFetch = new U_Fetch('/material', values, { method: 'POST' });
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
                this.fetchAddSettlement(values);
            }
        });
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
                message.error(`获取公司列表失败!:${data.message}` || '获取公司列表失败!');
                return;
            }
            this.setState({ companyList: data.rowList });
        } catch (e) {
            message.error(`获取公司列表失败!:${e.toString()}` || '获取上公司列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchDepartment();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} {...formItemLayout} >
                <Form.Item label="物料名称">
                    {getFieldDecorator('name', {
                        initialValue: this.props.name,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="物料编码">
                    {getFieldDecorator('code', {
                        initialValue: this.props.code,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="备注">
                    {getFieldDecorator('misc', {
                        initialValue: this.props.misc,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="型号">
                    {getFieldDecorator('model', {
                        initialValue: this.props.model,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="规格">
                    {getFieldDecorator('specification', {
                        initialValue: this.props.specification,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="单价">
                    {getFieldDecorator('unitPrice', {
                        initialValue: this.props.unitPrice,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="发票号">
                    {getFieldDecorator('invoice', {
                        initialValue: this.props.invoice,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="" />
                    )}
                </Form.Item>
                <Form.Item label="结算公司">
                    {getFieldDecorator('companyName', {
                        initialValue: this.props.class,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Select size="large" optionFilterProp={'name'} placeholder="">
                            {
                                this.state.companyList.map((item, key) => {
                                    return <Select.Option key={key} name={item.name} value={item.name}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" loading={this.state.isLoading}>新增</Button>
                </Form.Item>
            </Form>
        );
    }
}
const Wrap_TabPane_Stuff_Form = Form.create({ name: 'TabPane_Settlement_Form' })(TabPane_Stuff_Form);

const columns = [{
    title: '编号',
    dataIndex: 'id',
    key: 'id'
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '条形码',
    dataIndex: 'code',
    key: 'code'
}, {
    title: '型号',
    dataIndex: 'model',
    key: 'model'
}, {
    title: '规格',
    dataIndex: 'specification',
    key: 'specification'
}, {
    title: '价格',
    dataIndex: 'unitPrice',
    key: 'unitPrice'
}, {
    title: '公司',
    dataIndex: 'companyName',
    key: 'companyName'
}];
class TabPane_Stuff extends React.Component {
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
        this.fetchStuff();
    }
    fetchStuff = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                queryList: encodeURI(JSON.stringify([])),
                page: 0,
                limit: 200
            };
            let stsFetch = new U_Fetch('/material', params);
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
        this.fetchStuff();
    }
    render () {
        const list = [];
        this.state.data.forEach((item, key) => {
            list.push({
                key: key,
                name: item.name,
                id: item.id,
                code: item.code,
                model: item.model,
                specification: item.specification,
                companyName: item.companyName,
                specificationc: item.specification,
                unitPrice: item.unitPrice
            });
        });
        return (
            <div id="TabPane_Stuff">
                <div className='content'>
                    <Modal title="新增物料" visible={this.state.visible}
                        onOk={this.close} onCancel={this.close}
                        footer={null}>
                        <Wrap_TabPane_Stuff_Form close={this.addSuccess}/>
                    </Modal>
                    <Button type="primary" htmlType="submit" onClick={this.showModal} className="add_button">新增物料</Button>
                    <Table columns={columns} dataSource={list} loading={this.state.isLoading}/>
                </div>
            </div>
        );
    }
}
export default TabPane_Stuff;
