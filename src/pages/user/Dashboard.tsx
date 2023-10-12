import "../../muse.main.css";
import "../../muse.responsive.css";
import { useState } from "react";
import { Breadcrumb , Button, Card, Layout, Modal, Select} from "antd"
import AnnouncementCarousel from "../../components/user/AnnouncementCarousel";
import {NotificationOutlined, CheckCircleOutlined, AppstoreOutlined, DeploymentUnitOutlined, FilterOutlined, ContainerOutlined} from "@ant-design/icons"
import TodoList from "../../components/user/TodoList";
import EventList from "../../components/user/EventList";
import TicketAssignedList from "../../components/user/TicketAssignedList";
import AppleLogo from "../../assets/img/logos/AppleLogo.png"
import BugattiLogo from "../../assets/img/logos/BugattiLogo.svg"
import ChanelLogo from "../../assets/img/logos/ChanelLogo.svg"
import TiktokLogo from "../../assets/img/logos/TiktokLogo.png"
import ZaraLogo from "../../assets/img/logos/ZaraLogo.svg"

export function Component() {
    const { Content } = Layout;
    const { Option } = Select;
    const [isEventFilterModalVisible, setIsEventFilterModalVisible] = useState(false);
    // Define state for filter options here
    const [eventFilterOptions, setEventFilterOptions] = useState({
        type: [],
        team: [],
    });

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

    // Define state for filter options here
    const [ticketFilterOptions] = useState({
        status: [],
    });

    const announcementList = [
        {
            'content': 'Let\'s have dinner at 4:30pm. We need to be there in advance!',
            'creator': 'Stanley Wang',
            'creationDate': '2023-09-27'
        },
        {
            'content': 'Meet at A301 everyone, the slides need some update.',
            'creator': 'Chen Zhang',
            'creationDate': '2023-09-26'
        },
    ]

    const todayTodoList = [
        {
            'id': 0,
            'content': 'Call with Dave',
            'time': '9:30 am',
            'checked': true,
        },
        {
            'id': 1,
            'content': 'Brunch Meeting',
            'time': '11:00 am',
            'checked': false,
        },
        {
            'id': 2,
            'content': 'Kickoff with Tiktok',
            'time': '2:30 pm',
            'checked': false,
        },
        {
            'id': 3,
            'content': 'Bug workshop with Apple',
            'time': '4:00 pm',
            'checked': false,
        }
    ]

    const clientLogoList = [
        {
            'name': 'Apple',
            'logo': AppleLogo,
        },
        {
            'name': 'Bugatti',
            'logo': BugattiLogo,
        },
        {
            'name': 'Chanel',
            'logo': ChanelLogo,
        },
        {
            'name': 'Tiktok',
            'logo': TiktokLogo,
        },
        {
            'name': 'Zara',
            'logo': ZaraLogo,
        },
    ]

    const eventList = [
        {
            'title': 'Review Apple\'s technical implementation plan',
            'team': 'Solution Architect',
            'description': 'After reconsidering their requirement and business logic, a new plan is needed. But we do not have to draft a completely new one, just update parts.',
            'type': 'document',
        },
        {
            'title': 'Decoration for Max birthday party',
            'team': 'Max Birthday',
            'description': 'We bought some decorations from target. We need the decoration done today.',
            'type': 'activity',
        },
        {
            'title': 'Meeting with Apple',
            'team': 'Sales',
            'description': 'Requirement analysis, discuss data privacy',
            'type': 'meeting',
        },
        {
            'title': 'Meeting with Tiktok',
            'team': 'Solution Architect',
            'description': 'They met a order mismatch issue, work with their tech team to fix',
            'type': 'meeting',
        }
    ]

    const ticketAssignedList = [
        {
            'title': 'Test Ticket 1',
            'description': 'Test Ticket 1 Description',
            'creator': 'Alice A',
            'status': 'new'
        },
        {
            'title': 'Test Ticket 2',
            'description': 'Test Ticket 2 Description',
            'creator': 'Bob B',
            'status': 'pending acceptance'
        },
        {
            'title': 'Test Ticket 3',
            'description': 'Test Ticket 3 Description',
            'creator': 'Celine C',
            'status': 'in progress'
        },
        {
            'title': 'Test Ticket 4',
            'description': 'Test Ticket 4 Description',
            'creator': 'Dave D',
            'status': 'under review'
        },
    ]

    const uniqueTeams = Array.from(
        new Set(eventList.map((event) => event.team))
    );

    return (
        <>
        <Breadcrumb style={{ margin: '24px 16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ margin: '24px 16px 0' }}>

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
            {uniqueTeams.map((team) => (
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

      
          <div className="rounded-lg" style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}>
            <div className="flex flex-wrap -mx-3 mt-3 flex justify-center">
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">Client In Progress</p>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                                        <p className="text-xl text-white">7</p>
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
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">Event Involved</p>
                                    </div>
                                </div>
                                <div className="px-3 text-right basis-1/3">
                                    <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
                                        <p className="text-xl text-white">15</p>
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
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">Ticket Assigned</p>
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
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">Ticket Involved</p>
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
                            
                            {clientLogoList.map((item) => {
                                return (
                                    <div className="w-4/12 text-center flex-0 sm:w-5/12 md:w-4/12 lg:w-2/12">
                                    <a href="javascript:;" className="inline-flex items-center justify-center text-sm text-white transition-all duration-200 ease-in-out border border-solid w-14 h-14 rounded-circle">
                                        <img src={item.logo} alt="Client Logo" className="w-full p-1 rounded-circle"/>
                                    </a>
                                    <p className="mb-0 text-sm leading-normal dark:text-white dark:opacity-60">{item.name}</p>
                                    </div>
                                )
                            })}
                            
                        </div>
                    </Card>

                    <Card className="relative flex flex-col h-80 min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                            <div className="flex justify-between">
                                <div className="flex gap-3 items-center">
                                    <NotificationOutlined />
                                    <h5 className="mb-0 text-lg">ANNOUNCEMENTS</h5>
                                </div>
                                <Button type="link">View More</Button>
                            </div>
                            
                        </div>
                        <div className="flex-auto p-6 pt-0">
                            <AnnouncementCarousel announcementList={announcementList}/>
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
                            <TodoList todos={todayTodoList}/>
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
                                    <h5 className="mb-0 text-lg">EVENT INVOLVED</h5>
                                    <Button type="link" icon={<FilterOutlined />} onClick={showEventFilterModal}/>
                                </div>
                                
                                <Button type="link" className="text-right">View More</Button>
                            </div>
                            
                        </div>
                        <div className="flex-auto p-6 pt-0">
                            <EventList events={eventList} filterOptions={eventFilterOptions}/>
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
                                    <Button type="link" icon={<FilterOutlined />} onClick={showEventFilterModal}/>
                                </div>
                                <Button type="link">View More</Button>
                            </div>
                            
                            
                        </div>
                        <div className="flex-auto p-6 pt-0">
                            <TicketAssignedList tickets={ticketAssignedList} filterOptions={ticketFilterOptions}/>
                        </div>
                    </Card>
                </div>


            </div>

          </div>
        </Content>
        </>
    )
}