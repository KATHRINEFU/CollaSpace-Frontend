import "../../muse.main.css";
import "../../muse.responsive.css";
import { useState, useEffect} from "react";
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
import { useGetEmployeeTeamsQuery } from "../../redux/api/apiSlice";
import ClientLogoList from "../../components/user/ClientLogoList";
import { IAnnouncement, IEvent } from "../../types";
import { useNavigate } from "react-router-dom";
import EventNumberCard from "../../components/user/EventNumberCard";

export function Component() {
  const { Content } = Layout;
  const { Option } = Select;
  const navigate = useNavigate();
  const [isEventFilterModalVisible, setIsEventFilterModalVisible] =useState(false);
  const [eventFilterOptions, setEventFilterOptions] = useState({
    type: [],
    team: [],
  });
  const [uniqueTeamIds, setUniqueTeamIds] = useState<number[]>([]);
  const [uniqueAccountIds, setUniqueAccountIds] = useState<number[]>([]);
  const [uniqueTeamNames, setUniqueTeamNames] = useState<string[]>([]);
  const { data: teams, isLoading: isTeamsLoading} = useGetEmployeeTeamsQuery({});
  const [announcementList, setAnnouncementList] = useState<IAnnouncement[]>([]);
  const [sortedAnnouncementList, setSortedAnnouncementList] = useState<IAnnouncement[]>([]);
  const [uniqueEventIds, setUniqueEventIds] = useState(new Set());
  
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

      // extract announcements
      teams?.forEach((team: any) => {
        team.announcements.forEach((announcement: any) => {
          setAnnouncementList((prevList)=>[...prevList, {
            id: announcement.announcementId,
            teamId: team.teamId,
            teamName: team.teamName,
            creatorId: announcement.announcementCreator,
            creatorName: announcement.announcementCreatorName,
            creationDate: announcement.announcementCreationdate,
            content: announcement.announcementContent,
          }])
        });
      });
    }
  }, [isTeamsLoading, teams]);

  useEffect(() => {
    const baseUrl = 'http://localhost:8080';
    const fetchEventIds = async () => {
      try {
        // Fetch event data for each team
        const eventPromises = teams.map(async (team: any) => {
          const eventResponse = await fetch(`${baseUrl}/event/byteam/${team.teamId}`);
          if (!eventResponse.ok) {
            throw new Error('Error fetching events in Dashboard');
          }
          const eventData = await eventResponse.json();

          // Collect unique event IDs in a Set
          eventData.forEach((event: IEvent) => {
            uniqueEventIds.add(event.eventId);
          });
        });

        // Wait for all event requests to complete
        await Promise.all(eventPromises);

        // Update the state with the unique event IDs
        setUniqueEventIds(new Set(uniqueEventIds));
      } catch (error) {
        console.error('Error fetching events in Dashboard:', error);
      }
    };

    fetchEventIds();
  }, [teams, uniqueEventIds]);


  useEffect(() => {
    if (announcementList.length > 0) {
      // console.log(announcementList)
      setSortedAnnouncementList(announcementList.sort(function(a, b) {
        return a.creationDate.valueOf() - b.creationDate.valueOf();
    }));
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
  }

  // Define state for filter options here
  const [ticketFilterOptions] = useState({
    status: [],
  });

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

  const ticketAssignedList = [
    {
      title: "Test Ticket 1",
      description: "Test Ticket 1 Description",
      creator: "Alice A",
      status: "new",
    },
    {
      title: "Test Ticket 2",
      description: "Test Ticket 2 Description",
      creator: "Bob B",
      status: "pending acceptance",
    },
    {
      title: "Test Ticket 3",
      description: "Test Ticket 3 Description",
      creator: "Celine C",
      status: "in progress",
    },
    {
      title: "Test Ticket 4",
      description: "Test Ticket 4 Description",
      creator: "Dave D",
      status: "under review",
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
                      <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                        {isTeamsLoading ? 
                        (<div className="spinner-container">
                          <Spin size="large" />
                        </div>)
                        : <p className="text-xl text-white">{uniqueAccountIds.length}</p>}
                      </div>
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
                    {(isTeamsLoading)? 
                      (<div className="spinner-container">
                        <Spin size="large" />
                      </div>)
                      :
                      <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                        <p className="text-xl text-white">{uniqueEventIds.size}</p>
                      </div>
                    }
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
                          Ticket Assigned
                        </p>
                      </div>
                    </div>
                    <div className="px-3 text-right basis-1/3">
                      <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                        <p className="text-xl text-white">9</p>
                      </div>
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
                      <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                        <p className="text-xl text-white">22</p>
                      </div>
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
                  <ClientLogoList accountIds={uniqueAccountIds} />
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
                  <AnnouncementCarousel announcementList={sortedAnnouncementList.slice(0, 5)} />
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

                    <Button type="link" className="text-right" onClick={handleViewMoreEventsClicked}>
                      View More
                    </Button>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0">
                  <EventList
                    teamIds = {uniqueTeamIds}
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
                      <h5 className="mb-0 text-lg">TICKET ASSIGNED</h5>
                      <Button
                        type="link"
                        icon={<FilterOutlined />}
                        onClick={showEventFilterModal}
                      />
                    </div>
                    <Button type="link">View More</Button>
                  </div>
                </div>
                <div className="flex-auto p-6 pt-0">
                  <TicketAssignedList
                    tickets={ticketAssignedList}
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
