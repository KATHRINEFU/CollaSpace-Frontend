import "../../muse.main.css";
import "../../muse.responsive.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Badge, Image, ConfigProvider } from "antd";
import {HomeOutlined, TeamOutlined, BellOutlined} from "@ant-design/icons"
import ErrorBoundary from "../ErrorBoundary";
import { Outlet } from "react-router-dom";
import LogoIcon from "/logoIcon.png";
import ProfileAvatar from "/profile-avatar.png";
import type { MenuProps } from 'antd';

export default function UserLayout() {
  let { pathname } = useLocation();
  pathname = pathname.split("/")[2];
  const navigate = useNavigate();

  const { Header, Content, Footer, Sider } = Layout;

  const handleCreateEventBtnClicked = () => {
    navigate("/user/create-event")
  }

  type MenuItem = Required<MenuProps>['items'][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  }

  const sideBarMenuItem: MenuItem[] = [
    getItem('My Space', 'sub1', <HomeOutlined />, [getItem('Events', '2'), getItem('Tickets', '3'), getItem('Calendar', '4'), getItem('Report', '5')]),
    getItem('My Teams', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
  ];

  return (
    <>
    <ConfigProvider
        theme={{
        token: {
            // Seed Token
            // colorPrimary: '#7C3E66',
        },
        }}
    >
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
                    items={sideBarMenuItem}
                />

            </Sider>
        </div>
      

      <Layout style={{width: '80%'}}>
        <Header className="rounded-lg" style={{margin: '16px 16px 0', padding: 0, background: "#F2EBE9", height: '120px'}} >
            <div className="flex items-center justify-between mr-24 w-full">
                <h2 className="text-xl font-bold ml-6 "> Good Morning! Yuehao</h2>
                <div className="w-50 flex items-center gap-3">
                    <Badge count={5}>
                        <Button
                            type="primary"
                            shape="circle"
                            size="small"
                            icon = {<BellOutlined />}
                            style={{width: '42px'}}
                            className="mr-3"
                        />
                    </Badge>

                    <div className="flex items-center justify-center gap-2 mr-6">
                        <Image src={ProfileAvatar} alt="Profile Avatar" width={50}/>
                        <span className="text-black">Yuehao Fu</span>
                    </div>
                </div>
              </div>

              <div className="w-full ml-6 flex items-center gap-6">
                <Button type="primary" onClick={handleCreateEventBtnClicked} style={{width: '140px'}}>Create Event</Button>
                <Button type="primary" style={{width: '140px'}}>Create Ticket</Button>
                <Button type="primary" style={{width: '140px'}}>Create Team</Button>
                <Button type="primary" style={{width: '140px'}}>My Calendar</Button>
                <Button type="primary" style={{width: '140px'}}>My Report</Button>
              </div>
            
        </Header>

        <Content className="content-ant">
            <ErrorBoundary>
                <Outlet />
            </ErrorBoundary>
        </Content>
        <Footer style={{ textAlign: 'center' }}>CollaSpace ©2023</Footer>
      </Layout>
    </Layout>
    </ConfigProvider>
    </>
  );
}
