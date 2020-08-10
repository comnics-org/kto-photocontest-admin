import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";

import { PageHeader } from "antd";
import { connect } from 'react-redux'

function LandingPage(props) {

    useEffect(() => {
    });

    return (
        <PageHeader className="site-page-header" title="Dashboard" subTitle="This is a subtitle">
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "65vh",
                }}
            >
                <div>
                    <h2>Dashboard</h2>
                </div>
            </div>
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