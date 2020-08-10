import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

const uploadProps = {
    accept: ".jpg, .jpeg, .png, .gif",
    name: 'file',
    multiple: true,
    action: '/api/photos/upload',
    beforeUpload(file) {
        if (!/jpe?g|png$/.test(file.type)) {
            message.error('Photo format error');
            file.flag=true;
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Photo size more than limit(2M)');
            file.flag=true;
            return false;
        }
        return true;
    },    
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

function PhotoUploadPage(props) {
    return (
        <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">해상도와 용량을 체크 하시고 업로드 바랍니다.</p>
        </Dragger>
    );
}

const mapStateToProps = (state /*, ownProps*/) => {
    return { user: state.user };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PhotoUploadPage));
