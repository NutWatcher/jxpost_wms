import React from 'react';
import { Button, Icon, Modal, message } from 'antd';
import Moment from 'moment';
import C_Carousel from '../C_Carousel.jsx';
import './C_PreviewCourseInfo.less';
class C_PreviewCourseInfo extends React.Component {
    state = {
        visible: true,
        data: this.props.data,
        previewVisible: false,
        previewImage: '',
        fileList: this.props.fileList
    };
    componentWillReceiveProps (nextProps) {
        this.setState({ data: { ...nextProps.data } });
    }
    handleCancel = () => this.setState({ previewVisible: false })
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        });
    }
    handleChange = ({ fileList }) => {
        console.log(fileList);
        let successList = [];
        fileList.forEach((item, index) => {
            if (item.status === 'done') {
                item.url = item.response.split('<Location>')[1].split('</Location>')[0];
                item.thumbUrl = item.url;
                successList.push({
                    uid: item.uid,
                    name: item.name,
                    status: 'done',
                    url: item.url,
                    thumbUrl: item.url
                });
            } else {
                item.status = 'error';
            }
            return item;
        });
        if (this.props.changeFileList) {
            this.props.changeFileList(successList);
        }
        this.setState({ fileList });
    }
    beforeUploadData = (file) => {
        console.log(this.state.data);
        return {
            OSSAccessKeyId: this.state.data.OSSAccessKeyId,
            policy: this.state.data.policy,
            Signature: this.state.data.Signature,
            key: `${this.state.data.key}/${Moment().format('YYYYMMDDHmmss')}-${file.name}`,
            success_action_status: '201'
        };
    }
    beforeUpload = (file) => {
        const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
        if (!isJPG) {
            message.error('You can only upload png,jpeg file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小必须小于 5MB!');
            return false;
        }
        return true;
    }
    close = () => {
        this.setState({ visible: false }, () => {
            setTimeout(() => { this.props.close(); }, 500);
        });
    }
    render () {
        const { data } = this.props;
        console.log(data);
        const content = JSON.parse(data.content);
        const classificationList = data.classificationList;
        const contentInfoList = content.infoFileList;
        const contentBannerList = content.bannerFileList;
        let contentBannerImageList = [];
        contentBannerList.forEach((item) => contentBannerImageList.push(item.url));
        return (
            <div id="C_PreviewCourseInfo">
                <Modal title="课程内容预览" visible={this.state.visible}
                    onOk={this.close} onCancel={this.close}
                    footer={[
                        <Button key="submit" type="primary" onClick={this.close}>
                          确定
                        </Button>
                    ]}>
                    <C_Carousel imageList={contentBannerList} />
                    <div className="content_wrap" >
                        <div className="content_header">
                            <div className="content_title">{data.title}</div>
                            <div className="content_introduction">{data.introduction}</div>
                            <div className="content_classificationList">
                                {
                                    classificationList.map((item, key) => {
                                        return <span key={key}>{item.name}</span>;
                                    })
                                }
                            </div>
                            <div className="content_introduction">{'上课时间： 课程内容预览不支持'}</div>
                            <div className="content_introduction">{'上课地点： 课程内容预览不支持'}</div>
                        </div>
                        {
                            contentInfoList.map((item, index) => { return <img key={index} src={item.url}></img>; })
                        }
                    </div>
                </Modal>
            </div>
        );
    }
}
export default C_PreviewCourseInfo;
