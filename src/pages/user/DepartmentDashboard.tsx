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
  Row,
  Col,
  List,
  Divider,
  Typography,
  // Skeleton,
  // Divider
} from "antd";
import { useGetDepartmentAccountsQuery, useGetTeamAnnouncementInSevenDaysQuery, useGetTeamMembersQuery } from "../../redux/api/apiSlice";
import { useEffect, useState } from "react";
import { IAccount, IAnnouncement, ITeamMember } from "../../types";
import { FilterOutlined, NotificationOutlined, AppstoreOutlined, TeamOutlined} from "@ant-design/icons";
// import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "../../api/axios";
import ClientList from "../../components/user/ClientList";
import { clientStatusByDepartment } from "../../utils/constants";
import ClientTimeline from "../../components/user/ClientTimeline";
import { getFormattedDate } from "../../utils/functions";
import { mapDataToEmployee, mapDataToTeamMember } from "../../utils/functions";
import UploadFile from "../../components/user/UploadFile";

function DepartmentDashboard() {
  const { departmentId } = useParams();
  // const [loading, setLoading] = useState(false);
  const { data: accounts, isLoading: isAccountsLoading } =
    useGetDepartmentAccountsQuery(departmentId);
  const {data: announcements, isLoading: isAnnouncementsLoading} = useGetTeamAnnouncementInSevenDaysQuery(departmentId);
  const {data: teamMembers, isLoading: isTeamMembersLoading} = useGetTeamMembersQuery(departmentId);

  const [accountList, setAccountList] = useState<IAccount[]>([]);
  const [announcementList, setAnnouncementList] = useState<IAnnouncement[]>([]);
  const [teamMemberList, setTeamMemberList] = useState<ITeamMember[]>([]);

  // const [value, setValue] = useState([]);
  const { Content } = Layout;
  const { Option } = Select;
  const { SHOW_PARENT } = TreeSelect;
  const { Text } = Typography;

  const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);
  const [isClientDetailModalVisible, setIsClientDetailModalVisible] =
    useState(false);
  const [isClientFilterModalVisible, setIsClientFilterModalVisible] =
    useState(false);
  const [isAnnouncementHistoryModalVisible, setIsAnnouncementHistoryModalVisible] =
    useState(false);

  const [clientFilterOptions, setClientFilterOptions] = useState<{
    type: string[];
    status: string[];
  }>({
    type: [],
    status: [],
  });

  const [documents, setDocuments] = useState([
    'www.googledoc.com/clientfile/1',
    'ClientFile-Version1.doc',
    'ClientFile-Version2.doc',
    'ClientFile-Version3.doc',
    'ClientFile-Version4.doc',
    'ClientFile-Final.pdf'
  ]);



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

  const handleUploadSuccess = (fileName: string) => {
    // Add the uploaded file name to the documents list
    setDocuments([fileName, ...documents]);
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
  }

  const handleAnnouncementHistoryModalOk = () => {
    setIsAnnouncementHistoryModalVisible(false);
  };

  const handleAnnouncementHistoryModalCancel = () => {
    setIsAnnouncementHistoryModalVisible(false);
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
    if (accounts && !isAccountsLoading) {
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
            const response = await axios.get(`${baseUrl}/employee/${personnelId}`);
            return response.data;
          } catch (error) {
            console.error("Error fetching personnel info: ", error);
            return null;
          }
      }
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

            if(account.biddingPersonnel){
                const personnelInfo = await fetchPersonnelInfo(account.biddingPersonnel)
                if(personnelInfo){
                    updatedAccount.biddingPersonnelEmployee = mapDataToEmployee(personnelInfo)
                    
                }
            }
            if(account.salesPersonnel){
                const personnelInfo = await fetchPersonnelInfo(account.salesPersonnel)
                if(personnelInfo){
                    updatedAccount.salesPersonnelEmployee = mapDataToEmployee(personnelInfo)
                }
            }

            if(account.solutionArchitectPersonnel){
                const personnelInfo = await fetchPersonnelInfo(account.solutionArchitectPersonnel)
                if(personnelInfo){
                    updatedAccount.solutionArchitectPersonnelEmployee = mapDataToEmployee(personnelInfo)
                }
            }

            if(account.customerSuccessPersonnel){
                const personnelInfo = await fetchPersonnelInfo(account.customerSuccessPersonnel)
                if(personnelInfo){
                    updatedAccount.customerSuccessPersonnelEmployee = mapDataToEmployee(personnelInfo)
                }
            }
            return updatedAccount;
          }),
        );
        setAccountList(accountsWithAdditionalData);
      };
      fetchAndSetAccount();
    }
  }, [accounts, isAccountsLoading]);


  useEffect(() => {
    if (!isAnnouncementsLoading && announcements) {
      // Convert and sort announcements by creation date (newest first)
      const sortedAnnouncements = announcements
        .map((announcement: any) => ({
          id: announcement.announcementId,
          teamId: departmentId,
          teamName: "",
          creatorId: announcement.announcementCreator,
          creatorName:"",
          creationDate: new Date(announcement.announcementCreationdate),
          content: announcement.announcementContent,
        }))
        .sort((a: IAnnouncement, b:IAnnouncement) => b.creationDate.getTime() - a.creationDate.getTime());

      setAnnouncementList(sortedAnnouncements);
    }
  }, [announcements, isAnnouncementsLoading]);

  useEffect(() => {
    if(!isTeamMembersLoading && teamMembers){
        const mappedTeamMembers = teamMembers.map((teamMember: any) => mapDataToTeamMember(teamMember));
        setTeamMemberList(mappedTeamMembers);
    }
  }, [teamMembers, isTeamMembersLoading])

  return (
    <>
      <Content style={{ margin: "24px 16px 0" }}>
        <Modal
            title="Announcements in past seven days"
            open = {isAnnouncementHistoryModalVisible}
            onOk={handleAnnouncementHistoryModalOk}
            onCancel={handleAnnouncementHistoryModalCancel}
        >
            <List
                bordered
                dataSource={announcementList}
                renderItem={(item) => (
                    <List.Item>
                        <div>{item.content}</div>
                        <Divider type="vertical"/>
                        <div>{getFormattedDate(item.creationDate)}</div>
                    </List.Item>
                )}
            />

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
            <Button key="back" onClick={() => setIsClientDetailModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
            {selectedAccount && (
                <>
                    <div className="flex gap-3 items-center justify-center mb-3">
                        <Image src={selectedAccount.accountCompany?.companyLogoUrl} preview={false} width={100}/>
                        <p className="text-base font-bold">{selectedAccount.accountCompany?.companyName}</p>
                    </div>
                    <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 32 }}>
                        <Col span={8}>
                            <div className="ml-12">
                                <ClientTimeline currentDepartmentId={Number(departmentId)} currentStatus= {selectedAccount.accountCurrentStatus}/>
                            </div>
                            
                        </Col>


                        <Col span={8}>
                            <Divider orientation="right">Client Information</Divider>
                            <p>Client Name: {selectedAccount.accountCompany?.companyName}</p>
                            <p>Client Website: {selectedAccount.accountCompany?.companyWebsite}</p>
                            <p>Joined Date: {getFormattedDate(new Date(selectedAccount.accountCreationdate))}</p>
                            <p>Last Update Date: {getFormattedDate(new Date(selectedAccount.accountLastUpdatedate))}</p>

                            <Divider orientation="right">Personnel Information</Divider>

                            <Row className="mb-3" gutter={{ xs: 4, sm: 8, md: 16, lg: 16 }}>
                                <Col span={12}>
                                    <Card>
                                        <p className="text-sm">Bidding</p>
                                        <h5>{selectedAccount.biddingPersonnelEmployee?.firstName + " " + selectedAccount.biddingPersonnelEmployee?.lastName}</h5>
                                        <p>{selectedAccount.biddingPersonnelEmployee?.email}</p>

                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card>
                                        <p className="text-sm">Sales</p>
                                        <h5>{selectedAccount.salesPersonnelEmployee?.firstName + " " + selectedAccount.salesPersonnelEmployee?.lastName}</h5>
                                        <p>{selectedAccount.salesPersonnelEmployee?.email}</p>
                                    </Card>
                                </Col>
                            </Row>

                            <Row gutter={{ xs: 4, sm: 8, md: 16, lg: 16 }}>
                                <Col span={12}>
                                    <Card>
                                        <p className="text-sm">Solution Architect</p>
                                        <h5>{selectedAccount.solutionArchitectPersonnelEmployee?.firstName + " " + selectedAccount.solutionArchitectPersonnelEmployee?.lastName}</h5>
                                        <p>{selectedAccount.solutionArchitectPersonnelEmployee?.email}</p>
                                    </Card>
                                </Col>

                                <Col span={12}>
                                    <Card>
                                        <p className="text-sm">Customer Success</p>
                                        <h5>{selectedAccount.customerSuccessPersonnelEmployee?.firstName + " " + selectedAccount.customerSuccessPersonnelEmployee?.lastName}</h5>
                                        <p>{selectedAccount.customerSuccessPersonnelEmployee?.email}</p>
                                    </Card>
                                </Col>
                            </Row>

                            
                        </Col>

                        <Col span={8}>
                            <Divider orientation="right">Documents</Divider>
                            <List
                                dataSource={documents}
                                renderItem={(item) => (
                                  <List.Item>
                                    <p className="text-sky-600">{item}</p>
                                  </List.Item>
                                )}
                            />
                            
                            <div className="h-30">
                                <UploadFile onUploadSuccess={handleUploadSuccess}/>
                            </div>
                        </Col>

                    </Row>
                </>
            )}

        </Modal>
        <div
          className="rounded-lg"
          style={{ padding: 24, minHeight: 600, background: "#F2EBE9" }}
        >
          <div className="flex flex-wrap mt-6 -mx-3">
            <div className="w-full max-w-full px-3 shrink-0 lg:flex-0 lg:w-6/12">
              
                <Card className="relative flex flex-col h-40 min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                    <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center">
                        <NotificationOutlined />
                        <h5 className="mb-0 text-lg">ANNOUNCEMENT</h5>
                        </div>
                        <Button type="link" onClick={handleAnnouncementHistoryClicked}>History in 7 days</Button>
                    </div>
                    <div className="ml-3 mr-3">
                        {announcementList ? (
                            <Text mark>{announcementList.at(0)?.content}</Text>
                        ): (
                            <Spin size="large"/>
                        )}
                        
                    </div>
                    </div>
                    <div className="flex-auto p-6 pt-0">
                    
                    </div>
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
                        <Button type="link" onClick={handleAnnouncementHistoryClicked}>Manage Team Members</Button>
                    </div>
                    {/* <div className="flex flex-wrap -mx-3"> */}
                        {/* <div className="w-full max-w-full px-3 flex-0"> */}
                            {/* <div className="relative flex flex-col min-w-0 overflow-scroll break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border"> */}
                                <div className="flex flex-auto p-3">
                                {teamMemberList ? (
                                    teamMemberList.map((member) => (
                                        <div className="w-4/12 text-center flex-0 sm:w-3/12 md:w-2/12 lg:w-3/12">
                                            <a className="inline-flex items-center justify-center text-sm text-white transition-all duration-200 ease-in-out border border-blue-500 border-solid w-14 h-14 rounded-circle">
                                                <Image src={ member.employee.profileUrl} alt="Profile"/>
                                            </a>
                                            <p className="text-sm">{member.employee.firstName + " " + member.employee.lastName}</p>
                                            <p className="text-sm">{member.role}</p>
                                        </div>
                                    ))
                                ): (
                                    <Spin size="large"/>
                                )}
                                </div>
                            {/* </div> */}
                        {/* </div> */}
                        
                    {/* </div> */}
                    </div>
                    <div className="flex-auto p-6 pt-0">
                    
                    </div>
              </Card>
            </div>
              
              
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

                    // </InfiniteScroll>
                    <ClientList
                      accountList={accountList}
                      filterOptions={clientFilterOptions}
                      onOpenClientDetailModal={handleOpenClientDetailModal}
                    />
                  )}
                </div>
              </Card>
          </div>
        </div>
      </Content>
    </>
  );
}

export default DepartmentDashboard;
