import "../../muse.main.css";
import "../../muse.responsive.css";
import { useParams } from "react-router-dom";
import {
  Layout,
  Card,
  Button,
  Spin,
  Modal,
  Select,
  TreeSelect,
  Image,
  List,
  Divider,
  Typography,
  Avatar,
  Form,
  Input,
  notification,
  // Skeleton,
  // Divider
} from "antd";
import {
  useGetDepartmentAccountsQuery,
  useGetEmployeeDetailQuery,
  useGetTeamAnnouncementInSevenDaysQuery,
  useGetTeamMembersQuery,
} from "../../redux/user/userApiSlice";
import { useEffect, useState } from "react";
import {
  IAccount,
  IAnnouncement,
  ITeam,
  ITeamMember,
  ITicket,
  ITicketAssign,
  ITicketLog,
} from "../../types";
import {
  FilterOutlined,
  NotificationOutlined,
  AppstoreOutlined,
  TeamOutlined,
} from "@ant-design/icons";
// import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import ClientList from "../../components/user/ClientList";
import { clientStatusByDepartment } from "../../utils/constants";
import { getFormattedDate, mapDataToTeam } from "../../utils/functions";
import { mapDataToEmployee, mapDataToTeamMember } from "../../utils/functions";
import InviteTeamMember from "../../components/user/InviteMember";
import ClientDetail from "../../components/user/ClientDetail";
import EventList from "../../components/user/EventList";
import TicketAssignedList from "../../components/user/TicketAssignedList";
import {
  useGetTicketsByTeamQuery,
  useGetTeamQuery,
  useGetTeamAccountsQuery,
} from "../../redux/user/userApiSlice";
import InviteClient from "../../components/user/InviteClient";
import { useUser } from "../../hooks/useUser";

function TeamDashboard() {
  const user = useUser();
  const { teamId } = useParams();
  const { data: curEmployee } = useGetEmployeeDetailQuery(user?.id);
  const { data: team, isLoading: isTeamLoading } = useGetTeamQuery(teamId);
  const { data: accounts, isLoading: isAccountsLoading } =
    Number(teamId) <= 4
      ? useGetDepartmentAccountsQuery(teamId)
      : useGetTeamAccountsQuery(teamId);
  const { data: announcements, isLoading: isAnnouncementsLoading } =
    useGetTeamAnnouncementInSevenDaysQuery(teamId);
  const { data: teamMembers, isLoading: isTeamMembersLoading } =
    useGetTeamMembersQuery(teamId);
  const { data: tickets, isLoading: isTicketsLoading } =
    useGetTicketsByTeamQuery(teamId);

  const [curTeam, setCurTeam] = useState<ITeam>();
  const [accountList, setAccountList] = useState<IAccount[]>([]);
  const [announcementList, setAnnouncementList] = useState<IAnnouncement[]>([]);
  const [teamMemberList, setTeamMemberList] = useState<ITeamMember[]>([]);
  const [ticketList, setTicketList] = useState<ITicket[]>([]);
  const [teamMemberOptions, setTeamMemberOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [, setError] = useState("");

  // const [value, setValue] = useState([]);
  const { Content } = Layout;
  const { Option } = Select;
  const { SHOW_PARENT } = TreeSelect;
  const { Text } = Typography;
  const [announcementForm] = Form.useForm();

  const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);

  const [isClientDetailModalVisible, setIsClientDetailModalVisible] =
    useState(false);
  const [isClientFilterModalVisible, setIsClientFilterModalVisible] =
    useState(false);
  const [isAddClientModalVisible, setIsAddClientModalVisible] = useState(false);
  const [
    isAnnouncementHistoryModalVisible,
    setIsAnnouncementHistoryModalVisible,
  ] = useState(false);
  const [isAnnouncementPostModalVisible, setIsAnnouncementPostModalVisible] =
    useState(false);
  const [isTeamMemberModalVisible, setIsTeamMemberModalVisible] =
    useState(false);
  const [isEventFilterModalVisible, setIsEventFilterModalVisible] =
    useState(false);
  const [isTicketFilterModalVisible, setIsTicketFilterModalVisible] =
    useState(false);

  const [clientFilterOptions, setClientFilterOptions] = useState<{
    type: string[];
    status: string[];
  }>({
    type: [],
    status: [],
  });

  const [eventFilterOptions, setEventFilterOptions] = useState({
    type: [],
    team: [],
  });

  const [ticketFilterOptions, setTicketFilterOptions] = useState({
    status: [],
    priority: [],
    teamMember: [],
  });

  const treeData = clientStatusByDepartment.map((departmentItem) => {
    return {
      title: departmentItem.department,
      value: departmentItem.department,
      key: departmentItem.department,
      children: departmentItem.processes.map((process) => ({
        title: process,
        value: process,
        key: process,
      })),
    };
  });

  const onChange = (newValue: string[]) => {
    setClientFilterOptions({ ...clientFilterOptions, status: newValue });
    // setValue(newValue);
  };

  const tProps = {
    treeData,
    value: clientFilterOptions.status,
    onChange,
    treeCheckable: true,
    showCheckedStrategy: SHOW_PARENT,
    placeholder: "Select current status",
    style: {
      width: "100%",
    },
  };

  const handleAddClientBtnClicked = () => {
    setIsAddClientModalVisible(true);
  };
  const handleAddClientModalOk = () => {
    setIsAddClientModalVisible(false);
  };

  const handleAddClientModalCancel = () => {
    setIsAddClientModalVisible(false);
  };

  const onPostNewAnnouncement = (values: any) => {
    const payload = {
      teamId: teamId,
      announcementCreator: user?.id,
      announcementContent: values.content,
    };

    axios
      .post("/api/team/announcement/create", payload)
      .then((r) => {
        if (!r.data) {
          setError("Failed to post announcement, please try again");
          return;
        }

        notification.success({
          type: "success",
          message: "Post announcement success",
        });
        setIsAnnouncementPostModalVisible(false);
        window.location.reload();
        // apiSlice.util.invalidateTags([{ type: 'Announcement', id: 'LIST' }]);
      })
      .catch(() => {
        setError("Failed to post announcement, please try again");
      });
  };

  const handlePostBtnClicked = () => {
    setIsAnnouncementPostModalVisible(true);
  };
  const handleAnnouncementPostModalOk = () => {
    setIsAnnouncementPostModalVisible(false);
  };

  const handleAnnouncementPostModalCancel = () => {
    setIsAnnouncementPostModalVisible(false);
  };

  const handleClientDetailModalOk = () => {
    setIsClientFilterModalVisible(false);
  };

  const handleOpenClientDetailModal = (account: IAccount) => {
    setSelectedAccount(account);
    setIsClientDetailModalVisible(true);
  };

  const showClientFilterModal = () => {
    setIsClientFilterModalVisible(true);
  };
  const handleClientFilterModalOk = () => {
    setIsClientFilterModalVisible(false);
  };

  const handleClientFilterModalCancel = () => {
    setIsClientFilterModalVisible(false);
  };

  const handleClientResetFilter = () => {
    setClientFilterOptions({
      type: [],
      status: [],
    });
  };

  const handleAnnouncementHistoryClicked = () => {
    setIsAnnouncementHistoryModalVisible(true);
  };

  const handleAnnouncementHistoryModalOk = () => {
    setIsAnnouncementHistoryModalVisible(false);
  };

  const handleAnnouncementHistoryModalCancel = () => {
    setIsAnnouncementHistoryModalVisible(false);
  };

  const handleManageTeamMemberClicked = () => {
    setIsTeamMemberModalVisible(true);
  };

  const handleTeamMemberModalOk = () => {
    setIsTeamMemberModalVisible(false);
  };

  const handleTeamMemberModalCancel = () => {
    setIsTeamMemberModalVisible(false);
  };

  const handleDeleteTeamMember = (id: number) => {
    const updatedList = teamMemberList.filter(
      (member) => member.employee.id !== id,
    );
    setTeamMemberList(updatedList);
  };

  const showEventFilterModal = () => {
    setIsEventFilterModalVisible(true);
  };

  const handleEventFilterModalOk = () => {
    // Apply filtering logic here based on filterOptions
    setIsEventFilterModalVisible(false);
  };

  const handleEventFilterModalCancel = () => {
    setIsEventFilterModalVisible(false);
  };

  const handleEventResetFilter = () => {
    setEventFilterOptions({
      type: [],
      team: [],
    });
  };

  const showTicketFilterModal = () => {
    setIsTicketFilterModalVisible(true);
  };

  const handleTicketFilterModalOk = () => {
    // Apply filtering logic here based on filterOptions
    setIsTicketFilterModalVisible(false);
  };

  const handleTicketFilterModalCancel = () => {
    setIsTicketFilterModalVisible(false);
  };

  const handleTicketResetFilter = () => {
    setTicketFilterOptions({
      status: [],
      priority: [],
      teamMember: [],
    });
  };

  // const loadMoreData = () => {
  //     if (loading) {
  //         return;
  //     }
  //     setLoading(true);
  //     fetch('https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo')
  //         .then((res) => res.json())
  //         .then(() => {
  //         setLoading(false);
  //         })
  //         .catch(() => {
  //         setLoading(false);
  //         });
  // };

  useEffect(() => {
    if (!isTeamLoading && team) {
      setCurTeam(mapDataToTeam(team));
    }
  }, [team, isTeamLoading]);

  useEffect(() => {
    if (accounts && !isAccountsLoading) {
      // setAccountList(accounts)
      const fetchCompanyInfo = async (companyId: number) => {
        try {
          const response = await axios.get("/api/client/" + companyId);
          return response.data;
        } catch (error) {
          console.error("Error fetching company info: ", error);
          return null;
        }
      };

      const fetchPersonnelInfo = async (personnelId: number) => {
        try {
          const response = await axios.get("/api/employee/" + personnelId);
          return response.data;
        } catch (error) {
          console.error("Error fetching personnel info: ", error);
          return null;
        }
      };
      const fetchAndSetAccount = async () => {
        // for each account, we have all fields except ICompany
        // fetch its company info by calling baseurl/client/{compantId}
        // set its company field with fetched company
        const accountsWithAdditionalData = await Promise.all(
          accounts.map(async (account: any) => {
            let updatedAccount = { ...account };

            if (account.companyId) {
              const companyInfo = await fetchCompanyInfo(account.companyId);
              if (companyInfo) {
                updatedAccount.accountCompany = companyInfo;
              }
            }

            if (account.biddingPersonnel) {
              const personnelInfo = await fetchPersonnelInfo(
                account.biddingPersonnel,
              );
              if (personnelInfo) {
                updatedAccount.biddingPersonnelEmployee =
                  mapDataToEmployee(personnelInfo);
              }
            }
            if (account.salesPersonnel) {
              const personnelInfo = await fetchPersonnelInfo(
                account.salesPersonnel,
              );
              if (personnelInfo) {
                updatedAccount.salesPersonnelEmployee =
                  mapDataToEmployee(personnelInfo);
              }
            }

            if (account.solutionArchitectPersonnel) {
              const personnelInfo = await fetchPersonnelInfo(
                account.solutionArchitectPersonnel,
              );
              if (personnelInfo) {
                updatedAccount.solutionArchitectPersonnelEmployee =
                  mapDataToEmployee(personnelInfo);
              }
            }

            if (account.customerSuccessPersonnel) {
              const personnelInfo = await fetchPersonnelInfo(
                account.customerSuccessPersonnel,
              );
              if (personnelInfo) {
                updatedAccount.customerSuccessPersonnelEmployee =
                  mapDataToEmployee(personnelInfo);
              }
            }
            return updatedAccount;
          }),
        );
        setAccountList(accountsWithAdditionalData);
      };
      console.log(accounts);
      fetchAndSetAccount();
    }
  }, [accounts, isAccountsLoading]);

  useEffect(() => {
    const baseUrl = "http://localhost:8080";
    if (!isAnnouncementsLoading && announcements) {
      const fetchAnnouncementCreatorName = async (id: number) => {
        try {
          const response = await axios.get(`${baseUrl}/employee/${id}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching announcement creator name: ", error);
          return null;
        }
      };

      // Convert and sort announcements by creation date (newest first)
      const updateAnnouncementList = async () => {
        const updatedAnnouncements = await Promise.all(
          announcements.map(async (announcement: any) => {
            const creatorInfo = await fetchAnnouncementCreatorName(
              announcement.announcementCreator,
            );

            return {
              id: announcement.announcementId,
              teamId: teamId,
              teamName: "",
              creatorId: announcement.announcementCreator,
              creatorName:
                creatorInfo.employeeFirstname +
                  " " +
                  creatorInfo.employeeLastname || "", // Assign the fetched creator name or an empty string
              creationDate: new Date(announcement.announcementCreationdate),
              content: announcement.announcementContent,
            };
          }),
        );

        // Sort announcements by creation date (newest first)
        const sortedAnnouncements = updatedAnnouncements.sort(
          (a: IAnnouncement, b: IAnnouncement) =>
            b.creationDate.getTime() - a.creationDate.getTime(),
        );

        setAnnouncementList(sortedAnnouncements);
      };

      updateAnnouncementList();
    }
  }, [announcements, isAnnouncementsLoading]);

  useEffect(() => {
    if (!isTeamMembersLoading && teamMembers) {
      const mappedTeamMembers = teamMembers.map((teamMember: any) =>
        mapDataToTeamMember(teamMember),
      );
      setTeamMemberList(mappedTeamMembers);
    }
  }, [teamMembers, isTeamMembersLoading]);

  useEffect(() => {
    const teamMembers = teamMemberList.map((member) => ({
      value: member.employee.id.toString(), // Assuming employee ID is a number
      label: `${member.employee.firstName} ${member.employee.lastName}`,
    }));

    setTeamMemberOptions(teamMembers);
  }, teamMemberList);

  useEffect(() => {
    if (!isTicketsLoading && tickets) {
      const mappedTickets = tickets.map((ticketData: any) => {
        const {
          ticketId,
          ticketCreator,
          ticketCreatorName,
          ticketCreationdate,
          ticketLastUpdatedate,
          ticketTitle,
          ticketDescription,
          ticketStatus,
          ticketPriority,
          ticketFromTeam,
          ticketDuedate,
          assigns,
          ticketLogs,
          files,
        } = ticketData;

        // Map assigns data into ITicketAssign objects
        const mappedAssigns: ITicketAssign[] = assigns.map(
          (assignData: any) => {
            const {
              ticketAssignId,
              employeeId,
              teamId,
              role,
              ticketAssigndate,
            } = assignData;

            return {
              ticketAssignId,
              employeeId,
              teamId,
              role,
              ticketAssigndate: new Date(ticketAssigndate),
            };
          },
        );

        const mappedTicketLogs: ITicketLog[] = ticketLogs.map(
          (logData: any) => {
            const {
              ticketLogId,
              ticketLogCreator,
              ticketLogCreationdate,
              ticketLogContent,
            } = logData;

            return {
              ticketLogId,
              ticketLogCreator,
              ticketLogCreationdate: new Date(ticketLogCreationdate),
              ticketLogContent,
            };
          },
        );

        return {
          ticketId,
          ticketCreator,
          ticketCreatorName,
          ticketCreationdate: new Date(ticketCreationdate),
          ticketLastUpdatedate: new Date(ticketLastUpdatedate),
          ticketTitle,
          ticketDescription,
          ticketStatus,
          priority: ticketPriority,
          fromTeamId: ticketFromTeam,
          dueDate: new Date(ticketDuedate),
          assigns: mappedAssigns,
          ticketLogs: mappedTicketLogs,
          files,
        };
      });

      setTicketList(mappedTickets);
    }
  }, [isTicketsLoading, tickets]);

  return (
    <>
      <Content style={{ margin: "24px 16px 0" }}>
        <Modal
          title="Announcements in past seven days"
          open={isAnnouncementHistoryModalVisible}
          onOk={handleAnnouncementHistoryModalOk}
          onCancel={handleAnnouncementHistoryModalCancel}
        >
          <List
            bordered
            dataSource={announcementList}
            renderItem={(item) => (
              <List.Item>
                <div>{item.content}</div>
                <Divider type="vertical" />
                <div>{getFormattedDate(item.creationDate)}</div>
              </List.Item>
            )}
          />
        </Modal>

        <Modal
          title="Post new Announcement"
          open={isAnnouncementPostModalVisible}
          onOk={handleAnnouncementPostModalOk}
          onCancel={handleAnnouncementPostModalCancel}
        >
          <Form
            form={announcementForm}
            onFinish={onPostNewAnnouncement}
            scrollToFirstError
            className="flex flex-col justify-center"
          >
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: "Please input your content",
                },
              ]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>

            <Button type="primary" htmlType="submit" className="w-30 m-auto">
              Post
            </Button>
          </Form>
        </Modal>

        <Modal
          title="Add Client"
          open={isAddClientModalVisible}
          onOk={handleAddClientModalOk}
          onCancel={handleAddClientModalCancel}
        >
          {teamId && (
            <InviteClient existingTeamAccounts={accountList} teamId={teamId} />
          )}
        </Modal>

        <Modal
          title="Manage Team Members"
          open={isTeamMemberModalVisible}
          onOk={handleTeamMemberModalOk}
          onCancel={handleTeamMemberModalCancel}
          width={600}
        >
          <List
            bordered
            dataSource={teamMemberList}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={item.employee.profileUrl} />}
                  title={
                    <p>
                      {item.employee.firstName + " " + item.employee.lastName}
                    </p>
                  }
                />
                {Number(item.joindate.getFullYear()) >= 2023 ? (
                  <div>Joined at {getFormattedDate(item.joindate)}</div>
                ) : (
                  <div>Pending Acceptance</div>
                )}

                <Divider type="vertical" />
                <div>{item.role}</div>

                <Button
                  type="link"
                  danger
                  onClick={() => handleDeleteTeamMember(item.employee.id)}
                >
                  Delete
                </Button>
              </List.Item>
            )}
          />
          <div className="mt-3 flex items-center justify-center w-full">
            {teamId && (
              <InviteTeamMember
                existingTeamMembers={teamMemberList}
                teamId={teamId}
              />
            )}
          </div>
        </Modal>

        <Modal
          title="Client Filter"
          open={isClientFilterModalVisible}
          onOk={handleClientFilterModalOk}
          onCancel={handleClientFilterModalCancel}
        >
          <div className="mb-4">
            <label>Client Account Type:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select account type"
              value={clientFilterOptions.type}
              onChange={(value) =>
                setClientFilterOptions({ ...clientFilterOptions, type: value })
              }
            >
              <Option value="standard">Standard</Option>
              <Option value="premium">Premium</Option>
            </Select>
          </div>
          <div className="mb-4">
            <label>Client Account Status:</label>
            <TreeSelect {...tProps} />
            {/* <Select
                        mode="multiple"
                        className="w-full"
                        placeholder="Select account current status"
                        value={clientFilterOptions.status}
                        onChange={(value) =>
                            setClientFilterOptions({ ...clientFilterOptions, status: value })
                        }
                    >
                        <Option value="initial reachout">initial reachout</Option>
                        <Option value="contract review">contract review</Option>
                        <Option value="technical implementation">technical implementation</Option>
                        <Option value="requirement review">requirement review</Option>
                        
                    </Select> */}
          </div>

          <div className="text-right">
            <Button type="link" onClick={handleClientResetFilter}>
              Reset
            </Button>
          </div>
        </Modal>

        <Modal
          title="Client Detail"
          width={1200}
          open={isClientDetailModalVisible}
          onOk={handleClientDetailModalOk}
          onCancel={() => setIsClientDetailModalVisible(false)}
          footer={[
            <Button
              key="back"
              onClick={() => setIsClientDetailModalVisible(false)}
            >
              Close
            </Button>,
          ]}
        >
          {selectedAccount && (
            <>
              <ClientDetail
                selectedAccount={selectedAccount}
                departmentId={curEmployee.departmentId}
                teamId={teamId}
              />
            </>
          )}
        </Modal>

        <Modal
          title="Event Filter"
          open={isEventFilterModalVisible}
          onOk={handleEventFilterModalOk}
          onCancel={handleEventFilterModalCancel}
        >
          <div className="mb-4">
            <label>Event Type:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select event type"
              value={eventFilterOptions.type}
              onChange={(value) =>
                setEventFilterOptions({ ...eventFilterOptions, type: value })
              }
            >
              <Option value="activity">Activity</Option>
              <Option value="document">Document</Option>
              <Option value="meeting">Meeting</Option>
              <Option value="other">Other</Option>
            </Select>
          </div>

          <div className="text-right">
            <Button type="link" onClick={handleEventResetFilter}>
              Reset
            </Button>
          </div>
        </Modal>

        <Modal
          title="Ticket Filter"
          open={isTicketFilterModalVisible}
          onOk={handleTicketFilterModalOk}
          onCancel={handleTicketFilterModalCancel}
        >
          <div className="mb-4">
            <label>Ticket Status:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select ticket status"
              value={ticketFilterOptions.status}
              onChange={(value) =>
                setTicketFilterOptions({
                  ...ticketFilterOptions,
                  status: value,
                })
              }
            >
              <Option value="new">New</Option>
              <Option value="pending">Pending</Option>
              <Option value="in progress">In Progress</Option>
              <Option value="under review">Under Review</Option>
              <Option value="resolved">Resolved</Option>
            </Select>
          </div>

          <div className="mb-4">
            <label>Ticket Priority:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select ticket Priority"
              value={ticketFilterOptions.priority}
              onChange={(value) =>
                setTicketFilterOptions({
                  ...ticketFilterOptions,
                  priority: value,
                })
              }
            >
              <Option value="1">1</Option>
              <Option value="2">2</Option>
              <Option value="3">3</Option>
              <Option value="4">4</Option>
              <Option value="5">5</Option>
            </Select>
          </div>

          <div className="mb-4">
            <label>Ticket Member Involved:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select ticket member involved"
              value={ticketFilterOptions.teamMember}
              onChange={(value) =>
                setTicketFilterOptions({
                  ...ticketFilterOptions,
                  teamMember: value,
                })
              }
            >
              {teamMemberOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </div>

          <div className="text-right">
            <Button type="link" onClick={handleTicketResetFilter}>
              Reset
            </Button>
          </div>
        </Modal>

        <div
          className="rounded-lg"
          style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}
        >
          <div className="flex flex-wrap mt-6 -mx-3">
            <div className="w-full max-w-full px-3 mb-3 shrink-0 lg:flex-0 lg:w-12/12">
              <Card className="relative flex flex-col justify-center h-10 min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                {curTeam ? (
                  <h2 className="text-lg">
                    {curTeam?.teamName} for {curTeam?.teamType} use
                  </h2>
                ) : (
                  <Spin />
                )}
              </Card>
            </div>
            <div className="w-full max-w-full px-3 shrink-0 lg:flex-0 lg:w-6/12">
              <Card className="relative flex flex-col h-60 min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <NotificationOutlined />
                      <h5 className="mb-0 text-lg">ANNOUNCEMENT</h5>
                    </div>
                    <Button
                      type="link"
                      onClick={handleAnnouncementHistoryClicked}
                    >
                      History in 7 days
                    </Button>
                  </div>
                  <div className="ml-3 mr-3 mt-3">
                    {announcementList && announcementList.length > 0 ? (
                      <div>
                        <Text mark>{announcementList.at(0)?.content}</Text>
                        <p className="text-right text-sm">
                          {" "}
                          Created By {announcementList.at(0)?.creatorName}
                        </p>
                        {announcementList.at(0) && (
                          <p className="text-right text-sm">
                            {" "}
                            Posted At{" "}
                            {getFormattedDate(
                              new Date(announcementList.at(0)!.creationDate),
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        {announcementList ? (
                          <Text mark> No Annoucements</Text>
                        ) : (
                          <Spin size="large" />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mt-8 text-right">
                    <Button
                      shape="round"
                      type="primary"
                      onClick={handlePostBtnClicked}
                    >
                      Post
                    </Button>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0"></div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mt-6 shrink-0 lg:mt-0 lg:flex-0 lg:w-6/12">
              <Card className="relative flex flex-col h-60 min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <TeamOutlined />
                      <h5 className="mb-0 text-lg">TEAM MEMBERS</h5>
                    </div>
                    <Button type="link" onClick={handleManageTeamMemberClicked}>
                      Manage Team Members
                    </Button>
                  </div>
                  <div className="flex flex-auto p-3">
                    {teamMemberList ? (
                      teamMemberList.map((member) => (
                        <div
                          key={member.employee.id}
                          className="w-4/12 text-center flex-0 sm:w-3/12 md:w-2/12 lg:w-3/12"
                        >
                          <a className="inline-flex items-center justify-center text-sm text-white transition-all duration-200 ease-in-out border border-blue-500 border-solid w-14 h-14 rounded-circle">
                            <Image
                              src={member.employee.profileUrl}
                              alt="Profile"
                              preview={false}
                            />
                          </a>
                          <p className="text-sm">
                            {member.employee.firstName +
                              " " +
                              member.employee.lastName}
                          </p>
                          <p className="text-sm">{member.role}</p>
                        </div>
                      ))
                    ) : (
                      <Spin size="large" />
                    )}
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0"></div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mt-3 shrink-0 lg:flex-0 lg:w-12/12">
              <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <AppstoreOutlined />
                      <h5 className="mb-0 text-lg">CLIENT RESPONSIBLE</h5>
                      <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={showClientFilterModal}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-auto p-6 pt-0">
                  {isAccountsLoading && accountList ? (
                    <div className="spinner-container">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div>
                      {accountList.length === 0 ? (
                        <Text mark className="text-center ml-6">
                          {" "}
                          No Clients
                        </Text>
                      ) : (
                        <div>
                          <div className="flex items-center justify-center gap-6">
                            <div className="w-16 h-4 rounded text-center text-sm bg-teal-100">
                              Standard
                            </div>

                            <div className="w-16 h-4 rounded text-center text-sm bg-pink-100">
                              Premium
                            </div>
                          </div>

                          <ClientList
                            accountList={accountList}
                            filterOptions={clientFilterOptions}
                            onOpenClientDetailModal={
                              handleOpenClientDetailModal
                            }
                          />
                        </div>
                      )}

                      {!curTeam?.teamDepartmentId && (
                        <div className="mt-3 text-right">
                          <Button
                            shape="round"
                            type="primary"
                            onClick={handleAddClientBtnClicked}
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>
                    // <InfiniteScroll
                    //     dataLength={accountList.length}
                    //     next={loadMoreData}
                    //     hasMore={accountList.length < 50}
                    //     loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                    //     endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                    //     scrollableTarget="scrollableDiv"
                    // >

                    // </InfiniteScroll>
                  )}
                </div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mt-3 shrink-0 lg:flex-0 lg:w-6/12">
              <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <AppstoreOutlined />
                      <h5 className="mb-0 text-lg">EVENTS INVOLVED</h5>
                      <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={showEventFilterModal}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-auto p-6 pt-0">
                  <EventList
                    teamIds={[Number(teamId)]}
                    filterOptions={eventFilterOptions}
                  />
                </div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mt-3 shrink-0 lg:flex-0 lg:w-6/12">
              <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <AppstoreOutlined />
                      <h5 className="mb-0 text-lg">TICKETS RELATED</h5>
                      <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={showTicketFilterModal}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-auto p-6 pt-0">
                  <TicketAssignedList
                    tickets={ticketList}
                    filterOptions={ticketFilterOptions}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}

export default TeamDashboard;
