import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import { PageHeader, Table, Button, Row, Col } from "antd";

import { connect } from 'react-redux'
import axios from "axios";

const PHOTO_DAILY_STATISTICS = 1;
const VOTE_DAILY_STATISTICS = 2;

const columns = [
    {
      title: 'Date',
      dataIndex: 'createDate',
    },
    {
      title: 'Count',
      dataIndex: 'cnt',
    }
];

var photoData = [{
    date: '2020-08-01',
    cnt: 100
}];
var totalPhotoCount = 0;

var voteData = [{
    date: '2020-08-02',
    cnt: 100
}];
var totalVoteCount = 0;

var loading = false;

function LandingPage(props) {
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    useEffect(() => {
        getStatistics(PHOTO_DAILY_STATISTICS).then((data) => {
            //console.log(data);
        });
        
        getStatistics(VOTE_DAILY_STATISTICS).then((data) => {
            //console.log(data);
        });
    });

    const getStatistics = async (kind) => {
        return new Promise(async (resolve, reject) => {
            if(kind === PHOTO_DAILY_STATISTICS){
                const res = await axios.get(`/api/statistics/photo`);
                photoData = res.data.data;
                totalPhotoCount = photoData.reduce( (acc, cur, i) => {return acc+cur.cnt;}, 0);
                
                resolve(res.data.data);
            }else if(kind === VOTE_DAILY_STATISTICS){
                const res = await axios.get(`/api/statistics/vote`);
                voteData = res.data.data;
                totalVoteCount = voteData.reduce( (acc, cur, i) => {return acc+cur.cnt;}, 0);

                resolve(res.data.data);
            }
            reject('Not exist Kind.');
        });
    }

    return (
        <PageHeader className="site-page-header" title="Dashboard" subTitle="이벤트의 진행사항과 통계를 보여줍니다.">
                <Row>
                    <Col span={11}>
                        <div style={{ marginBottom: 16 }}>
                            <h3>- Photo Statistics : 일자별 사진 추가 통계(토탈: {totalPhotoCount}건)</h3>
                            <Button type="primary" onClick={() => getStatistics(PHOTO_DAILY_STATISTICS)} loading={loading}>
                                Reload
                            </Button>
                        </div>
                        <Table 
                            columns={columns} 
                            dataSource={photoData} 
                            size="small" />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <div style={{ marginBottom: 16 }}>
                            <h3>- Vote Statistics : 일자별 투표 통계(토탈: {totalVoteCount}건)</h3>
                            <Button type="primary" onClick={() => getStatistics(VOTE_DAILY_STATISTICS)} loading={loading}>
                                Reload
                            </Button>
                        </div>
                        <Table columns={columns} dataSource={voteData} size="small" />
                    </Col>
                </Row>
        
        </PageHeader>
    );
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {user: state.user}
}
const mapDispatchToProps = {  } 
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(LandingPage));