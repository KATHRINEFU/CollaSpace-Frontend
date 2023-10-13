import { Table, Modal, Button, Tag, Form, Input, Rate, Select, Avatar, Tooltip, List} from "antd";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { ITicket } from "../../types";
import {UserOutlined, AntDesignOutlined} from "@ant-design/icons";

const fakeTickets: ITicket[] = [
  {
    id: 1,
    creatorId: 1,
    creatorName: "John Doe",
    creationDate: new Date(),
    title: "Ticket 1",
    description: "This is the description for ticket 1.",
    status: "pending acceptance",
    priority: 1,
    fromTeamId: 1,
    fromTeamName: "Support Team",
    toTeamId: 2,
    toTeamName: "Development Team",
    assignToName: "Alice",
    viewers: ["Alice", "Bob"],
    files: ["file1.pdf", "file2.doc"],
    dueDate: new Date("2023-10-15"),
  },
  {
    id: 2,
    creatorId: 2,
    creatorName: "Jane Smith",
    creationDate: new Date(),
    title: "Ticket 2",
    description: "This is the description for ticket 2.",
    status: "in progress",
    priority: 2,
    fromTeamId: 2,
    fromTeamName: "Development Team",
    toTeamId: 3,
    toTeamName: "Testing Team",
    assignToName: "Eve",
    viewers: ["Eve"],
    files: ["file3.jpg"],
  },
  {
    id: 3,
    creatorId: 3,
    creatorName: "Alice Johnson",
    creationDate: new Date(),
    title: "Ticket 3",
    description: "This is the description for ticket 3.",
    status: "completed",
    priority: 3,
    fromTeamId: 2,
    fromTeamName: "Development Team",
    toTeamId: 4,
    toTeamName: "Maintenance Team",
    assignToName: "David",
    viewers: ["David", "Frank"],
    files: ["file4.docx", "file5.png"],
  },
  {
    id: 4,
    creatorId: 4,
    creatorName: "Bob Johnson",
    creationDate: new Date(),
    title: "Ticket 4",
    description: "This is the description for ticket 4.",
    status: "in review",
    priority: 4,
    fromTeamId: 3,
    fromTeamName: "Testing Team",
    toTeamId: 2,
    toTeamName: "Development Team",
    assignToName: "Alice",
    viewers: ["Alice", "Eve"],
    files: ["file6.pdf"],
    dueDate: new Date("2023-10-20"),
  },
  {
    id: 5,
    creatorId: 5,
    creatorName: "Eve Smith",
    creationDate: new Date(),
    title: "Ticket 5",
    description: "This is the description for ticket 5.",
    status: "in progress",
    priority: 5,
    fromTeamId: 4,
    fromTeamName: "Maintenance Team",
    toTeamId: 3,
    toTeamName: "Testing Team",
    assignToName: "Frank",
    viewers: ["Frank", "David"],
    files: ["file7.jpg"],
  },
];

const teamNames = [
  "Support Team",
  "Development Team",
  "Testing Team",
  "Maintenance Team"
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending acceptance":
      return "#d3f261";
    case "in progress":
      return "#ffd666";
    case "in review":
      return "#b37feb";
    case "completed":
      return "#5cdbd3";
    default:
      return "";
  }
};

const getPriorityColor = (priority: number) => {
  switch (priority) {
    case 1:
      return "#fff0f6";
    case 2:
      return "#ffadd2";
    case 3:
      return "#ff85c0";
    case 4:
      return "#eb2f96";
    case 5:
      return "#9e1068";
    default:
      return "";
  }
};

const getPriorityText = (priority: number) => {
  return priorityTexts[priority-1]
};

const priorityTexts = ['casual', 'not in hurry', 'don\'t delay', 'do it', 'super important'];

export function Component() {
  const maxRows = 10;
  const { Option } = Select;
  const ticketsWithEmptyRows = [...fakeTickets];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [ticketForm] = Form.useForm();
  ticketForm.setFieldsValue(selectedTicket);

  const showEventModal = (record: ITicket) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
  };

  const handleAcceptClicked = () => {
    ticketForm.setFieldsValue({ status: 'in progress' });
  };

  while (ticketsWithEmptyRows.length < maxRows) {
    // Add empty events until the list has at least 10 rows
    ticketsWithEmptyRows.push({
      id: 0,
      creatorId: 0,
      creatorName: "",
      creationDate: undefined,
      title: "",
      description: "",
      status: "",
      priority: 0,
      fromTeamId: 0,
      fromTeamName: "",
      toTeamId: 0,
      toTeamName: "",
      assignToName: "",
      viewers: [],
      files: [],
    });
  }

  const columns: ColumnsType<ITicket> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      // fixed: 'left',
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "pending acceptance",
          value: "pending acceptance",
        },
        {
          text: "in progress",
          value: "in progress",
        },
        {
          text: "in review",
          value: "in review",
        },
        {
          text: "completed",
          value: "completed",
        },
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
      render: (status) => (
        <Tag color={getStatusColor(status)} key={status}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      filters: [
        { text: 'Low', value: 1 },
        { text: 'Medium Low', value: 2 },
        { text: 'Medium', value: 3 },
        { text: 'Medium High', value: 4 },
        { text: 'High', value: 5 },
      ],
      onFilter: (value, record) => record.priority === value,
      render: (priority) => {
        return priority ? (
          <Tag color={getPriorityColor(priority)} key={priority}>
            {getPriorityText(priority)}
          </Tag>
        ) : null;
      },
    },
    {
      title: "From Team",
      dataIndex: "fromTeamName",
      key: "fromTeamName",
    },
    {
      title: "To Team",
      dataIndex: "toTeamName",
      key: "toTeamName",
    },
    {
      title: "Assignee",
      dataIndex: "assignToName",
      key: "assignToName",
    },
    {
      title: "Creator",
      dataIndex: "creatorName",
      key: "creatorName",
    },
    {
      title: "Creation Date",
      dataIndex: "creationDate",
      key: "creationDate",

      sorter: (a, b) => {
        if (a.creationDate && b.creationDate) {
          return a.creationDate.getTime() - b.creationDate.getTime();
        } else {
          return 0;
        }
      },
      render: (creationDate) => {
        return creationDate?.toLocaleString();
      },
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (record) =>
        record.id ? <a onClick={() => showEventModal(record)}>View</a> : null,
    },
  ];

  return (
    <>
      <div className="mx-3 my-6 flex flex-col gap-3">
        <h2 className="text-xl font-bold m-auto">All Tickets Involved</h2>
        {/* TODO: add buttons for choosing: ticket assigned to me*/}
        <Table
          columns={columns}
          dataSource={ticketsWithEmptyRows}
          scroll={{ x: 1000 }}
        />

        <Modal
          title="Ticket Information"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {selectedTicket && (
            <Form form={ticketForm}>
              <Form.Item name="title" label="Title">
                <Input disabled />
              </Form.Item>
              <Form.Item name="description" label="Description">
                <Input.TextArea disabled />
              </Form.Item>
              
              <div className="flex gap-3">
              <Form.Item name="status" label="Status">
                <Tag color={getStatusColor(selectedTicket.status)}>
                  {selectedTicket.status}
                </Tag>
              </Form.Item>

              {selectedTicket.status === 'pending acceptance' && (
                <Form.Item>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleAcceptClicked}
                    style={{ height: '10px'}}
                  >
                    Accept
                  </Button>
                </Form.Item>)}
              </div>

              <Form.Item name="priority" label="Priority">
                <Rate tooltips={priorityTexts} value={selectedTicket.priority} disabled = {true} />
                {selectedTicket.priority ? <span className="ant-rate-text">{getPriorityText(selectedTicket.priority)}</span> : ''}
              </Form.Item>

              <div className="flex gap-3 w-full justify-between">
                <Form.Item name="fromTeam" label="From Team" style={{width: '250px'}}>
                <Select placeholder="from team" disabled={true}>
                  {teamNames.map((teamName, index) => (
                    <Option key={index} value={`team${index}`}>
                      {teamName}
                    </Option>
                  ))}
                  </Select>
              </Form.Item>

              <Form.Item name="toTeam" label="To Team" style={{width: '250px'}}>
                <Select placeholder="to team" disabled={true}>
                  {teamNames.map((teamName, index) => (
                    <Option key={index} value={`team${index}`}>
                      {teamName}
                    </Option>
                  ))}
                  </Select>
              </Form.Item>
              </div>
              
              <div className="flex gap-3 w-full justify-between">
                <Form.Item name="creatorName" label="Created By" style={{width: '250px'}}>
                    <Input disabled/>
                </Form.Item>

                <Form.Item name="assignToName" label="Assigned To" style={{width: '250px'}}>
                    <Input disabled/>
                </Form.Item>
              </div>

              <div className="flex gap-3 items-center">
                <p>Viewers: </p>

                {/*TODO: get viewer's profile photo, popover to show fullname */}
              <Avatar.Group
                  maxCount={5}
                  size="large"
                  maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                >
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                    <Tooltip title="Ant User" placement="top">
                    <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  </Tooltip>
                  <Avatar style={{ backgroundColor: '#1677ff' }} icon={<AntDesignOutlined />} />
                </Avatar.Group>
              </div>

              <div className="flex gap-3 mt-3">
                <p>Attachments: </p>
                {/*TODO: filename, filepath */}
                <List
                  size="small"
                  bordered
                  dataSource={selectedTicket.files}
                  style={{width: '300px'}}
                  renderItem={(file,) => (
                    <List.Item>
                      <a href={`path_to_your_files/${file}`} target="_blank" rel="noopener noreferrer">
                        {file}
                      </a>
                    </List.Item>
                  )}
                />
              </div>
              
            </Form>
          )}
          
            
        </Modal>
      </div>
    </>
  );
}
