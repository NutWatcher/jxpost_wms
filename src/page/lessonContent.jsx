import React from 'react';
import { Table, Icon, Button, message, Tag, Typography, Modal, Divider } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import { Map, Marker } from 'react-amap';
import C_Page_AddContent from '../components/Page_AddContent.jsx';
import C_Page_EditContent from '../components/Page_EditContent.jsx';
import C_PreviewCourseInfo from '../components/preview/C_PreviewCourseInfo.jsx';
import './lessonContent.less';

const { Text } = Typography;
const confirm = Modal.confirm;
const tableColumns = [{
    title: '课程名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="javascript:;">{text}</a>
}, {
    title: '预约/人数',
    dataIndex: 'number',
    key: 'number'
}, {
    title: '签到率',
    dataIndex: 'number',
    key: 'number'
}, {
    title: '开课时间',
    dataIndex: 'time',
    key: 'time'
}, {
    title: '开课地点',
    dataIndex: 'address',
    key: 'address'
},
{
    title: '课程状态',
    key: 'status',
    dataIndex: 'status',
    render: tag => (
        <span>
            {
                (() => {
                    let color = tag === '待审核' ? 'geekblue' : 'green';
                    return <Tag color={color} key={tag}>{tag}</Tag>;
                })()
            }
        </span>
    )
},
// {
//     title: '课程状态',
//     key: 'tags',
//     dataIndex: 'tags',
//     render: tags => (
//         <span>
//             {tags.map(tag => {
//                 let color = tag.length > 5 ? 'geekblue' : 'green';
//                 if (tag === 'loser') {
//                     color = 'volcano';
//                 }
//                 return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
//             })}
//         </span>
//     )
// },
{
    title: '操作',
    key: 'action',
    render: (text, record) => (
        <span>
            <Button size='small' onClick={null} className="action_button">查看</Button>
            <Divider type="vertical" />
            <Button size='small' type="primary" onClick={null} className="action_button">签到</Button>
            <Divider type="vertical" />
            <Button size='small' type="danger" onClick={null} className="action_button">关闭</Button>
        </span>
    )
}];
class LessonContent extends React.Component {
    state = {
        listData: [],
        isLoading: false,
        pagination: {
            total: 0,
            page: 1,
            limit: 10
        }
    };
    fetchLessonList = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                page: this.state.pagination.page - 1,
                limit: this.state.pagination.limit
            };
            let stsFetch = new U_Fetch('/v1/lesson', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.code !== 2000) {
                message.error(`获取课程发布列表失败!:${data.msg}` || '获取课程发布列表n失败!');
                return;
            }
            this.setState({ listData: data.lessonList, pagination: { total: data.total, page: this.state.pagination.page, limit: this.state.pagination.limit } });
        } catch (e) {
            message.error(`获取课程发布列表失败!:${e.toString()}` || '获取课程发布列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchLessonList();
    }
    renderTableData = () => {
        const listData = [];
        this.state.listData.forEach((item, key) => {
            let conditions = JSON.parse(item.condition);
            let dateType = conditions.dateType;
            let time = dateType;
            if (time !== '电话联系用户') {
                time = `${conditions.date.start}~${conditions.date.end}`;
            }
            listData.push({
                key: key,
                name: item.course.title,
                number: conditions.number,
                time: time,
                address: conditions.address || '',
                status: item.status
            });
        });
        return listData;
    }
    render () {
        const listData = this.renderTableData();
        return (
            <div id="LessonContent">
                <div className={'content '}>
                    <div className={'wrap_table '}>
                        <Table columns={tableColumns} dataSource={listData} loading={this.state.isLoading}/>
                    </div>
                </div>
            </div>
        );
    }
};
export default LessonContent;
