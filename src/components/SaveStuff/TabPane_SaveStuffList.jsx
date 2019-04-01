import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Col, Select, Form, Input, Table } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_SaveStuffList.less';

const columns = [
    { title: '编号', dataIndex: 'id', key: 'id' },
    { title: '订单编号', dataIndex: 'code', key: 'code' },
    { title: '发票号', dataIndex: 'invoice', key: 'invoice' },
    { title: '结算公司', dataIndex: 'companyName', key: 'companyName' },
    { title: '入库时间', dataIndex: 'createDate', key: 'createDate' },
    { title: '备注', dataIndex: 'misc', key: 'misc' },
    { title: '操作员', dataIndex: 'userName', key: 'userName' }
];
class TabPane_SaveStuffList extends React.Component {
    state = {
        listData: [],
        showModal: false,
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
    showModal = () => this.setState({ showModal: true });
    closeModal = () => this.setState({ showModal: false });
    fetchOrderInfo = async (orderId) => {
        this.setState({ isLoading: true });
        try {
            let params = {
                queryList: encodeURIComponent(JSON.stringify([{ 'name': 'id', 'value': orderId }])),
                page: 0,
                limit: 200
            };
            let stsFetch = new U_Fetch('/orderDetail', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.state !== true) {
                message.error(`获取分类列表失败!:${data.message}` || '获取分类列表失败!');
                return;
            }
            return data.rowList;
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    expandedRowRender = (record, index, indent, expanded) => {
        const childColumns = [
            { title: '编号', dataIndex: 'materialId', key: 'materialId' },
            { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
            { title: '物料编号', dataIndex: 'materialCode', key: 'materialCode' },
            { title: '物料类型', dataIndex: 'materialModel', key: 'materialModel' },
            { title: '物料规格', dataIndex: 'materialSpecification', key: 'materialSpecification' },
            { title: '物料单价', dataIndex: 'materialUnitPrice', key: 'materialUnitPrice' },
            { title: '入库数量', dataIndex: 'quantity', key: 'quantity' },
            { title: '库存数量', dataIndex: 'inventoryQuantity', key: 'inventoryQuantity' }
        ];
        let id = record.id;
        let data = [];
        for (let i = 0; i < this.state.listData.length; i++) {
            if (this.state.listData[i].id === id) {
                data = this.state.listData[i].child;
            }
        }
        for (let i = 0; i < data.length; i++) {
            data[i] = { key: i, ...data[i] };
        }
        return (
            <Table
                columns={childColumns}
                dataSource={data}
                pagination={false}
            />
        );
    };
    fetchOrderList = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                queryList: encodeURIComponent(JSON.stringify([{ 'name': 'state', 'value': '入库' }])),
                page: 0,
                limit: 200
            };
            let stsFetch = new U_Fetch('/order', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.state !== true) {
                message.error(`获取分类列表失败!:${data.message}` || '获取分类列表失败!');
                return;
            }
            for (let i = 0; i < data.rowList.length; i++) {
                let childDate = await this.fetchOrderInfo(data.rowList[i].id);
                data.rowList[i].child = childDate;
            }
            this.setState({ listData: data.rowList });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchOrderList();
    }
    render () {
        const data = [];
        for (let i = 0; i < this.state.listData.length; ++i) {
            data.push({ key: i, ...this.state.listData[i] });
        }
        return (
            <div id="TabPane_SaveStuffList">
                <div className='content'>
                    <Button size="large" type="primary" onClick={this.fetchOrderList} className="reflash_button">刷新</Button>
                    <Table
                        loading = {this.state.isLoading}
                        className="components-table-demo-nested"
                        columns={columns}
                        expandedRowRender={this.expandedRowRender}
                        dataSource={data}
                    />
                </div>
            </div>
        );
    }
};
export default TabPane_SaveStuffList;
