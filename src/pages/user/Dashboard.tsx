import "../../muse.main.css";
import "../../muse.responsive.css";
import { Breadcrumb , Card, Layout, Checkbox, List, Avatar} from "antd"
import AnnouncementCarousel from "../../components/user/AnnouncementCarousel";
import {NotificationOutlined, CheckCircleOutlined} from "@ant-design/icons"

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
                        {/* <List
                            itemLayout="horizontal"
                            dataSource={todayTodoList}
                            renderItem={(item, index) => (
                            <List.Item>
                                <li className="border-black/12.5 rounded-t-inherit relative block border-b border-solid py-2 px-0 text-inherit">
                                <div className="flex">
                                    <div>
                                        <h6 className="mb-0 dark:text-white/80">Call with Dave</h6>
                                        <small className="text-xs leading-tight">09:30 AM</small>
                                    </div>
                                    <div className="my-auto ml-auto min-h-6">
                                        <Checkbox className="w-5 h-5 ease -ml-7 rounded-1.4 checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none border border-solid border-slate-200 bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100" />
                                    </div>
                                </div>
                            </li>
                            </List.Item>
                            )}
                        /> */}
                        <ul className="flex flex-col pl-0 mb-0 rounded-none">
                            <li className="border-black/12.5 rounded-t-inherit relative block border-b border-solid py-2 px-0 text-inherit">
                                <div className="flex">
                                    <div>
                                        <h6 className="mb-0 dark:text-white/80">Call with Dave</h6>
                                        <small className="text-xs leading-tight">09:30 AM</small>
                                    </div>
                                    <div className="my-auto ml-auto min-h-6">
                                        <Checkbox className="w-5 h-5 ease -ml-7 rounded-1.4 checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none border border-solid border-slate-200 bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100" />
                                    </div>
                                </div>
                            </li>
                            <li className="border-black/12.5 relative block border-b border-t-0 border-solid py-2 px-0 text-inherit">
                            <div className="flex">
                            <div>
                            <h6 className="mb-0 dark:text-white/80">Brunch Meeting</h6>
                            <small className="text-xs leading-tight">11:00 AM</small>
                            </div>
                            <div className="block my-auto ml-auto min-h-6">
                            <Checkbox className="w-5 h-5 ease -ml-7 rounded-1.4 checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none border border-solid border-slate-200 bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100" />
                            </div>
                            </div>
                            </li>
                            <li className="border-black/12.5 relative block border-b border-t-0 border-solid py-2 px-0 text-inherit">
                            <div className="flex">
                            <div>
                            <h6 className="mb-0 dark:text-white/80">Argon Dashboard Launch</h6>
                            <small className="text-xs leading-tight">02:00 PM</small>
                            </div>
                            <div className="block my-auto ml-auto min-h-6">
                            <Checkbox className="w-5 h-5 ease -ml-7 rounded-1.4 checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none border border-solid border-slate-200 bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100" />
                            </div>
                            </div>
                            </li>
                            <li className="border-black/12.5 rounded-b-inherit relative block py-2 px-0 text-inherit">
                            <div className="flex">
                            <div>
                            <h6 className="mb-0 dark:text-white/80">Winter Hackaton</h6>
                            <small className="text-xs leading-tight">10:30 AM</small>
                            </div>
                            <div className="block my-auto ml-auto min-h-6">
                            <Checkbox className="w-5 h-5 ease -ml-7 rounded-1.4 checked:bg-gradient-to-tl checked:from-blue-500 checked:to-violet-500 after:text-xxs after:font-awesome after:duration-250 after:ease-in-out duration-250 relative float-left mt-1 cursor-pointer appearance-none border border-solid border-slate-200 bg-white bg-contain bg-center bg-no-repeat align-top transition-all after:absolute after:flex after:h-full after:w-full after:items-center after:justify-center after:text-white after:opacity-0 after:transition-all after:content-['\f00c'] checked:border-0 checked:border-transparent checked:bg-transparent checked:after:opacity-100" />
                            </div>
                            </div>
                            </li>
                            </ul>
                        </div>
                    </Card>
                </div>
            </div>

          </div>
        </Content>
        </>
    )
}