import React from 'react';
import { Layout, Icon, Typography, Form, Input, Button, Alert } from 'antd';
import './login.less';
const { Title } = Typography;
const { Header, Content, Footer } = Layout;

class Layout_Login extends React.Component {
    state = {
        loading: false,
        loginMessage: ''
    };

    login = (values) => {
        this.setState({ loading: true, loginMessage: '' });
        let params = encodeURI(`?userName=${values.userName}&password=${values.password}`);
        fetch('/v1/auth' + params)
            .then((response) => {
                if (response.status === 302) {
                } else if (response.status === 200) {
                    return response.json();
                } else {
                    this.setState({ loading: false, loginMessage: '登录失败!' });
                }
            })
            .then((resonseData) => {
                if (resonseData.code !== 2000) {
                    this.setState({ loading: false, loginMessage: resonseData.msg || '登录失败!' });
                } else {
                    window.location.href = resonseData.redirect;
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false, loginMessage: '登录失败!' });
            });
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.login(values);
            }
        });
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <Layout id="Layout_Login">
                <Header></Header>
                <Content>
                    <div className="top">
                        <Title level={2}>机构后台管理系统</Title>
                    </div>
                    <div className="main">
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <Form.Item>
                                {getFieldDecorator('userName', {
                                    rules: [{ required: true, message: '请输入用户名!' }]
                                })(
                                    <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码!' }]
                                })(
                                    <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button loading={this.state.loading} size="large" type="primary" htmlType="submit" className="login-form-button">登录</Button>
                            </Form.Item>
                            {
                                this.state.loginMessage === '' ? null
                                    : <Alert message={this.state.loginMessage} type="error" />
                            }
                        </Form>
                    </div>
                </Content>
                <Footer></Footer>
            </Layout>
        );
    }
}
const WrappedLayout_Login = Form.create({ name: 'normal_login' })(Layout_Login);

export { WrappedLayout_Login };
