import React from 'react';
import { Card, Icon, Button, message, Tag, Typography, Modal, Col, Row } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import { Map, Marker } from 'react-amap';
import C_Page_AddContent from '../components/Page_AddContent.jsx';
import C_Page_EditContent from '../components/Page_EditContent.jsx';
import C_PreviewCourseInfo from '../components/preview/C_PreviewCourseInfo.jsx';
import './index.less';

const { Text, Title } = Typography;
const confirm = Modal.confirm;
class About extends React.Component {
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
        // this.fetchLessonList();
    }

    render () {
        return (
            <div id="LessonContent">
                <div className='content'>
                    <Title className="" level={2}>V0.1版本上线</Title>
                </div>
            </div>
        );
    }
};
export default About;
