import React from 'react';
import ReactToPrint from 'react-to-print';
import { Button, Input, Modal, message, Table } from 'antd';
import Moment from 'moment';
import U_Fetch from '../utils/fetchFilter';
import './U_PrintOrderInfo.less';
class U_PrintOrderInfo extends React.Component {
    state = {
        order: {
            id: '',
            misc: '',
            date: ''
        },
        listData: []
    };
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
            this.setState({ listData: data.rowList });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    fetchOrder = async (orderId) => {
        this.setState({ isLoading: true });
        try {
            let params = {
                queryList: encodeURIComponent(JSON.stringify([{ 'name': 'id', 'value': orderId }])),
                page: 0,
                limit: 10
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
            if (data.total <= 0) {
                message.error(`获取信息失败!数据库中没有改信息`);
            }
            let order = {
                id: orderId,
                misc: data.rowList[0].misc,
                date: data.rowList[0].createDate
            };
            this.setState({ order });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchOrderInfo(this.props.id);
        this.fetchOrder(this.props.id);
    }
    render () {
        const columns = [
            { title: '编号', dataIndex: 'materialId', key: 'materialId' },
            { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
            { title: '物料编号', dataIndex: 'materialCode', key: 'materialCode' },
            { title: '物料类型', dataIndex: 'materialModel', key: 'materialModel' },
            { title: '物料规格', dataIndex: 'materialSpecification', key: 'materialSpecification' },
            { title: '物料单价', dataIndex: 'materialUnitPrice', key: 'materialUnitPrice' },
            { title: '数量', dataIndex: 'quantity', key: 'quantity' },
            { title: '库存数量', dataIndex: 'inventoryQuantity', key: 'inventoryQuantity' }
        ];
        return (
            <div id="U_PrintOrderInfo">
                <div ref={el => (this.componentRef = el)}>
                    <p>编号:{this.state.order.id}</p>
                    <p>时间:{this.state.order.date}</p>
                    <p>备注:{this.state.order.misc}</p>
                    <p></p>
                    <Table
                        columns={columns}
                        expandedRowRender={this.expandedRowRender}
                        dataSource={this.state.listData}
                        pagination={false}
                    />
                </div>
                <ReactToPrint
                    trigger={() => <Button size="large" autoFocus style={{ margin: '10px 0px' }}>打印订单</Button>}
                    content={() => this.componentRef}
                />
            </div>
        );
    }
}
export default U_PrintOrderInfo;
