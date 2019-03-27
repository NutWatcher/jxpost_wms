import React from 'react';
import { Tabs, Icon, Button, message, Tag, Typography, Modal, Col, Row, Form, Input, Card } from 'antd';
import U_Fetch from '../../utils/fetchFilter';
import './TabPane_Stuff.less';
class TabPane_Stuff extends React.Component {
    state = {
        markerPosition: {}
    };
    handleSubmit = (e) => {

    }
    componentDidMount () {
    }
    render () {
        return (
            <div id="TabPane_ShopAddress">
                <div className='content'>
                    <div className='map'>
                        <Map amapkey={'9621eeb601b439135ea21e377c371052'} zoom={14} events={this.amapEvents}>
                            {
                                this.state.markerPosition.longitude ? <Marker position={this.state.markerPosition} /> : null
                            }

                        </Map>
                    </div>
                </div>
            </div>
        );
    }
}
export default TabPane_Stuff;