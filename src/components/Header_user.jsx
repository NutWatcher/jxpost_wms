import React from 'react';
import { Menu, Dropdown, Avatar, Typography, Icon } from 'antd';

import './Header_User.less';
const { Text } = Typography;

class Header_User extends React.Component {
    state = {
        color: '#f56a00',
        collapsed: false,
        userName: this.props.userName
    };
    logout = () => {
        window.location.href = '/login.html';
    };
    render () {
        const menu = (
            <Menu>
                <Menu.Item key="0"><Icon className="" type="user" /><span>个人中心</span></Menu.Item>
                <Menu.Item key="1"><Icon className="" type="setting" /><span>个人设置</span></Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3" onClick={this.logout}><Icon className="" type="logout" /><span>退出登录</span></Menu.Item>
            </Menu>
        );
        return (
            <span id="Header_User">
                <Dropdown overlay={menu} placement="bottomRight">
                    <span><Avatar icon="user" style={{ backgroundColor: this.state.color, verticalAlign: 'middle', margin: '8px' }} size="large" />
                        <Text>{this.state.userName}</Text>
                    </span>
                </Dropdown>
            </span>
        );
    }
}
export default Header_User;
