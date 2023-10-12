import { useState } from "react";
import { Input, Button, Select, List } from "antd";
import { PlusOutlined } from "@ant-design/icons";
const { Option } = Select;

interface Member {
  employee: string;
  authority: "viewer" | "supervisor" | "editor" | "leader";
}

function InviteTeamMember() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [authority, setAuthority] = useState<Member["authority"]>("viewer");
  const [membersList, setMembersList] = useState<Member[]>([]);

  const handleAddMember = () => {
    if (searchQuery) {
      // Add the selected employee and their authority to the members list.
      setMembersList([...membersList, { employee: searchQuery, authority }]);
      // Clear the search input and reset authority.
      setSearchQuery("");
      setAuthority("viewer");
    }
  };

  const handleRemoveMember = (index: number) => {
    // Remove a member from the list.
    const updatedList = [...membersList];
    updatedList.splice(index, 1);
    setMembersList(updatedList);
  };

  return (
    <div>
      <h2 className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
        Invite Team Member
      </h2>
      <div>
        <Input
          placeholder="Enter employee name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: 200, marginRight: 8 }}
        />
        <Select
          value={authority}
          style={{ width: 120, marginRight: 8 }}
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
            <List.Item.Meta
              title={member.employee}
              description={
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
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
}

export default InviteTeamMember;
