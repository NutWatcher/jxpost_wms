import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Col, Select, Form, Input, Table } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_SaveStuffList.less';

class TabPane_SaveStuffList extends React.Component {
    state = {
        listData: [],
        showModal: false,
        isLoading: false,
        pagination: {
            total: 20,
            page: 0,
            limit: 5
        }
    };
    callback = (key) => {
        console.log(key);
    }
    fetchDeleteOrder = async (orderId) => {
        this.setState({ isLoading: true });
        try {
            let params = {
                id: orderId
            };
            let stsFetch = new U_Fetch('/order', params, { method: 'DELETE' });
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.state !== true) {
                message.error(`删除失败!:${data.message}` || '删除失败!');
                return;
            }
            this.fetchOrderList();
        } catch (e) {
            message.error(`删除失败!:${e.toString()}` || '删除失败!');
            this.setState({ isLoading: false });
        }
    }
    deleteRecord = (id) => {
        console.log('deleteRecord');
        console.log(id);
        this.fetchDeleteOrder(id);
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
    listChangePage = (page) => {
        let pagination = this.state.pagination;
        pagination.page = page - 1;
        this.setState({ pagination }, this.fetchOrderList);
    }
    fetchOrderList = async () => {
        this.setState({ isLoading: true });
        try {
            let pagination = this.state.pagination;
            let params = {
                queryList: encodeURIComponent(JSON.stringify([{ 'name': 'state', 'value': '入库' }])),
                page: pagination.page,
                limit: pagination.limit
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
            pagination.total = data.total;
            this.setState({ listData: data.rowList, pagination: { ...pagination } });
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

        const columns = [
            { title: '编号', dataIndex: 'id', key: 'id' },
            { title: '订单编号', dataIndex: 'code', key: 'code' },
            { title: '发票号', dataIndex: 'invoice', key: 'invoice' },
            { title: '结算公司', dataIndex: 'companyName', key: 'companyName' },
            { title: '入库时间', dataIndex: 'createDate', key: 'createDate' },
            { title: '备注', dataIndex: 'misc', key: 'misc' },
            { title: '操作员', dataIndex: 'userName', key: 'userName' },
            { title: '操作',
                dataIndex: 'action',
                key: 'action',
                render: (t, record) => (<Button key="1" size='small' type="primary" onClick={this.deleteRecord.bind(this, record.id)} className="action_button">删除</Button>)
            }
        ];
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
                        pagination = {
                            {
                                total: this.state.pagination.total,
                                current: this.state.pagination.page + 1,
                                pageSize: this.state.pagination.limit,
                                onChange: this.listChangePage
                            }
                        }
                    />
                </div>
            </div>
        );
    }
};
export default TabPane_SaveStuffList;
