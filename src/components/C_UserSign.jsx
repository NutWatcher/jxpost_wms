import React from 'react';
import { Button, Input, Modal, Spin, Typography } from 'antd';
import Moment from 'moment';
import './C_UserSign.less';

const Search = Input.Search;
const { Text, Title } = Typography;
class C_UserSign extends React.Component {
    state = {
        isLoading: false,
        visible: true,
        name: '',
        course: '',
        signActive: false
    };
    searchSignCode = (v) => {
        console.log(v);
        console.log(this);
        this.setState({
            isLoading: true,
            name: '张哈哈',
            course: '新华书店是的房间里卫生费金额为冷风机',
            signActive: true
        });
    }
    componentWillReceiveProps (nextProps) {
        this.setState({ data: { ...nextProps.data } });
    }
    handleCancel = () => this.setState({ previewVisible: false })
    close = () => {
        this.setState({ visible: false }, () => {
            setTimeout(() => { this.props.close(); }, 500);
        });
    }
    render () {
        return (
            <div id="C_UserSign">
                <Modal title="用户上课签到" visible={this.state.visible}
                    width={400}
                    onOk={this.close} onCancel={this.close}
                    footer={null}>
                    <div className="M_UserSign_content_wrap" >
                        <div className="content_header">
                            <Search
                                placeholder="输入签到码"
                                enterButton="查询"
                                size="large"
                                onPressEnter={(e) => this.searchSignCode(e.target.value)}
                                onSearch={this.searchSignCode}
                            />
                        </div>
                        <div className="content_content">
                            {
                                this.state.isLoading
                                    ? <Spin size="large" /> : null
                            }
                            <Title>{this.state.name}</Title>
                            <Text>{this.state.course}</Text>
                        </div>
                        <div className="content_foot">
                            <Button size="large" loading={this.state.loading} disabled={!this.state.signActive}
                                type="primary" htmlType="submit" className="sign_button">确认签到</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
export default C_UserSign;
