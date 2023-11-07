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
  // Skeleton,
  // Divider
} from "antd";
import { useGetDepartmentAccountsQuery } from "../../redux/api/apiSlice";
import { useEffect, useState } from "react";
import { IAccount } from "../../types";
import { FilterOutlined } from "@ant-design/icons";
// import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "../../api/axios";
import ClientList from "../../components/user/ClientList";
import { clientStatusByDepartment } from "../../utils/constants";
import ClientTimeline from "../../components/user/ClientTimeline";

function DepartmentDashboard() {
  const { departmentId } = useParams();
  // const [loading, setLoading] = useState(false);
  const { data: accounts, isLoading: isAccountsLoading } =
    useGetDepartmentAccountsQuery(departmentId);
  const [accountList, setAccountList] = useState<IAccount[]>([]);
  // const [value, setValue] = useState([]);
  const { Content } = Layout;
  const { Option } = Select;
  const { SHOW_PARENT } = TreeSelect;
  const [selectedAccount, setSelectedAccount] = useState<IAccount | null>(null);
  const [isClientDetailModalVisible, setIsClientDetailModalVisible] =
    useState(false);
  const [isClientFilterModalVisible, setIsClientFilterModalVisible] =
    useState(false);
  const [clientFilterOptions, setClientFilterOptions] = useState<{
    type: string[];
    status: string[];
  }>({
    type: [],
    status: [],
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

      const fetchAndSetAccount = async () => {
        // for each account, we have all fields except ICompany
        // fetch its company info by calling baseurl/client/{compantId}
        // set its company field with fetched company
        const accountsWithAdditionalDAta = await Promise.all(
          accounts.map(async (account: any) => {
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
          }),
        );
        setAccountList(accountsWithAdditionalDAta);
      };
      fetchAndSetAccount();
    }
  }, [accounts, isAccountsLoading]);

  return (
    <>
      <Content style={{ margin: "24px 16px 0" }}>
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
                    <div className="flex gap-3 items-center justify-center">
                        <Image src={selectedAccount.accountCompany?.companyLogoUrl} preview={false} width={100}/>
                        <p className="text-base font-bold">{selectedAccount.accountCompany?.companyName}</p>
                    </div>
                    
                    <ClientTimeline currentDepartmentId={Number(departmentId)} currentStatus= {selectedAccount.accountCurrentStatus}/>
                {/* Add more details as needed */}
                </>
            )}

        </Modal>
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
        </div>
      </Content>
    </>
  );
}

export default DepartmentDashboard;
