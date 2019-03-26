import React from 'react';
import { Steps, Input, Form, Button, Select, Card, Modal, message, Spin } from 'antd';
import './Page_AddContent.less';
import { C_PreviewCourse, C_PreviewCourseList } from './C_PreviewCourse.jsx';
import C_PreviewCourseInfo from './preview/C_PreviewCourseInfo.jsx';
import C_ImageUpload from './C_ImageUpload.jsx';
import U_Fetch from '../utils/fetchFilter';

// import C_PreviewCourse from './C_PreviewCourse.jsx';

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
class Step_1 extends React.Component {
    state = {
        classificationList: []
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                values.classificationList = [];
                let classList = values.class;
                this.state.classificationList.forEach((item, key) => {
                    for (let i = 0; i < classList.length; i++) {
                        if (classList[i] === item.id) {
                            values.classificationList.push(item);
                        }
                    }
                });
                this.props.next(0, values);
            }
        });
    }
    fetchClassification = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {};
            let stsFetch = new U_Fetch('/v1/classification', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.code !== 2000) {
                message.error(`获取分类列表失败!:${data.msg}` || '获取分类列表失败!');
                return;
            }
            let classificationList = data.classificationList;
            this.setState({ classificationList: classificationList });
        } catch (e) {
            message.error(`获取分类列表失败!:${e.toString()}` || '获取上分类列表失败!');
            this.setState({ isLoading: false });
        }
    }
    componentDidMount () {
        this.fetchClassification();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="Step_1">
                <Form.Item label="课程标题">
                    {getFieldDecorator('title', {
                        initialValue: this.props.title,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="不超过12个汉字!" />
                    )}
                </Form.Item>
                <Form.Item label="课程简介">
                    {getFieldDecorator('introduction', {
                        initialValue: this.props.introduction,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="用于课程详情页中的简单介绍,不超过30个汉字！" />
                    )}
                </Form.Item>
                <Form.Item label="课程分类">
                    {getFieldDecorator('class', {
                        initialValue: this.props.class,
                        rules: [{ required: true, message: '不能为空,如果没有契合的分类,联系平台人员添加', type: 'array' }]
                    })(
                        <Select size="large" mode="multiple" optionFilterProp={'name'} placeholder="课程分类可以多选">
                            {
                                this.state.classificationList.map((item, key) => {
                                    return <Select.Option key={key} name={item.name} value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button size="large" type="primary" htmlType="submit" className="step_button">下一步</Button>
                </Form.Item>
            </Form>
        );
    }
}
const WrappedStep_1 = Form.create({ name: 'normal_login' })(Step_1);

class Step_2 extends React.Component {
    state = {
        isLoading: false,
        stsToken: {
            'uploadPosition': ''
        },
        values: this.props.values
    };
    handleSubmit = () => {
        this.props.next(1, this.state.values);
    }
    handlePreStep= () => {
        this.props.pre(1);
    }
    fetchStsToken = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {
                type: 'image'
            };
            let stsFetch = new U_Fetch('/v1/upload/stsToken', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.code !== 2000) {
                message.error(`获取上传Token失败!:${data.msg}` || '获取上传Token失败!');
                return;
            }
            let stsToken = data.stsToken;
            this.setState({ stsToken: {
                OSSAccessKeyId: stsToken.appId,
                policy: stsToken.policy,
                Signature: stsToken.sign,
                key: stsToken.path,
                success_action_status: '201',
                uploadPosition: stsToken.uploadPosition
            } });
        } catch (e) {
            message.error(`获取上传Token失败!:${e.toString()}` || '获取上传Token失败!');
            this.setState({ isLoading: false });
        }
    }
    bannerFileList = (fileList) => {
        let tempValues = this.state.values;
        tempValues.bannerFileList = fileList;
        this.setState({ values: tempValues });
    }
    infoFileList = (fileList) => {
        let tempValues = this.state.values;
        tempValues.infoFileList = fileList;
        this.setState({ values: tempValues });
    }
    componentDidMount () {
        this.fetchStsToken();
    }
    render () {
        return (
            <div className="Step_2">
                {
                    this.state.isLoading ? <Spin /> : null
                }
                <Card title="轮播图">
                    <C_ImageUpload action={this.state.stsToken.uploadPosition}
                        fileList={this.state.values.bannerFileList || []} changeFileList={this.bannerFileList}
                        fileMax={10} data={this.state.stsToken}/>
                </Card>
                <Card title="课程详情">
                    <C_ImageUpload action={this.state.stsToken.uploadPosition}
                        fileList={this.state.values.infoFileList || []} changeFileList={this.infoFileList}
                        fileMax={10} data={this.state.stsToken}/>
                </Card>
                <Button size="large" type="primary" onClick={this.handlePreStep} className="step_button">上一步</Button>
                <Button size="large" style={{ marginLeft: '20px' }} type="primary" onClick={this.handleSubmit} className="step_button">下一步</Button>
            </div>
        );
    }
}
class Step_3 extends React.Component {
    state = {
        showPreviewModal: false,
        showCourseModal: false
    };
    handleSubmit = (e) => {
        this.props.next(2, this.state.values);
    }
    handlePreStep= (e) => {
        this.props.pre(2);
    }
    showPreviewModal = (value) => {
        this.setState({ showPreviewModal: value });
    }
    showCourseModal = (value) => {
        this.setState({ showCourseModal: value });
    }
    render () {
        let previewData = this.props.data;
        previewData = JSON.parse(JSON.stringify(previewData));
        previewData.content = JSON.stringify(previewData.content);
        return (
            <div className="Step_2">
                {
                    this.state.showPreviewModal
                        ? <C_PreviewCourseInfo data={previewData}
                            close={() => { this.setState({ showPreviewModal: false }); }}/> : null
                }
                <Modal
                    title="详情页模拟展示"
                    visible={this.state.showCourseModal}
                    onCancel={this.showCourseModal.bind(this, false)}
                    footer={null}
                >
                    <C_PreviewCourseList />
                </Modal>
                <div>
                    <Button size="large" type="primary" onClick={this.showPreviewModal.bind(this, true)} className="step_button">预览列表页</Button>
                </div>
                <Button size="large" type="primary" onClick={this.handlePreStep} className="step_button">上一步</Button>
                <Button size="large" style={{ marginLeft: '20px' }} type="primary" onClick={this.handleSubmit} className="step_button">确定</Button>
            </div>
        );
    }
}
class C_Page_AddContent extends React.Component {
    state = {
        id: this.props.id || 0,
        current: 0,
        content: {
            title: '',
            introduction: '',
            class: [],
            classificationList: [],
            content: {
                bannerFileList: [],
                infoFileList: []
            }
        }
    };
    fetchAddCourse = () => {
        this.setState({ loading: true, loginMessage: '' });
        let formData = JSON.parse(JSON.stringify(this.state.content));
        formData.content = JSON.stringify(formData.content);
        console.log(formData.content);
        fetch('/v1/course', {
            method: 'POST',
            mode: 'cors', // 避免cors攻击
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error();
                }
            })
            .then((resonseData) => {
                console.log(resonseData);
                if (resonseData.code !== 2000) {
                    message.error(`添加失败!:${resonseData.msg}` || '添加失败!');
                } else {
                    message.success('添加成功');
                    this.props.success();
                }
            })
            .catch((error) => {
                console.log(error);
                message.error(`添加失败!:${error.toString()}` || '添加失败!');
            });
    };
    next = (now, value) => {
        if (now === 0) {
            this.state.content.title = value.title;
            this.state.content.introduction = value.introduction;
            this.state.content.class = value.class;
            this.state.content.classificationList = value.classificationList;
            this.state.current = 1;
        } else if (now === 1) {
            this.state.content.content = value;
            this.state.current = 2;
        } else if (now === 2) {
            this.fetchAddCourse();
        }
        this.setState(this.state);
    }
    pre = (now, value) => {
        if (now === 1) {
            this.state.current = 0;
        } if (now === 2) {
            this.state.current = 1;
        }
        this.setState(this.state);
    }
    render () {
        const { current } = this.state;
        const steps = [
            {
                title: '课程基本信息',
                content: <WrappedStep_1 title={this.state.content.title} introduction={this.state.content.introduction}
                    class={this.state.content.class} next={this.next}/>
            }, {
                title: '课程图文介绍',
                content: <Step_2 values={this.state.content.content} next={this.next} pre = {this.pre}/>
            }, {
                title: '预览',
                content: <Step_3 next={this.next} pre = {this.pre} data={this.state.content}/>
            }
        ];
        return (
            <div id="C_Page_AddContent">
                <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title} />)}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
            </div>
        );
    }
}
export default C_Page_AddContent;
