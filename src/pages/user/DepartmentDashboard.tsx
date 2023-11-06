import "../../muse.main.css";
import "../../muse.responsive.css";
import { useParams } from "react-router-dom";
import { Layout, Card, Button, Spin, List, Image, 
    // Skeleton, 
    // Divider 
} from "antd";
import { useGetDepartmentAccountsQuery } from "../../redux/api/apiSlice";
import { useEffect, useState } from "react";
import { IAccount } from "../../types";
import {
    FilterOutlined,
  } from "@ant-design/icons";
// import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "../../api/axios";

function DepartmentDashboard() {
    const { departmentId } = useParams();
    // const [loading, setLoading] = useState(false);
    const {data: accounts, isLoading: isAccountsLoading} = useGetDepartmentAccountsQuery(departmentId);
    const [accountList, setAccountList] = useState<IAccount[]>([]);
    const { Content } = Layout;
    const getBackgroundColor = (type: string) => {
        switch(type){
            case "standard":
                return "bg-teal-100";
            case "premium":
                return "bg-pink-100";
            default:
                return "bg-white";
        }
    }

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
        if(accounts && !isAccountsLoading){
            setAccountList(accounts)
        }
    },[accounts, isAccountsLoading])

    useEffect(() => {
        if(accountList){
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

            const fetchAndSetAccount = async () => {
                // for each account, we have all fields except ICompany
                // fetch its company info by calling baseurl/client/{compantId}
                // set its company field with fetched company
                const accountsWithAdditionalDAta = await Promise.all(
                    accountList.map(async (account) => {
                        if (account.companyId) {
                        const companyInfo = await fetchCompanyInfo(account.companyId);
                        if (companyInfo) {
                            return {
                            ...account,
                            accountCompany: companyInfo,
                            };
                        }
                        }
                        return account;
                    })
                );
                setAccountList(accountsWithAdditionalDAta)
            }
            fetchAndSetAccount()

            console.log(accountList);
        }
    }, [accountList])
    return (
      <>
        <Content style={{ margin: "24px 16px 0" }}>
            <div
            className="rounded-lg"
            style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}
            >
                <div className="flex flex-wrap mt-6 -mx-3">
                    <div className="w-full max-w-full mt-3 px-3 mb-6 shrink-0 lg:w-6/12 md:flex-0 md:w-6/12 lg:mb-0">
                        <Card className="relative flex flex-col h-full min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                            <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                                <div className="flex justify-between">
                                    <div className="flex gap-3 items-center">
                                        <h5 className="mb-0 text-lg">CLIENT RESPONSIBLE</h5>
                                        <Button
                                            type="link"
                                            icon={<FilterOutlined />}
                                            // onClick={showTicketFilterModal}
                                        />
                                        </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-6">
                                <div className="w-16 h-4 rounded text-center text-sm bg-teal-100">
                                Standard
                                </div>

                                <div className="w-16 h-4 rounded text-center text-sm bg-pink-100">
                                Premium
                                </div>
                            </div>
                            <div className="flex-auto p-6 pt-0">
                            {isAccountsLoading && accountList ? (
                                <div className="spinner-container">
                                <Spin size="large" />
                                </div>
                            ) : (
                                // <InfiniteScroll
                                //     dataLength={accountList.length}
                                //     next={loadMoreData}
                                //     hasMore={accountList.length < 50}
                                //     loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                                //     endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                //     scrollableTarget="scrollableDiv"
                                // >
                                    <List
                                    dataSource={accountList}
                                    itemLayout="horizontal"
                                    renderItem={(item: IAccount) => (
                                        <List.Item
                                        className={`relative flex flex-col my-3 h-full min-w-0 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border ${getBackgroundColor(
                                            item.accountType,
                                        )}`}
                                        // actions={[<a key="list-loadmore-edit">edit</a>, <a key="list-loadmore-more">more</a>]}
                                        >
                                            <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-3 flex items-center justify-center gap-3">
                                                <Image src={item.accountCompany?.companyLogoUrl}/>
                                                <p className="text-xl font-bold">{item.accountCompany?.companyName}</p>
                                                <div className="">
                                                    <span className="py-1.5 px-2.5 text-xs w-40 rounded-1.8 inline-block bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">
                                                    {item.accountCurrentStatus}
                                                    </span>
                                                </div>
                                            </div>
                                        </List.Item>
                                    )}
                                />
                                // </InfiniteScroll>
                                
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
  
export default DepartmentDashboard;
  