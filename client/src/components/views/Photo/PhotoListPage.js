import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import { message, List, Card, Spin, Alert, Button, Row, Col } from "antd";

function PhotoListPage(props) {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [offset, setOffset] = useState(0);
    const [photos, setPhotos] = useState([]);
    const PAGE_LIMIT = 9;

    const ADMIN_PHOTO_URL = 'http://localhost:5000/api/photos/thumb';

    async function getPhotoList() {
        return new Promise(async (resolve, reject) => {
            const res = await axios.get(`/api/photos?offset=${offset}&limit=${PAGE_LIMIT}`);
            resolve(res.data.photos);
        });
    }

    async function deletePhoto(shortcode) {
        return new Promise(async (resolve, reject) => {
            const res = await axios.put(`/api/photos/delete?shortcode=${shortcode}`);
            resolve(res);
        });
    }

    const fetchPhotos = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
            const newPhotos = await getPhotoList();
            setPhotos([...photos, ...newPhotos]);
            setOffset(offset+PAGE_LIMIT);
        } catch (error) {
            setIsError(true);
            setIsLoading(false);
        }
        setIsLoading(false);
    };
    //getPhotoList();

    useEffect(() => {
        //console.log('=== useEffect ===');
        // const fetchPhotos = async () => {
        //     setIsError(false);
        //     setIsLoading(true);
        //     try {
        //         const newPhotos = await getPhotoList();
        //         setPhotos([...photos, ...newPhotos]);
        //         setOffset(offset+PAGE_LIMIT);
        //     } catch (error) {
        //         setIsError(true);
        //         setIsLoading(false);
        //     }
        //     setIsLoading(false);
        // };

        fetchPhotos();
    }, []);

    const moreBtnClickHandler = () => {
        console.log("moreBtnClickHandler");
        setOffset(offset + PAGE_LIMIT);
        fetchPhotos();
    }

    function deleteBtnClickHandler(e, shortcode) {
        e.preventDefault();
        console.log(shortcode);
        // if(confirm('정말 삭제 하시겠습니까?'))
        deletePhoto(shortcode)
        .then((res) => {
            message.success('정상적으로 삭제 되었습니다.');
            setPhotos(photos.filter((photo) => photo.shortcode !== shortcode));
        });
    }

    return (
        <>
            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={photos}
                renderItem={(item) => (
                    <List.Item>
                        <Card title={item.title}>
                            {item.kind === "K" ? "KTO Uploaded Image" : "Insta Image"}
                            {item.kind === "K" ? <img src={`${ADMIN_PHOTO_URL}/${item.thumbnail_src}`} width="100%" /> : <img src={item.thumbnail_src} width="100%" />}
                            <div style={{paddingTop: '5px', textAlign: 'right'}}>
                                <Button type="primary" danger onClick={(e) => deleteBtnClickHandler(e, item.shortcode)}>삭제</Button>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
            {isLoading === true ? (
                <Spin tip="Loading...">
                    <Alert message="Photos Loading" description="사진을 가져오는 중입니다." type="info" />
                </Spin>
            ) : (
                ""
            )}

            <Row justify="space-around" align="middle">
                <Col span={5}>
                    <Button type="primary" shape="round" size="large" style={{ width: "100%" }} onClick={moreBtnClickHandler}>
                        More...
                    </Button>
                </Col>
            </Row>
        </>
    );
}

const mapStateToProps = (state /*, ownProps*/) => {
    return { user: state.user };
};
const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PhotoListPage));
