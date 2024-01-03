import "../../muse.main.css";
import "../../muse.responsive.css";
import { useState, useEffect } from "react";
import { Button, Card, Layout, Modal, Select, Spin, Popover } from "antd";
import AnnouncementCarousel from "../../components/user/AnnouncementCarousel";
import {
  NotificationOutlined,
  CheckCircleOutlined,
  AppstoreOutlined,
  DeploymentUnitOutlined,
  FilterOutlined,
  ContainerOutlined,
} from "@ant-design/icons";
import TodoList from "../../components/user/TodoList";
import EventList from "../../components/user/EventList";
import TicketAssignedList from "../../components/user/TicketAssignedList";
import {
  useGetEmployeeTeamsQuery,
  useGetTicketsByEmployeeQuery,
} from "../../redux/user/userApiSlice";
import ClientLogoList from "../../components/user/ClientLogoList";
import {
  IAnnouncement,
  IEvent,
  ITicket,
  ITicketAssign,
  ITicketLog,
  IAccount,
  ITeam
} from "../../types";
import { useNavigate } from "react-router-dom";
import { mapDataToEmployee } from "../../utils/functions";
import axios from "axios";
import { useUser } from "../../hooks/useUser";

export function Component() {
  const user = useUser();
  const { data: teams, isLoading: isTeamsLoading } =
  useGetEmployeeTeamsQuery(user?.id);
  const { data: tickets, isLoading: isTicketsLoading } =
  useGetTicketsByEmployeeQuery(user?.id);
  // const { data: accounts, isLoading: isAccountsLoading } =
  //   useGetEmployeeAccountsQuery(user?.id);

  const { Content } = Layout;
  const { Option } = Select;
  const navigate = useNavigate();
  const [isEventFilterModalVisible, setIsEventFilterModalVisible] =
    useState(false);
  const [eventFilterOptions, setEventFilterOptions] = useState({
    type: [],
    team: [],
  });

  const [isTicketFilterModalVisible, setIsTicketFilterModalVisible] =
    useState(false);
  const [ticketFilterOptions, setTicketFilterOptions] = useState({
    status: [],
    priority: [],
    role: [],
  });

  const [accounts, setAccounts] = useState([]);
  const [uniqueTeamIds, setUniqueTeamIds] = useState<number[]>([]);
  const [uniqueAccountIds, setUniqueAccountIds] = useState<number[]>([]);
  const [uniqueTeamNames, setUniqueTeamNames] = useState<string[]>([]);
  const [ticketAssignedCount, setTicketAssignedCount] = useState(0);
  const [ticketCreatedCount, setTicketCreatedCount] = useState(0);
  const [ticketList, setTicketList] = useState<ITicket[]>([]);
  const [announcementList, setAnnouncementList] = useState<IAnnouncement[]>([]);
  const [sortedAnnouncementList, setSortedAnnouncementList] = useState<
    IAnnouncement[]
  >([]);
  const [accountList, setAccountList] = useState<IAccount[]>([]);


  const [uniqueEventIds, setUniqueEventIds] = useState(new Set());

  useEffect(() => {
    if (accounts) {
      console.log(accounts);
      // setAccountList(accounts)
      const baseUrl = "http://localhost:8080";
      const fetchCompanyInfo = async (companyId: number) => {
        try {
          const response = await axios.get(`${baseUrl}/client/${companyId}`);
          return response.data;
        } catch (error) {
          console.error("Error fetching company info: ", error);
          return null;
        }
      };

      const fetchPersonnelInfo = async (personnelId: number) => {
        try {
          const response = await axios.get(
            `${baseUrl}/employee/${personnelId}`,
          );
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
      fetchAndSetAccount();
    }
  }, [accounts]);

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

  useEffect(() => {
    console.log(ticketList);
  }, [ticketList])

  useEffect(() => {
    const createCount = ticketList.filter(
      (ticket) => ticket.ticketCreator === user?.id,
    ).length; // change to cur user's id
    setTicketCreatedCount(createCount);

    const assignCount = ticketList.reduce((count, ticket) => {
      const isAssignedToEmployee = ticket.assigns.some(
        (assign) => assign.employeeId === user?.id,
      );

      return count + (isAssignedToEmployee ? 1 : 0);
    }, 0);
    setTicketAssignedCount(assignCount);
  }, [ticketList]);

  useEffect(() => {
    if (!isTeamsLoading && teams) {
      // extract account ids
      const accountIds = new Set<number>();
      const teamIds = new Set<number>();
      const teamNames = new Set<string>();
      teams?.forEach((team: any) => {
        teamIds.add(team.teamId);
        teamNames.add(team.teamName);
        team.accounts.forEach((account: any) => {
          accountIds.add(account.accountId);
        });
      });
      setUniqueTeamNames(Array.from(teamNames));
      setUniqueTeamIds(Array.from(teamIds));
      setUniqueAccountIds(Array.from(accountIds));

      const fetchTeamAccounts = async () => {
        try {
          const response = await axios.post('/api/team/accounts/teamlist', Array.from(teamIds));
          setAccounts(response.data); // Set the accounts data
        } catch (error) {
          console.error('Error fetching team accounts:', error);
        }
      };

      fetchTeamAccounts();

      // extract announcements
      teams?.forEach((team: any) => {
        team.announcements.forEach((announcement: any) => {
          setAnnouncementList((prevList) => [
            ...prevList,
            {
              id: announcement.announcementId,
              teamId: team.teamId,
              teamName: team.teamName,
              creatorId: announcement.announcementCreator,
              creatorName: announcement.announcementCreatorName,
              creationDate: announcement.announcementCreationdate,
              content: announcement.announcementContent,
            },
          ]);
        });
      });
    }
  }, [isTeamsLoading, teams]);

  useEffect(() => {
    const fetchEventIds = async () => {
      if (!teams) {
        return; // Return early if teams is not defined
      }
      try {
        const eventPromises = teams.map(async (team: ITeam) => {
          const response = await axios.get('/api/event/byteam/' + team.teamId);
          const eventData = response.data;

          eventData.forEach((event: IEvent) => {
            uniqueEventIds.add(event.eventId);
          });
        });

        await Promise.all(eventPromises);
        setUniqueEventIds(new Set(uniqueEventIds));
      } catch (error) {
        console.error("Error fetching events in Dashboard:", error);
      }
    };

    fetchEventIds();
  }, [teams]);

  useEffect(() => {
    if (announcementList.length > 0) {
      // console.log(announcementList)
      setSortedAnnouncementList(
        announcementList.sort(function (a, b) {
          return a.creationDate.valueOf() - b.creationDate.valueOf();
        }),
      );
    }
  }, [announcementList]);

  // Handle filter modal visibility
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

  const handleViewMoreEventsClicked = () => {
    navigate("/user/events");
  };

  const handleViewMoreTicketsClicked = () => {
    navigate("/user/tickets");
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
      role: [],
    });
  };

  const todayTodoList = [
    {
      id: 0,
      content: "Call with Dave",
      time: "9:30 am",
      checked: true,
    },
    {
      id: 1,
      content: "Brunch Meeting",
      time: "11:00 am",
      checked: false,
    },
    {
      id: 2,
      content: "Kickoff with Tiktok",
      time: "2:30 pm",
      checked: false,
    },
    {
      id: 3,
      content: "Bug workshop with Apple",
      time: "4:00 pm",
      checked: false,
    },
  ];

  return (
    <>
      {/* <Breadcrumb style={{ margin: "24px 16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb> */}
      <Content style={{ margin: "24px 16px 0" }}>
        {/* Filter Modal */}
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
          <div className="mb-4">
            <label>Team:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select team"
              value={eventFilterOptions.team}
              onChange={(value) =>
                setEventFilterOptions({ ...eventFilterOptions, team: value })
              }
            >
              {uniqueTeamNames.map((team) => (
                <Select.Option key={team} value={team}>
                  {team}
                </Select.Option>
              ))}
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
              placeholder="Select ticket statys"
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
            <label>My role as:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select my role for tickets"
              value={ticketFilterOptions.role}
              onChange={(value) =>
                setTicketFilterOptions({ ...ticketFilterOptions, role: value })
              }
            >
              <Option value="creator">Creator</Option>
              <Option value="assignee">Assignee</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="viewer">Viewer</Option>
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
          <div className="flex flex-wrap -mx-3 mt-3 flex justify-center">
            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="flex-auto p-4">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div>
                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">
                          Client In Progress
                        </p>
                      </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                      
                        {isTeamsLoading ? (
                          <div className="spinner-container">
                            <Spin size="large" />
                          </div>
                        ) : (
                          <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                            <p className="text-xl text-white">
                              {uniqueAccountIds.length}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="w-full max-w-full gap-3 px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="flex-auto p-4">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div>
                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">
                          Event Involved
                        </p>
                      </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                      {isTeamsLoading ? (
                        <div className="spinner-container">
                          <Spin size="large" />
                        </div>
                      ) : (
                        <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                          <p className="text-xl text-white">
                            {uniqueEventIds.size}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="flex-auto p-4">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div>
                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">
                          Ticket Involved
                        </p>
                      </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">

                      {isTicketsLoading ? (
                        <div className="spinner-container">
                          <Spin size="large" />
                        </div>
                      ): (
                        <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                          <p className="text-xl text-white">
                            {ticketAssignedCount}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
              <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="flex-auto p-4">
                  <div className="flex flex-row -mx-3">
                    <div className="flex-none w-2/3 max-w-full px-3">
                      <div>
                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">
                          Ticket Created
                        </p>
                      </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                      {isTicketsLoading ? (
                        <div className="spinner-container">
                          <Spin size="large" />
                        </div>
                      ): (
                        <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                          <p className="text-xl text-white">
                            {ticketCreatedCount}
                          </p>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <div className="flex flex-wrap mt-6 -mx-3">
            <div className="w-full max-w-full px-3 mb-6 flex flex-col gap-3 shrink-0 lg:w-6/12 md:flex-0 md:w-6/12 lg:mb-0">
              <Card className="relative h-50 flex flex-col min-w-0 overflow-scroll break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-lg bg-clip-border">
                <div className="flex gap-3 ml-6">
                  <AppstoreOutlined />
                  <h5 className="mb-0 text-lg">CLIENT IN PROGRESS</h5>
                </div>
                <div className="flex flex-auto p-6 gap-9">
                  <ClientLogoList accountList={accountList} />
                </div>
              </Card>

              <Card className="relative flex flex-col h-80 min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <NotificationOutlined />
                      <Popover content="Top 5 Most Recently Created Annoucements">
                        <h5 className="mb-0 text-lg">ANNOUNCEMENTS</h5>
                      </Popover>
                    </div>
                    <Button type="link">View More</Button>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0">
                  <AnnouncementCarousel
                    announcementList={sortedAnnouncementList.slice(0, 5)}
                  />
                </div>
              </Card>
            </div>

            <div className="w-full max-w-full px-3 mb-6 shrink-0 lg:w-6/12 md:flex-0 md:w-6/12 lg:mb-0">
              <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex gap-3">
                    <CheckCircleOutlined />
                    <h5 className="mb-0 text-lg">TODAY'S TODOLIST</h5>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0">
                  <TodoList todos={todayTodoList} />
                </div>
              </Card>
            </div>

            {/* only view four nearest*/}
            <div className="w-full max-w-full mt-3 px-3 mb-6 shrink-0 lg:w-6/12 md:flex-0 md:w-6/12 lg:mb-0">
              <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <DeploymentUnitOutlined />
                      <Popover content="Top 6 Most Recently Updated Events">
                        <h5 className="mb-0 text-lg">EVENT INVOLVED</h5>
                      </Popover>

                      <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={showEventFilterModal}
                      />
                    </div>

                    <Button
                      type="link"
                      className="text-right"
                      onClick={handleViewMoreEventsClicked}
                    >
                      View More
                    </Button>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0">
                  <EventList
                    teamIds={uniqueTeamIds}
                    filterOptions={eventFilterOptions}
                  />
                </div>
              </Card>
            </div>

            {/* only view four nearest*/}
            <div className="w-full max-w-full mt-3 px-3 mb-6 shrink-0 lg:w-6/12 md:flex-0 md:w-6/12 lg:mb-0">
              <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                  <div className="flex justify-between">
                    <div className="flex gap-3 items-center">
                      <ContainerOutlined />
                      <h5 className="mb-0 text-lg">TICKET RELATED</h5>
                      <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={showTicketFilterModal}
                      />
                    </div>
                    <Button type="link" onClick={handleViewMoreTicketsClicked}>
                      View More
                    </Button>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0">
                  {isTicketsLoading ? (
                    <div className="spinner-container">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <TicketAssignedList
                      tickets={ticketList}
                      filterOptions={ticketFilterOptions}
                    />
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Content>
    </>
  );
}
