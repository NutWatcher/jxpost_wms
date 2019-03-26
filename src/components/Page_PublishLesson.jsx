import React from 'react';
import { InputNumber, Input, Form, Button, Select, Card, Modal, message, DatePicker } from 'antd';
import './Page_PublishLesson.less';
import U_Fetch from '../utils/fetchFilter';
import C_Map from './C_Map.jsx';
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
class PublishLesson_Form extends React.Component {
    state = {
        loading: false,
        showMap: false,
        showDateSelect: false,
        conditionList: []
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.submit(values);
                this.setState({ loading: true });
            }
        });
    }
    showMap = () => {
        this.setState({ showMap: true });
    }
    selectLngLat= (v) => {
        this.props.form.setFieldsValue({ 'addressLnglat': v });
    }
    fetchConditionList = async () => {
        this.setState({ isLoading: true });
        try {
            let params = {};
            let stsFetch = new U_Fetch('/v1/lesson/conditions', params);
            await stsFetch.queryFetch();
            await stsFetch.filterFetch();
            this.setState({ isLoading: false });
            let data = stsFetch.data;
            if (data.code !== 2000) {
                message.error(`获取条件列表失败!:${data.msg}` || '获取条件列表失败!');
                return;
            }
            let conditionList = data.conditionList;
            this.setState({ conditionList: conditionList });
        } catch (e) {
            message.error(`获取条件列表失败!:${e.toString()}` || '获取条件列表失败!');
            this.setState({ isLoading: false });
        }
    }
    setDateType = (value) => {
        if (value === '固定时间') {
            this.setState({ showDateSelect: true });
        } else {
            this.setState({ showDateSelect: false });
        }
    }
    componentDidMount () {
        this.fetchConditionList();
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form {...formItemLayout} onSubmit={this.handleSubmit} className="Step_1" >
                <Form.Item label="开课时间">
                    {getFieldDecorator('dateType', {
                        initialValue: this.props.dateType,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Select size="large" placeholder="选择约课时间类型" onChange={this.setDateType} >
                            <Select.Option key={1} value={'固定时间'}>{'固定时间'}</Select.Option>
                            <Select.Option key={2} value={'电话联系用户'}>{'电话联系用户'}</Select.Option>
                        </Select>
                    )}
                </Form.Item>
                {
                    this.state.showDateSelect
                        ? <Form.Item label="上课开始时间">
                            {getFieldDecorator('startDate', {
                                initialValue: this.props.lessonDate,
                                rules: [{ required: true, message: '不能为空' }]
                            })(
                                <DatePicker size="large" showTime format="YYYY-MM-DD HH:mm:ss" />
                            )}
                        </Form.Item> : null
                }
                {
                    this.state.showDateSelect
                        ? <Form.Item label="上课结束时间">
                            {getFieldDecorator('endDate', {
                                initialValue: this.props.lessonDate,
                                rules: [{ required: true, message: '不能为空' }]
                            })(
                                <DatePicker size="large" showTime format="YYYY-MM-DD HH:mm:ss" />
                            )}
                        </Form.Item> : null
                }

                <Form.Item label="上课人数">
                    {getFieldDecorator('number', {
                        initialValue: this.props.introduction,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <InputNumber min={0} max={999} size="large" placeholder="最大999"/>
                    )}
                </Form.Item>
                <Form.Item label="上课地点">
                    {getFieldDecorator('address', {
                        initialValue: this.props.introduction,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" placeholder="用于课程详情页中的地点展示！" />
                    )}
                </Form.Item>
                <Form.Item label="上课地点坐标">
                    {getFieldDecorator('addressLnglat', {
                        initialValue: this.props.addressLnglat,
                        rules: [{ required: true, message: '不能为空' }]
                    })(
                        <Input size="large" disabled placeholder="用于地理位置的展示！" />
                    )}
                    <Button style={{ 'marginTop': '10px' }} onClick={this.showMap} className="">在地图中选择坐标</Button>
                </Form.Item>
                {
                    this.state.showMap
                        ? <div style={{ width: '100%', height: '200px', marginBottom: '24px' }}>
                            <C_Map onSelectLngLat={this.selectLngLat}/>
                        </div>
                        : null
                }

                <Form.Item label="约课条件">
                    {getFieldDecorator('conditions', {
                        initialValue: this.props.class,
                        rules: [{ type: 'array' }]
                    })(
                        <Select size="large" mode="multiple" optionFilterProp={'name'} placeholder="选择约课条件，没有类型请联系平台人员添加">
                            {
                                this.state.conditionList.map((item, key) => {
                                    return <Select.Option key={key} name={item.name} value={item.id}>{item.name}</Select.Option>;
                                })
                            }
                        </Select>
                    )}
                </Form.Item>
                <div style={{ 'textAlign': 'right' }}>
                    <Button size="large" style={{ 'marginRight': '10px' }} onClick={this.props.cancel} className="step_button">取消</Button>
                    <Button size="large" loading={this.state.loading} type="primary" htmlType="submit" className="step_button">发布课程</Button>
                </div>
            </Form>
        );
    }
}
const Wrapped_PublishLesson_Form = Form.create({ name: 'publishLesson_Form' })(PublishLesson_Form);
class C_Page_PublishLesson extends React.Component {
    state = {
        id: this.props.id || 0,
        visible: true
    };
    submit = (values) => {
        this.fetchAddLesson(values);
    }
    fetchAddLesson = (values) => {
        values.courseId = this.props.data.id;
        this.setState({ loading: true, loginMessage: '' });
        fetch('/v1/lesson', {
            method: 'POST',
            mode: 'cors', // 避免cors攻击
            credentials: 'include',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json;charset=UTF-8' },
            body: JSON.stringify(values)
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
    handleCancle = () => {
        this.setState({ visible: false }, () => {
            setTimeout(() => { this.props.close(); }, 500);
        });
    }
    render () {
        return (
            <div id="C_Page_PublishLesson">
                <Modal title="新课程发布" visible={this.state.visible}
                    onOk={this.close} onCancel={this.handleCancle}
                    footer={null}>
                    <Wrapped_PublishLesson_Form cancel={this.handleCancle} submit={this.submit}/>
                </Modal>
            </div>
        );
    }
}
export default C_Page_PublishLesson;
