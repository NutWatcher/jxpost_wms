import React from 'react';
import { List, Icon, Button, message, Spin, Typography, Modal } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import C_Page_AddContent from '../components/Page_AddContent.jsx';
import C_Page_EditContent from '../components/Page_EditContent.jsx';
import C_PreviewCourseInfo from '../components/preview/C_PreviewCourseInfo.jsx';
import C_Page_PublishLesson from '../components/Page_PublishLesson.jsx';
import './courseContent.less';

const { Text } = Typography;
const confirm = Modal.confirm;
class CourseContent extends React.Component {
    state = {
        previewData: {},
        editData: {},
        publishData: {},
        showPublishLesson: false,
        showPreviewCourseInfo: false,
        isLoading: false,
        activeAddComponent: false,
        activeEditComponent: false,
        courseInfoList: [],
        pagination: {
            total: 0,
            page: 1,
            limit: 10
        }
    };
    changeAddComponent = () => {
        this.setState({ activeAddComponent: !this.state.activeAddComponent });
    }
    handleAddCourseSuccess = () => {
        this.setState({ activeAddComponent: !this.state.activeAddComponent }, this.resetCourseList);
    }
    showEdit = (data) => {
        let tempData = data;
        this.setState({ activeEditComponent: true, editData: tempData });
    }
    handleEditCourseClose = () => {
        this.setState({ activeEditComponent: false });
    }
    handleEditCourseSuccess = () => {
        this.setState({ activeEditComponent: false }, this.resetCourseList);
    }
    resetCourseList = () => {
        this.setState({ pagination: { total: this.state.pagination.total, page: 1, limit: this.state.pagination.limit } }, this.fetchCourseList);
    }
    fetchDelete = async (id) => {
        this.setState({ isLoading: true });
        try {
            let params = { id: id };
            let options = {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' },
                method: 'POST'
            };
            let deleteFetch = new U_Fetch('/v1/course/delete', params, options);
            await deleteFetch.queryFetch();
            await deleteFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = deleteFetch.data;
            if (data.code !== 2000) {
                message.error(`删除失败!:${data.msg}` || '删除失败!');
                return;
            }
            this.fetchCourseList();
        } catch (e) {
            message.error(`删除失败!:${e.toString()}` || '删除失败!');
            this.setState({ isLoading: false });
        }
    }
    deleteCourse = (id) => {
        let _self = this;
        confirm({
            title: '确定要删除这个课程模板吗？',
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                _self.fetchDelete.bind(_self, id)();
            },
            onCancel () {
                console.log('Cancel');
            }
        });
    }
    fetchSubmit = async (id) => {
        this.setState({ isLoading: true });
        try {
            let params = { id: id };
            let options = {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' },
                method: 'POST'
            };
            let submitFetch = new U_Fetch('/v1/course/submit', params, options);
            await submitFetch.queryFetch();
            await submitFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = submitFetch.data;
            if (data.code !== 2000) {
                message.error(`上送失败!:${data.msg}` || '上送失败!');
                return;
            }
            this.fetchCourseList();
        } catch (e) {
            message.error(`上送失败!:${e.toString()}` || '上送失败!');
            this.setState({ isLoading: false });
        }
    }
    submitCourse = (id) => {
        let _self = this;
        confirm({
            title: '确定要提交审核？',
            content: '提交后不可修改',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                _self.fetchSubmit.bind(_self, id)();
            },
            onCancel () {
                console.log('Cancel');
            }
        });
    }
    fetchCourseList = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                page: this.state.pagination.page - 1,
                limit: this.state.pagination.limit
            };
            let stsFetch = new U_Fetch('/v1/course', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.code !== 2000) {
                message.error(`获取上传Token失败!:${data.msg}` || '获取上传Token失败!');
                return;
            }
            this.setState({ courseInfoList: data.courseInfoList, pagination: { total: data.total, page: this.state.pagination.page, limit: this.state.pagination.limit } });
        } catch (e) {
            message.error(`获取上传Token失败!:${e.toString()}` || '获取上传Token失败!');
            this.setState({ isLoading: false });
        }
    }
    showPreview = (data) => {
        this.setState({ showPreviewCourseInfo: true, previewData: data });
    }
    showPublishLesson = (data) => {
        this.setState({ showPublishLesson: true, publishData: data });
    }
    componentDidMount () {
        this.fetchCourseList();
    }
    render () {
        const listData = [];
        for (let i = 0; i < this.state.courseInfoList.length; i++) {
            let content = JSON.parse(this.state.courseInfoList[i].content);
            let avatar = null;
            if (content.bannerFileList) {
                avatar = content.bannerFileList[0] || null;
            }
            listData.push({
                rawData: this.state.courseInfoList[i],
                id: this.state.courseInfoList[i].id,
                href: 'http://ant.design',
                title: `${this.state.courseInfoList[i].title}`,
                avatar: avatar.url,
                description: `${this.state.courseInfoList[i].introduction}`,
                status: this.state.courseInfoList[i].status
            });
        }
        const renderAction = (item) => {
            let actions = [];
            let editActions = [];
            editActions.push(<Button key={1} disabled={item.status === '审核中'} onClick={this.showEdit.bind(this, item.rawData)}>编辑</Button>);
            editActions.push(<Button key={2} style={{ 'marginTop': '10px' }} onClick={this.showPreview.bind(this, item.rawData)}>查看</Button>);
            editActions.push(<Button key={3} style={{ 'marginTop': '10px' }} type="danger" onClick={this.deleteCourse.bind(this, item.id)}>删除</Button>);
            let editActionsWarp = <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>{editActions}</div>;

            let submitActions = [];
            submitActions.push(<Button key={1} onClick={this.submitCourse.bind(this, item.id)} type="primary" disabled={item.status !== '未审核'}>提交审核</Button>);
            submitActions.push(<Button key={2} type="primary" disabled={item.status !== '审核通过'} style={{ 'marginTop': '10px' }} onClick={this.showPublishLesson.bind(this, item.rawData)}>发布课程</Button>);
            let submitActionsWarp = <div style={{ 'display': 'flex', 'flexDirection': 'column' }}>{submitActions}</div>;

            actions.push(submitActionsWarp);
            actions.push(editActionsWarp);
            return actions;
        };
        const renderStatus = (item) => {
            if (item.status === '未审核' || item.status === '审核失败') { return 'danger'; }
            if (item.status === '审核通过') { return ''; }
            return 'secondary';
        };
        return (
            <div id="CourseContent">
                {
                    this.state.showPreviewCourseInfo
                        ? <C_PreviewCourseInfo data={this.state.previewData}
                            close={() => { this.setState({ showPreviewCourseInfo: false }); }}/> : null
                }
                {
                    this.state.showPublishLesson
                        ? <C_Page_PublishLesson data={this.state.publishData}
                            close={() => { this.setState({ showPublishLesson: false }); } } success={() => { this.setState({ showPublishLesson: false }); } }/> : null
                }
                <div className={'edit_content ' + (this.state.activeEditComponent ? 'edit_show' : 'edit_hide')}>
                    <div className={'addComponent '}>
                        <C_Page_EditContent data = {this.state.editData}
                            cancel={this.handleEditCourseClose} close={this.handleEditCourseSuccess}/>
                    </div>
                </div>
                <div className={'content ' + (!this.state.activeEditComponent ? 'table_show' : 'table_hide') }>
                    <div className="wrap_addComponent">
                        <div className="addComponentHead">
                            <Button type="dashed" size="large" block onClick={this.changeAddComponent}> <Icon type="plus" />{'新增课程内容'}</Button>
                        </div>
                        <div className={'addComponent ' + (this.state.activeAddComponent ? 'show' : 'hide')}>
                            <C_Page_AddContent success={this.handleAddCourseSuccess}/>
                        </div>
                    </div>
                    <div className={'wrap_table '}>
                        {/* {
                            this.state.isLoading ? <div className="warp_spin"><Spin /></div> : null
                        } */}
                        <List
                            // itemLayout="vertical"
                            size="large"
                            loading = {this.state.isLoading}
                            pagination={{
                                onChange: (page) => {
                                    console.log(page);
                                },
                                total: this.state.pagination.total,
                                pageSize: this.state.pagination.limit,
                                current: this.state.pagination.page
                            }}
                            dataSource={listData}
                            // footer={<div><b>ant design</b> footer part</div>}
                            renderItem={item => (
                                <List.Item
                                    key={item.title}
                                    // actions={[<IconText type="star-o" text="156" />, <IconText type="like-o" text="156" />, <IconText type="message" text="2" />]}
                                    actions = {renderAction(item)}
                                >
                                    <List.Item.Meta
                                        avatar={<div className="wrap_item_avatar"><img className="item_avatar" width={272} alt="logo" src={item.avatar} /></div>}
                                        title={<a className="wrap_item_title" href={item.href}>{item.title}</a>}
                                        description={item.description}
                                    />
                                    <Text type={renderStatus(item)} >{item.status}</Text>
                                </List.Item>
                            )}
                        />
                    </div>
                </div>
            </div>
        );
    }
};
export default CourseContent;
