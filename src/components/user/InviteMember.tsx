import { useState, useMemo } from "react";
import { Button, Select, List, AutoComplete, notification} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useGetAllEmployeesQuery } from "../../redux/user/userApiSlice";
import { IEmployee, ITeamMember } from "../../types";
import { mapDataToEmployee } from "../../utils/functions";
import { message } from 'antd';
import axios from 'axios';
interface Member {
  employeeId: number,
  employeeName: string,
  authority: "viewer" | "supervisor" | "editor" | "leader";
}

function InviteTeamMember({ existingTeamMembers, teamId }: { existingTeamMembers: ITeamMember[], teamId: string }) {
  const {data: employees, isLoading: isEmployeesLoading} = useGetAllEmployeesQuery({});
  const [authority, setAuthority] = useState<Member["authority"]>("viewer");
  const [membersList, setMembersList] = useState<Member[]>([]);
  const [selectedOption, setSelectedOption] = useState<{label: string, value: number}>({label: '', value: 0});
  const [inputValue, setInputValue] = useState('');


  const { Option } = Select;

  const employeeOptions = useMemo(() => {
    if (!employees || isEmployeesLoading) return [];

    const employeeList: IEmployee[] = employees.map((employeeData: any) =>
      mapDataToEmployee(employeeData)
    );

    return employeeList.map((employee: IEmployee) => ({
      label: `${employee.firstName} ${employee.lastName}`,
      value: `${employee.id}`,
    }));
  }, [employees, isEmployeesLoading]);

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
      const isExistingTeamAccount = existingTeamMembers.find(
        (teamMember: ITeamMember) => teamMember.employee.id === Number(selectedOption.value)
      );

      if (isExistingTeamAccount) {
        message.error('Employee already exists in the team.');
        return;
      }

      // Check if the selected option is not already in the membersList
      const exists = membersList.find(
        (member) => member.employeeId === selectedOption.value
      );

      if(exists){
        message.error('Employee already added.');
        return;
      }

      if (!exists) {
        const newMember: Member = {
          employeeId: selectedOption.value,
          employeeName: selectedOption.label,
          authority,
        };

        setMembersList([...membersList, newMember]);
        setSelectedOption({label: '', value: 0});
        setInputValue('');
      } else {
        // <Alert 
        //   type="warning"
        //   closable
        //   message="This person is already added"/>;
      }
    }
  };


  const handleRemoveMember = (index: number) => {
    // Remove a member from the list.
    const updatedList = [...membersList];
    updatedList.splice(index, 1);
    setMembersList(updatedList);
  };

  const handleSendInivitation = () => {
    axios
      .put("/api/team/invitemembers/" + teamId, {
        members: membersList.map(member => ({
          employeeId: member.employeeId,
          authority: member.authority,
          employeeName: member.employeeName
        }))
      })
      .then((r) => {
        if(!r.data){
          notification.error({
            type: "error",
            message: "Invite member failed",
          });
          return;
        }

        notification.success({
          type: "success",
          message: "Invite member success",
        });
        window.location.reload();
      })
      .catch(() => {
        notification.error({
          type: "error",
          message: "Invite member failed",
        });
      });
  };

  return (
    <div className="flex flex-col justify-center p-3 border-2 rounded-lg bg-lime-100">
      <h2 className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
        Invite Team Member
      </h2>
      <div className="flex gap-3">
      <AutoComplete
        value={inputValue}
        options={employeeOptions}
        autoFocus={true}
        style={{ width: 200, height: "40px" }}
        filterOption={(inputValue, option) =>
          option?.label.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
        }
        onSelect={onSelect}
        onChange={onChange}
      />

        <Select
          value={authority}
          style={{ width: 120, height: "40px", marginRight: 8 }}
          onChange={(value) => setAuthority(value as Member["authority"])}
        >
          <Option value="viewer">Viewer</Option>
          <Option value="supervisor">Supervisor</Option>
          <Option value="editor">Editor</Option>
          <Option value="leader">Leader</Option>
        </Select>
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
            <h4>{member.employeeName}</h4>
            <Select
              value={member.authority}
              style={{ width: 120 }}
              onChange={(value) => {
                const updatedList = [...membersList];
                updatedList[index].authority = value as Member["authority"];
                setMembersList(updatedList);
              }}
            >
              <Option value="viewer">Viewer</Option>
              <Option value="supervisor">Supervisor</Option>
              <Option value="editor">Editor</Option>
              <Option value="leader">Leader</Option>
            </Select>
          </List.Item>
        )}
      />

      <Button type="primary" onClick={handleSendInivitation}>
        Send Invitation
      </Button>
    </div>
  );
}

export default InviteTeamMember;
