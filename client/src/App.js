import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Auth from "./hoc/auth";

import LandingPage from "./components/views/LandingPage/LandingPage"
import LoginPage from "./components/views/LoginPage/LoginPage"
import RegisterPage from "./components/views/RegisterPage/RegisterPage"
import PhotoListPage from './components/views/Photo/PhotoListPage'
import PhotoUploadPage from './components/views/Photo/PhotoUploadPage'

import { Layout, Breadcrumb, Typography } from "antd";

import HeaderBasic from './components/views/Header/HeaderBasic'

const { Text, Link } = Typography;
const { Header, Footer, Content } = Layout;

function App() {
    return (
        <Router>
            <Layout className="layout">
                <Header className="header">
                    <HeaderBasic />
                </Header>
                <Content style={{ padding: "0 50px" }}>
                    <Breadcrumb style={{ margin: "16px 0" }}>
                        <Breadcrumb.Item>Admin</Breadcrumb.Item>
                        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-content">
                        <Switch>
                            <Route exact path="/" component={Auth(LandingPage, null)} />
                            <Route exact path="/login" component={Auth(LoginPage, false)} />
                            <Route exact path="/register" component={Auth(RegisterPage, false)} />
                            <Route exact path="/photo/list" component={Auth(PhotoListPage, true)} />
                            <Route exact path="/photo/upload" component={Auth(PhotoUploadPage, true)} />
                        </Switch>
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    <Text>Copyright KTO 2020.</Text>
                    <Link href="http://#" target="_blank" style={{marginLeft: '10px'}}>
                        Front
                    </Link>
                </Footer>
            </Layout>
        </Router>
    );
}

export default App;
