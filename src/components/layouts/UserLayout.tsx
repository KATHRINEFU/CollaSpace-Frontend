import "../../muse.main.css";
import "../../muse.responsive.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Menu,
  Button,
  // Badge,
  ConfigProvider,
  Spin,
  Avatar,
  notification
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  // BellOutlined,
  LogoutOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import ErrorBoundary from "../ErrorBoundary";
import { Outlet } from "react-router-dom";
import LogoIcon from "/logoIcon.png";
import type { MenuProps } from "antd";
import { useGetEmployeeTeamsQuery, useGetEmployeeDetailQuery } from "../../redux/user/userApiSlice";
import { logOut } from "../../redux/auth/authSlice";
import {useUser} from "../../hooks/useUser"
import { useEffect, useState } from "react";
import { mapDataToEmployee } from "../../utils/functions";
import { IEmployee } from "../../types";
import { useAppDispatch } from "../../redux/hooks";

export default function UserLayout() {
  const user = useUser();
  const {data:employeeData, isLoading: isEmployeeDataLoading} = useGetEmployeeDetailQuery(user?.id);
  const [curEmployee, setCurEmployee] = useState<IEmployee>();

  const dispatch = useAppDispatch();
  let { pathname } = useLocation();
  pathname = pathname.split("/")[2];
  const navigate = useNavigate();
  // console.log("current user id: ", user?.id);
  const { data: teams, isLoading } = useGetEmployeeTeamsQuery(user?.id);
  // console.log(teams);
  // const [myDepartment, setMyDepartment] = useState<ITeam>();
  // const [myTeams, setMyTeams] = useState<ITeam[]>([]);

  const teamItems = teams?.map((team: any, index: number) =>
    getItem(team.teamName, `${index + 6}`, undefined, undefined, team.teamId),
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
  };

  type MenuItem = Required<MenuProps>["items"][number];
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    teamId?: number,
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
        // case "6":
        //   navigate(`/user/department/${myDepartment?.teamId}`);
        //   break;
        default:
          break;
      }
      if (teamId) {
        // If teamName is provided, navigate to the team-specific route
        navigate(`/user/team/${teamId}`);
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
    ]),
    getItem("My Teams", "sub2", <TeamOutlined />, teamItems),
  ];

  useEffect(() => {
    if(!isEmployeeDataLoading && employeeData){
      setCurEmployee(mapDataToEmployee(employeeData));
    }
  }, [employeeData, isEmployeeDataLoading])

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
                defaultOpenKeys={["sub1"]}
                items={sideBarMenuItem}
                overflowedIndicator={<EllipsisOutlined />}
                inlineCollapsed={true}
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
                  {isEmployeeDataLoading ? (
                    <div className="spinner-container">
                    <Spin size="large" />
                  </div>
                  ): (
                    <h2 className="text-xl font-bold ml-6 ">
                      Good Day! {curEmployee?.firstName} {curEmployee?.lastName}
                    </h2>
                  )}
                <div className="w-50 flex items-center gap-1">
                  <div
                    className="flex items-center justify-center gap-2 mr-6 cursor-pointer"
                    onClick={handleProfileBtnClicked}
                  >
                    {curEmployee?.profileUrl ? (
                      <Avatar
                      src={
                        <img
                          src={
                            curEmployee.profileUrl
                          }
                          alt="Profile"
                        />
                      }
                    />
                    ) : (
                      <Avatar
                      src={
                        <img
                          src={
                            "https://cdn-icons-png.flaticon.com/512/188/188987.png"
                          }
                          alt="Profile"
                        />
                      }
                    />
                    )}
                    
                    <span className="text-black">{curEmployee?.firstName} {curEmployee?.lastName}</span>
                  </div>

                  {/* <Badge count={5}>
                    <Button
                      type="primary"
                      shape="circle"
                      size="small"
                      icon={<BellOutlined />}
                      style={{ width: "42px" }}
                      className="mr-3"
                    />
                  </Badge> */}

                  <Button
                    type="primary"
                    shape="circle"
                    size="small"
                    icon={<LogoutOutlined />}
                    style={{ width: "42px" }}
                    className="mr-3"
                    onClick={() => {
                      dispatch(logOut());
                      notification.success({
                        message: "Logout successfully",
                      });
                      navigate("/login");
                    }}
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
