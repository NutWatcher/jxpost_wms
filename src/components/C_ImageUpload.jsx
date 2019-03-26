import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';
import Moment from 'moment';
import './C_ImageUpload.less';
class C_ImageUpload extends React.Component {
    state = {
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
                if (item.response) {
                    item.url = item.response.split('<Location>')[1].split('</Location>')[0];
                }
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
    render () {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">上传</div>
            </div>
        );
        const action = this.props.action || '//jsonplaceholder.typicode.com/posts/';
        return (
            <div className="clearfix">
                <Upload
                    action={action}
                    accept="image/png, image/jpeg"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    beforeUpload={this.beforeUpload}
                    data={this.beforeUploadData}
                >
                    {fileList.length >= (this.props.fileMax || 3) ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
export default C_ImageUpload;
