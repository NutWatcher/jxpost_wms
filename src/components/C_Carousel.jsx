import React from 'react';
import { Carousel, Icon } from 'antd';
import './C_Carousel.less';
class C_Carousel extends React.Component {
    handlePrev = () => {
        this.refs.carousel.prev();
    }
    handleNext = () => {
        this.refs.carousel.next();
    }
    render () {
        return (
            <div id="C_Carousel">
                <Icon className="prev" type="left" theme="outlined" style={{ fontSize: '30px' }} onClick={this.handlePrev} />
                <Carousel ref='carousel'>
                    {
                        this.props.imageList.map((item, key) => {
                            return <div key={key}><img src={item.url} /></div>;
                        })
                    }
                </Carousel>
                <Icon className="next" type="right" theme="outlined" style={{ fontSize: '30px' }} onClick={this.handleNext} />
            </div>
        );
    }
}
export default C_Carousel;
