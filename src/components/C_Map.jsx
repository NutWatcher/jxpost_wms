import React from 'react';
import { Menu, Dropdown, Avatar, Typography, Icon } from 'antd';
import { Map, Marker } from 'react-amap';
import './C_Map.less';
const { Text } = Typography;

class C_Map extends React.Component {
    constructor () {
        super();
        this.amapEvents = {
            created: (mapInstance) => {
                console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
                console.log(mapInstance.getZoom());
                // var placeSearch = new AMap.PlaceSearch(); // 构造地点查询类
                // var infoWindow = new AMap.AdvancedInfoWindow({});
                // mapInstance.on('hotspotclick', (result) => {
                //     console.log(result);
                // });
                mapInstance.on('click', (result) => {
                    this.setState({ markerPosition: { longitude: result.lnglat.lng, latitude: result.lnglat.lat } });
                    this.props.onSelectLngLat(`${result.lnglat.lng},${result.lnglat.lat}`);
                    console.log(result);
                });
            }
        };
    }
    state = {
        markerPosition: {}
    };
    render () {
        return (
            <div id="C_Map">
                <Map amapkey={'9621eeb601b439135ea21e377c371052'} zoom={14} events={this.amapEvents}>
                    {
                        this.state.markerPosition.longitude ? <Marker position={this.state.markerPosition} /> : null
                    }

                </Map>
            </div>
        );
    }
}
export default C_Map;
