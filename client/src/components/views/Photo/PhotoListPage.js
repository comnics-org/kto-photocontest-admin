import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import axios from "axios";

import { message, List, Card, Spin, Alert, Button, Row, Col } from "antd";

function PhotoListPage(props) {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [offset, setOffset] = useState(0);
    const [orderby, setOrderby] = useState('createdAt');
    const [orderbyOrder, setOrderbyOrder] = useState('desc');

    const [photos, setPhotos] = useState([]);

    const PAGE_LIMIT = 9;

    const ADMIN_PHOTO_URL = 'http://localhost:5000/api/photos/thumb';

    async function getPhotoList(pOffset, pLimit, pOrderby, pOrderbyOrder) {
        return new Promise(async (resolve, reject) => {
            const res = await axios.get(`/api/photos?offset=${pOffset}&limit=${pLimit}&orderby=${pOrderby}&orderbyorder=${pOrderbyOrder}`);
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
            const newPhotos = await getPhotoList(offset, PAGE_LIMIT, orderby, orderbyOrder);
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

    const orderbyHandler = async (newOrderby) => {
        var newOrderbyOrder = ''
        if(orderby === newOrderby){
            newOrderbyOrder = orderbyOrder === 'desc'?'asc':'desc'
        }else{
            setOrderby(newOrderby);
            newOrderbyOrder = 'desc';
        }
        setOrderbyOrder(newOrderbyOrder);

        const newPhotos = await getPhotoList(0, PAGE_LIMIT, newOrderby, newOrderbyOrder);
        setOffset(PAGE_LIMIT);
        setPhotos([...newPhotos]);
    }

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
                            <div style={{paddingTop: '5px', paddingBottom: '5px', textAlign: 'right'}}>
                                <Button type="primary" onClick={() => orderbyHandler('createdAt')}>날짜순</Button> &nbsp;
                                <Button type="primary" onClick={() => orderbyHandler('like_count')}>좋아요순</Button>
                            </div>

            <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={photos}
                renderItem={(item) => (
                    <List.Item>
                        <Card title={item.title}>
                            {item.kind === "K" ? "KTO Uploaded Image" : "Insta Image"}
                            {item.kind === "K" ? <img src={`${ADMIN_PHOTO_URL}/${item.thumbnail_src}`} width="100%" /> : <img src={item.thumbnail_src} width="100%" />}
                            <div style={{paddingTop: '5px', textAlign: 'right'}}>
                                Like: {item.like_count} <Button type="primary" danger onClick={(e) => deleteBtnClickHandler(e, item.shortcode)}>삭제</Button>
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
