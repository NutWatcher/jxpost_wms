import React from 'react';
import { Tabs, InputNumber, Button, message, Alert, Modal, Steps, Select, Form, Input, Table } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_SellStuff.less';
const Step = Steps.Step;
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
class tabPane_SellStuffList_Form extends React.Component {
    state = {
        departmentList: [],
        fetching: false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.next(values);
            }
        });
    }
    fetchDepartment = async (name) => {
        this.setState({ isLoading: true });
        try {
            let params = {
                query: name,
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
            this.setState({ departmentList: data.rowList });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchDepartment('');
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} id="TabPane_SellStuffList_Form">
                <Form.Item label="领料单位" >
                    {getFieldDecorator('departmentId', {
                        initialValue: this.props.departmentId,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Select size="large" onSearch={this.fetchCompany} showSearch
                            notFoundContent={this.state.fetching ? <Spin size="small" /> : null}
                            optionFilterProp={'name'} placeholder="" style={{ width: 200 }}>
                            {
                                this.state.departmentList.map((item, key) => {
                                    return <Select.Option key={key} name={item.name} value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item wrapperCol={{
                    xs: { span: 24, offset: 0 },
                    sm: { span: 16, offset: 8 }
                }}>
                    <Button size="large" type="primary" htmlType="submit" className="step_button">下一步</Button>
                </Form.Item>
            </Form>
        );
    }
}
const TabPane_SellStuffList_Form = Form.create({ name: 'TabPane_SellStuffList_Form' })(tabPane_SellStuffList_Form);
class TabPane_SellStuffList_Table extends React.Component {
    state = {
        visible: false,
        code: '',
        stuffList: [],
        shopcarList: [],
        selectStuffInfo: '',
        selectStuff: null,
        selectNumber: 1,
        totalPrice: 0,
        errorList: [],
        selectShopCarStuffNumber: 0,
        selectShopCarStuffId: 0,
        shopCarNumberVisible: false
    }
    tableKey = 1;
    shopcarListColumns = [
        {
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
            title: '数量',
            dataIndex: 'number',
            key: 'number',
            render: (t, record) => {
                return <div>{t}<Button size='small' type="primary" onClick={this.showShopCarNumberModal.bind(this, record)}>修改</Button></div>;
            }
        }, {
            title: '总价',
            dataIndex: 'totalPrice',
            key: 'totalPrice'
        }];
    submit = () => {
        this.setState({ errorList: [] });
        this.props.next(this.state.shopcarList);
    }
    addStuffToCar = (v) => {
        let selectStuff = this.state.selectStuff;
        let selectStuffInfo = this.state.selectStuffInfo;
        this.state.stuffList.forEach((item) => {
            if (item.name === v) {
                selectStuff = item;
                selectStuff.number = this.state.defaultNumber;
                selectStuffInfo = `${item.name} - ${item.code} - ${item.unitPrice}`;
            }
        });
        this.setState({ selectStuff, selectStuffInfo });
    }
    fetchStuff = async (v) => {
        this.setState({ isLoading: true });
        try {
            let params = {
                queryList: encodeURI(JSON.stringify([{ name: 'name', value: v }])),
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
            this.setState({ stuffList: data.rowList });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    onChangeStuffNumber = (v) => this.setState({ selectNumber: v });
    showModal = () => {
        if (this.state.selectStuff === null) {
            message.error('请选择物料名单');
        } else {
            this.setState({ visible: true });
        }
    };
    handleOk = () => {
        let selectStuff = JSON.parse(JSON.stringify(this.state.selectStuff));
        selectStuff.number = this.state.selectNumber;
        selectStuff.totalPrice = selectStuff.number * selectStuff.unitPrice;
        selectStuff.key = this.tableKey++;
        let list = this.state.shopcarList;
        let flag = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === selectStuff.id) {
                flag = true;
                list[i].number = list[i].number + selectStuff.number;
                list[i].totalPrice = (list[i].number * list[i].unitPrice).toFixed(2);
            }
        }
        if (flag === false) {
            list.push(selectStuff);
        }
        let totalPrice = this.reCount(list);
        this.setState({ shopcarList: list, visible: false, totalPrice });
    }
    fetchStuffByCode = (v) => {
        return new Promise(async (resolve, reject) => {
            this.setState({ isLoading: true });
            try {
                let params = {
                    queryList: encodeURI(JSON.stringify([{ name: 'code', value: v }])),
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
                    reject(data.message);
                    return;
                }
                resolve(data.rowList);
            } catch (e) {
                message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
                this.setState({ isLoading: false });
                reject(e.toString());
            }
        });
    }
    reCount = (list) => {
        let total = 0;
        list.forEach(item => { total += item.number * item.unitPrice; });
        return total.toFixed(2);
    }
    onChangeShopCarStuffNumber = (v) => this.setState({ selectShopCarStuffNumber: v });
    showShopCarNumberModal = (record) => {
        console.log(record);
        let selectShopCarStuffNumber = record.number;
        let selectShopCarStuffId = record.id;
        this.setState({ selectShopCarStuffNumber, selectShopCarStuffId, shopCarNumberVisible: true });
    }
    changeShopCarNumber = () => {
        let list = this.state.shopcarList;
        for (let i = 0; i < list.length; i++) {
            if (list[i].id === this.state.selectShopCarStuffId) {
                list[i].number = list[i].number + this.state.selectShopCarStuffNumber;
                list[i].totalPrice = (list[i].number * list[i].unitPrice).toFixed(2);
            }
        }
        let totalPrice = this.reCount(list);
        this.setState({ totalPrice, shopcarList: list, shopCarNumberVisible: false });
    }
    addStuffByCode = async () => {
        let code = this.state.code;
        try {
            this.setState({ code: '' });
            let resList = await this.fetchStuffByCode(code);
            if (resList.length === 0) {
                let list = this.state.errorList;
                list.push(`${code} - 没有该物品信息`);
                this.setState({ errorList: list });
                return;
            }
            let selectStuff = resList[0];
            selectStuff.number = 1;
            selectStuff.totalPrice = 1 * selectStuff.unitPrice;
            selectStuff.key = this.tableKey++;
            let list = this.state.shopcarList;
            let flag = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === selectStuff.id) {
                    flag = true;
                    list[i].number = list[i].number + selectStuff.number;
                    list[i].totalPrice = (list[i].number * list[i].unitPrice).toFixed(2);
                }
            }
            if (flag === false) {
                list.push(selectStuff);
            }

            let totalPrice = this.reCount(list);
            this.setState({ shopcarList: list, visible: false, totalPrice });
        } catch (e) {
            let list = this.state.errorList;
            list.push(`${code} - ${e}`);
            this.setState({ errorList: list });
        }
    }
    changeCode = (e) => { this.setState({ code: e.target.value }); }
    handleCancel = () => this.setState({ visible: false, shopCarNumberVisible: false });
    componentDidMount () { this.fetchStuff(''); }
    render () {
        return (
            <div id="TabPane_SellStuffList_Table">
                <Select
                    showSearch size="large" style={{ width: 200 }}
                    placeholder="选择一个物料名单" optionFilterProp="children"
                    onSearch={this.fetchStuff} onChange={this.addStuffToCar} optionFilterProp={'name'}
                >
                    {
                        this.state.stuffList.map((item, key) => {
                            return <Select.Option key={key} name={item.name} value={item.name}>{item.name}</Select.Option>;
                        })
                    }
                </Select>
                <Button size="large" type="primary" onClick={this.showModal} className="step_button">加入入库清单</Button>
                <Input size="large" placeholder="条码输入框" value={this.state.code}
                    className="step_2_input" onChange={this.changeCode} onPressEnter={this.addStuffByCode}/>
                <Modal
                    title={this.state.selectStuff ? this.state.selectStuff.name : ''}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <InputNumber min={1} max={100000} value={this.state.selectNumber} onChange={this.onChangeStuffNumber} />,
                </Modal>
                <Modal
                    title={'修改数量'}
                    visible={this.state.shopCarNumberVisible}
                    onOk={this.changeShopCarNumber}
                    onCancel={this.handleCancel}
                >
                    <InputNumber min={1} max={100000} value={this.state.selectShopCarStuffNumber} onChange={this.onChangeShopCarStuffNumber} />,
                </Modal>
                <p className="selectStuffInfo">{this.state.selectStuffInfo}</p>
                <div>
                    {
                        this.state.errorList.map((item) => {
                            return <p className="errorCodeInfo">{item}</p>;
                        })
                    }
                </div>
                <Table rowKey={'key'} columns={this.shopcarListColumns} dataSource={this.state.shopcarList} />
                <Button size="large" type="primary" onClick={this.submit} className="step_button">执行出库</Button>
                <span className="total_price">总价： {this.state.totalPrice}</span>
            </div>
        );
    }
}

class TabPane_SellStuff_Result extends React.Component {
    render () {
        return (
            <div id="TabPane_SellStuff_Result">
                <div className="content">
                    {this.props.result === '等待'
                        ? <Alert
                            message="后台处理中"
                            description="请耐心等待..."
                            type="info"
                            showIcon
                        />
                        : null}
                    {this.props.result === '成功'
                        ? <Alert
                            message="成功"
                            description="物料已经加出库存信息系统中."
                            type="success"
                            showIcon
                        />
                        : null}
                    {this.props.result === '失败'
                        ? <Alert
                            message="失败"
                            description={this.props.resultMessage}
                            type="error"
                            showIcon
                        />
                        : null}
                    {this.props.result === '等待' ? null
                        : <Button size="large" type="primary" onClick={this.props.next} className="step_button">继续添加出库信息</Button>
                    }
                </div>
            </div>
        );
    }
}
class TabPane_SellStuff extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLoading: false,
            formAddResult: '等待',
            formAddResultMessage: '',
            form: {
                name: '',
                invoice: '',
                misc: '备注',
                state: '出库',
                departmentId: '',
                inventoryList: []
            },
            current: 0
        };
    }
    reStart = () => this.setState({
        current: 0,
        form: {
            name: '',
            invoice: '',
            misc: '备注',
            state: '出库',
            departmentId: '',
            inventoryList: []
        }
    })
    next = (v) => {
        let form = this.state.form;
        form = { ...form, ...v };
        this.setState({ current: 1, form });
    }
    fetchSellStuff = async (v) => {
        this.setState({ isLoading: true });
        try {
            let params = this.state.form;
            let stsFetch = new U_Fetch('/order', params, { method: 'POST' });
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.state !== true) {
                message.error(`获取分类列表失败!:${data.message}` || '获取分类列表失败!');
                this.setState({ formAddResult: '失败', formAddResultMessage: data.message });
                return;
            }
            this.setState({ formAddResult: data.state ? '成功' : '失败' });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    };
    submit = (shopList) => {
        console.log(shopList);
        let inventoryList = [];
        shopList.forEach(item => inventoryList.push({ id: item.id, quantity: item.number }));
        let form = { ...this.state.form, inventoryList };
        this.setState({ current: 2, form }, this.fetchSellStuff);
    }

    render () {
        const steps = [{
            title: '填写出库信息',
            content: <TabPane_SellStuffList_Form next={this.next} />
        }, {
            title: '选择物料',
            content: <TabPane_SellStuffList_Table next={this.submit} />
        }, {
            title: '等待上传',
            content: <TabPane_SellStuff_Result resultMessage = {this.state.formAddResultMessage}
                result = {this.state.formAddResult} next={this.reStart} />
        }];
        return (
            <div id="TabPane_SellStuff">
                <div className='content'>
                    <Steps current={this.state.current}>
                        {steps.map(item => <Step key={item.title} title={item.title} />)}
                    </Steps>
                    <div className="steps-content">{steps[this.state.current].content}</div>
                </div>
            </div>
        );
    }
}
export default TabPane_SellStuff;
