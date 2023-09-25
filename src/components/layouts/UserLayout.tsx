import "../../muse.main.css";
import "../../muse.responsive.css";
import { useLocation } from "react-router-dom";
import { Layout, Menu, Breadcrumb } from "antd";
import { INav } from "../../types";
import {HomeOutlined, TeamOutlined} from "@ant-design/icons"
import ErrorBoundary from "../ErrorBoundary";
import { Outlet } from "react-router-dom";
import LogoIcon from "/logoIcon.png";

export default function UserLayout() {
  let { pathname } = useLocation();
  pathname = pathname.split("/")[2];

  const { Header, Content, Footer, Sider } = Layout;

  const navItems: INav[] = [
    {
        'name':'My Space',
        'path': '/user/dashboard',
        'icon': <HomeOutlined />
    },
    {
        'name':'My Teams',
        'path': '/user/teams',
        'icon': <TeamOutlined/>
    },
  ]

  return (
    <>
      <Layout>
        <div className="bg-white m-3 rounded-lg">
            <Sider
                className="rounded-lg"
                width={250}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    console.log(collapsed, type);
                }}
                style={{background: "#243A73"}}
            >
                <div className="demo-logo-vertical" />
                <div className="ml-3 mr-6 mt-3 mb-3 flex items-center justify-between">
                    <img src={LogoIcon} alt="Logo Icon" style={{width: '60px'}}/>
                    <span className="text-white text-xl">CollaSpace</span>
                </div>
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={navItems.map((item, index) => ({
                        key: String(index + 1),
                        icon: item.icon,
                        label: item.name,
                        }),
                    )}
                />

            </Sider>
        </div>
      

      <Layout style={{width: '80%'}}>
        <Header className="rounded-lg" style={{margin: '16px 16px 0', padding: 0, background: "#F2EBE9"}} />
          <Breadcrumb style={{ margin: '24px 16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="rounded-lg" style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}>content</div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>CollaSpace ©2023</Footer>
      </Layout>

      <Content className="content-ant">
        <ErrorBoundary>
            <Outlet />
        </ErrorBoundary>
      </Content>
    </Layout>
    </>
  );
}
