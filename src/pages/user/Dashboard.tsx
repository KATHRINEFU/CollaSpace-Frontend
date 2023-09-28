import "../../muse.main.css";
import "../../muse.responsive.css";
import { Breadcrumb , Card, Layout} from "antd"
import AnnouncementCarousel from "../../components/user/AnnouncementCarousel";
import {NotificationOutlined, CheckCircleOutlined} from "@ant-design/icons"
import TodoList from "../../components/user/TodoList";

export function Component() {
    const { Content } = Layout;

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

    return (
        <>
        <Breadcrumb style={{ margin: '24px 16px 0' }}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <Content style={{ margin: '24px 16px 0' }}>
          <div className="rounded-lg" style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}>

            <div className="flex flex-wrap -mx-3 mt-3 flex justify-center">
                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Client In Progress</p>
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

                <div className="w-full max-w-full px-3 mb-6 sm:w-1/2 sm:flex-none xl:mb-0 xl:w-1/4">
                    <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="flex-auto p-4">
                            <div className="flex flex-row -mx-3">
                                <div className="flex-none w-2/3 max-w-full px-3">
                                    <div>
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Event Involved</p>
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
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Ticket Assigned</p>
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
                                        <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:text-white dark:opacity-60">Ticket Involved</p>
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
                <div className="w-full max-w-full px-3 mb-6 shrink-0 lg:w-6/12 md:flex-0 md:w-6/12 lg:mb-0">
                    <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                        <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                            <div className="flex gap-3">
                                <NotificationOutlined />
                                <h5 className="mb-0 text-lg dark:text-white">ANNOUNCEMENTS</h5>
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
                                <h5 className="mb-0 text-lg dark:text-white">TODAY'S TODOLIST</h5>
                            </div>
                            
                        </div>
                        <div className="flex-auto p-6 pt-0">
                            <TodoList todos={todayTodoList}/>
                        </div>
                    </Card>
                </div>
            </div>

          </div>
        </Content>
        </>
    )
}