import React from 'react';
import { Layout, Menu, Icon, Row, Col, Typography } from 'antd';
import { BrowserRouter, HashRouter, Route, Link } from 'react-router-dom';
import { MyRouter } from '../router.jsx';
import './main.less';
import Header_User from '../components/header_user.jsx';
const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
class Layout_Main extends React.Component {
    state = {
        collapsed: false
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }
    changePage = ({ item, key, keyPath }) => {
        // console.log(item);
        // console.log(key);
        // console.log(keyPath);
    }
    render () {
        return (
            <HashRouter>
                <Layout id="Layout_Main">
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                        breakpoint="lg"
                        width="250"
                        collapsedWidth="80"
                        onBreakpoint={(broken) => { console.log(broken); }}
                        onCollapse={(collapsed, type) => { console.log(collapsed, type); }}
                    >
                        <Row className="warp_logo" type="flex" justify="center" align="middle">
                            <Col span={24} className="logo"><Title level={4}>{'仓库管理后台'}</Title></Col>
                        </Row>
                        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={this.changePage}>
                            <Menu.Item key="1">
                                <Link to="/">
                                    <span>
                                        <Icon type="user" />
                                        <span className="nav-text">仪表盘</span>
                                    </span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/saveStuff">
                                    <span>
                                        <Icon type="video-camera" />
                                        <span className="nav-text">入库管理</span>
                                    </span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <Link to="/sellStuff">
                                    <span>
                                        <Icon type="video-camera" />
                                        <span className="nav-text">出库管理</span>
                                    </span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <Link to="/addStuff">
                                    <span>
                                        <Icon type="user" />
                                        <span className="nav-text">物料管理</span>
                                    </span>
                                </Link>

                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: '#fff', padding: 0 }}>
                            {/* <Icon
                                className="trigger"
                                type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            /> */}
                            <div className="fr nav_wrap">
                                {/* <Icon className="nav_item" type="smile" theme="twoTone" /> */}
                                <Header_User userName="管理员"/>
                            </div>
                        </Header>
                        <Content style={{}}>
                            <MyRouter />
                        </Content>
                        <Footer style={{ textAlign: 'center' }}>仓库管理平台 ©2019 Created by 嘉兴市分公司</Footer>
                    </Layout>
                </Layout>
            </HashRouter>
        );
    }
}
export { Layout_Main };
