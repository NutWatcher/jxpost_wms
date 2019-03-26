import React from 'react';
import { Card, Icon, Button, message, Tag, Typography, Modal, Col, Row } from 'antd';
import U_Fetch from '../utils/fetchFilter';
import { Map, Marker } from 'react-amap';
import C_UserSign from '../components/C_UserSign.jsx';
import './index.less';

const { Text, Title } = Typography;
const confirm = Modal.confirm;
class Index extends React.Component {
    state = {
        showUserSign: false
    };
    handleShowUserSign = () => {
        this.setState({ showUserSign: true });
    }
    handleCloseUserSign = () => {
        this.setState({ showUserSign: false });
    }
    componentDidMount () {
    }
    render () {
        return (
            <div id="Index">
                <div className='content'>
                    <Row gutter={16}>
                        <Col span={6}>
                            {
                                this.state.showUserSign
                                    ? <C_UserSign close={this.handleCloseUserSign} /> : null
                            }
                            <Card bordered={false} style={{ width: 300 }} className="card_userSign"
                                title={<Button size="large" type="primary" onClick={this.handleShowUserSign}className="card_userSign_header">用户签到</Button>} >
                                <Title className="card_userSign_content" level={2}>今日签到人数</Title>
                                <Title className="card_userSign_content" level={2}>12</Title>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card bordered={false} style={{ width: 300 }} className="card_userSign"
                                title={<Button size="large" onClick={this.handlePreStep} className="card_userSign_header">查看用户</Button>} >
                                <Title className="card_userSign_content" level={2}>今日预约人数</Title>
                                <Title className="card_userSign_content" level={2}>12</Title>
                            </Card>
                        </Col>
                        <Col span={8}>
                            {/* <Card title="Card title" bordered={false}>Card content</Card> */}
                        </Col>
                    </Row>

                </div>
            </div>
        );
    }
};
export default Index;
