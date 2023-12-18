import { useState, useMemo, useEffect } from "react";
import { Button, List, AutoComplete} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetAllAccountsQuery } from "../../redux/user/userApiSlice";
import { IAccount } from "../../types";
import { mapDataToEmployee } from "../../utils/functions";
import axios from 'axios'
import { message } from 'antd';

function InviteClient({ existingTeamAccounts }: { existingTeamAccounts: IAccount[] }) {
  const {data: accounts, isLoading: isAccountsLoading} = useGetAllAccountsQuery({});
  const [accountList, setAccountList] = useState<IAccount[]>([]);
  const [membersList, setMembersList] = useState<IAccount[]>([]);
  const [selectedOption, setSelectedOption] = useState<{label: string, value: number}>({label: '', value: 0});
  const [inputValue, setInputValue] = useState('');


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
  }, [accounts, isAccountsLoading]);

  const accountOptions = useMemo(() => {
    if (!accountList || accountList.length===0) return [];

    return accountList.map((account: IAccount) => ({
      label: `${account.accountCompany?.companyName}`,
      value: `${account.accountId}`,
    }));
  }, [accountList]);

  const onSelect = (data: any, option: any) => {
    setSelectedOption(option);
    setInputValue(option.label);
  };

  const onChange = (data: any, option: any) => {
    setInputValue(data);
    setSelectedOption(option);
  };


  const handleAddMember = () => {
    if (selectedOption) {
      const isExistingTeamAccount = existingTeamAccounts.find(
        (account: IAccount) => account.accountId === Number(selectedOption.value)
      );

      if (isExistingTeamAccount) {
        message.error('Account already exists in the team.');
        return;
      }

      // Check if the selected option is not already in the membersList
      const exists = membersList.find(
        (member) => member.accountId === Number(selectedOption.value)
      );

      if (exists) {
        message.error('Account already added.');
        return;
      }

      if (!exists) {
        const selectedAccount = accountList.find(
          (account) => account.accountId === Number(selectedOption.value)
        );

        if (selectedAccount) {
          setMembersList([...membersList, selectedAccount]);
          setSelectedOption({ label: '', value: 0 });
          setInputValue('');
        }
      } else {
      }
    }
  };

  const handleSendClientInvitation = () => {

  }


  const handleRemoveMember = (index: number) => {
    // Remove a member from the list.
    const updatedList = [...membersList];
    updatedList.splice(index, 1);
    setMembersList(updatedList);
  };

  return (
    <div className="flex flex-col justify-center p-3 border-2 rounded-lg bg-pink-100">
      <h2 className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
        Add Client
      </h2>
      <div className="flex gap-3">
      <AutoComplete
        value={inputValue}
        options={accountOptions}
        autoFocus={true}
        style={{ width: 200, height: "40px" }}
        filterOption={(inputValue, option) =>
          option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={onSelect}
        onChange={onChange}
      />

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddMember}
          style={{ width: "45px", height: "50px" }}
        />
      </div>

      <List
        dataSource={membersList}
        renderItem={(member, index) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleRemoveMember(index)}>
                Remove
              </Button>,
            ]}
          >
            <span>{member.accountCompany?.companyName}</span>
            <span>{member.accountCurrentStatus}</span>
          </List.Item>
        )}
      />

      <Button type="primary" onClick={handleSendClientInvitation}>
        Add to Team
      </Button> 
    </div>
  );
}

export default InviteClient;
