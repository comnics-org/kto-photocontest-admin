import React, { useEffect, useState } from "react"
import { connect } from 'react-redux'
import { withRouter, Link } from "react-router-dom"
import axios from "axios";

import { Menu, Typography, Button } from "antd"
const { Title } = Typography

function HeaderBasic(props) {
    const [username, setUsername] = useState('')
    const [authenticated, setAuthenticated] = useState(false)

    useEffect(() => {
        setAuthenticated(props.user.userData?props.user.userData.isAuth:false);
        setUsername(props.user.userData?props.user.userData.name:'')
    }, [props]);

    const onClickHandler = (event) => {
        axios.get("/api/users/logout").then((response) => {
            if (response.data.success) {
                props.history.push("/login");
            } else {
                alert("로그아웃에 실패했습니다.");
            }
        });
    };

    let selectedKeys = [];
    if(props.location.pathname === '/' || props.location.pathname === '') selectedKeys.push("1");
    if(props.location.pathname === '/photo/list') selectedKeys.push("2");
    if(props.location.pathname === '/photo/upload') selectedKeys.push("3");

    return (
        <div id="header">
            <div className="logo">
                <Title level={2}>Admin</Title>
            </div>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selectedKeys}>
                <Menu.Item key="1"><Link to="/">Dashboard</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/photo/list">Photo List</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/photo/upload">Photo Upload</Link></Menu.Item>
            </Menu>
            <div className="login-info">
                {authenticated ? (
                    <div><span>{username}</span><Button type="text" onClick={onClickHandler}>로그아웃</Button></div>
                ) : (
                    <Link to="/login">
                        <Button type="text">로그인</Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {user: state.user}
}
const mapDispatchToProps = {  } 
export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(withRouter(HeaderBasic));
