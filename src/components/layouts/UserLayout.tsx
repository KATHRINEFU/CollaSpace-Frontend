import "../../muse.main.css";
import "../../muse.responsive.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu, Button, Badge, ConfigProvider, Spin, Avatar } from "antd";
import { HomeOutlined, TeamOutlined, BellOutlined, LogoutOutlined } from "@ant-design/icons";
import ErrorBoundary from "../ErrorBoundary";
import { Outlet } from "react-router-dom";
import LogoIcon from "/logoIcon.png";
import type { MenuProps } from "antd";
import { useGetEmployeeTeamsQuery } from "../../redux/api/apiSlice";

export default function UserLayout() {
  let { pathname } = useLocation();
  pathname = pathname.split("/")[2];
  const navigate = useNavigate();
  const { data: teams, isLoading } = useGetEmployeeTeamsQuery(4);

  const teamNames: string[] = teams?.map((team: any) => team.teamName) || [];
  const teamItems = teamNames.map((teamName, index) =>
    getItem(teamName, `${index + 6}`),
  );

  const { Header, Content, Footer, Sider } = Layout;

  const handleCreateEventBtnClicked = () => {
    navigate("/user/create-event");
  };

  const handleCreateTicketBtnClicked = () => {
    navigate("/user/create-ticket");
  };

  const handleCreateTeamBtnClicked = () => {
    navigate("/user/create-team");
  };

  const handleMyCalendarBtnClicked = () => {
    navigate("/user/calendar");
  };

  const handleProfileBtnClicked = () => {
    navigate("/user/profile");
  }

  type MenuItem = Required<MenuProps>["items"][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
  ): MenuItem {
    const onClick = () => {
      switch (key) {
        case "1":
          navigate("/user/dashboard");
          break;
        case "2":
          navigate("/user/events");
          break;
        case "3":
          navigate("/user/tickets");
          break;
        case "4":
          navigate("/user/calendar");
          break;
        default:
          break;
      }
    };

    return {
      key,
      icon,
      children,
      label,
      onClick,
    } as MenuItem;
  }

  const sideBarMenuItem: MenuItem[] = [
    getItem("My Space", "sub1", <HomeOutlined />, [
      getItem("Dashboard", "1"),
      getItem("Events", "2"),
      getItem("Tickets", "3"),
      getItem("Calendar", "4"),
      getItem("Report", "5"),
    ]),
    getItem("My Teams", "sub2", <TeamOutlined />, teamItems),
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
              style={{ background: "#243A73" }}
            >
              <div className="demo-logo-vertical" />
              <div className="ml-3 mr-6 mt-3 mb-3 flex items-center justify-between">
                <img src={LogoIcon} alt="Logo Icon" style={{ width: "60px" }} />
                <span className="text-white text-xl">CollaSpace</span>
              </div>
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                items={sideBarMenuItem}
              >
                {isLoading ? (
                  <div className="spinner-container">
                    <Spin size="large" />
                  </div>
                ) : null}
              </Menu>
            </Sider>
          </div>

          <Layout style={{ width: "80%" }}>
            <Header
              className="rounded-lg"
              style={{
                margin: "16px 16px 0",
                padding: 0,
                background: "#F2EBE9",
                height: "120px",
              }}
            >
              <div className="flex items-center justify-between mr-24 w-full">
                <h2 className="text-xl font-bold ml-6 ">
                  {" "}
                  Good Morning! Yuehao
                </h2>
                <div className="w-50 flex items-center gap-1">
                  <div 
                    className="flex items-center justify-center gap-2 mr-6 cursor-pointer"
                    onClick={handleProfileBtnClicked}
                    >
                    <Avatar src={<img src={"https://cdn-icons-png.flaticon.com/512/188/188987.png"} alt="Profile" />} />
                    <span className="text-black">Yuehao Fu</span>
                  </div>
                  

                  <Badge count={5}>
                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      icon={<BellOutlined />}
                      style={{ width: "42px" }}
                      className="mr-3"
                    />
                  </Badge>

                  <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      icon={<LogoutOutlined />}
                      style={{ width: "42px" }}
                      className="mr-3"
                    />

                </div>
              </div>

              <div className="w-full ml-6 flex items-center gap-6">
                <Button
                  type="primary"
                  onClick={handleCreateEventBtnClicked}
                  style={{ width: "140px" }}
                >
                  Create Event
                </Button>
                <Button
                  type="primary"
                  onClick={handleCreateTicketBtnClicked}
                  style={{ width: "140px" }}
                >
                  Create Ticket
                </Button>
                <Button
                  type="primary"
                  onClick={handleCreateTeamBtnClicked}
                  style={{ width: "140px" }}
                >
                  Create Team
                </Button>
                <Button
                  type="primary"
                  onClick={handleMyCalendarBtnClicked}
                  style={{ width: "140px" }}
                >
                  My Calendar
                </Button>
                <Button type="primary" style={{ width: "140px" }}>
                  My Report
                </Button>
              </div>
            </Header>

            <Content className="content-ant">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </Content>
            <Footer style={{ textAlign: "center" }}>CollaSpace ©2023</Footer>
          </Layout>
        </Layout>
      </ConfigProvider>
    </>
  );
}
