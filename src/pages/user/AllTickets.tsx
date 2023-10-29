import { Table, Modal, Button, Tag, Form, Input, Rate, Select, Avatar, Tooltip, List} from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { ITicket, ITicketAssign } from "../../types";
import {UserOutlined, AntDesignOutlined} from "@ant-design/icons";
import { useGetTicketsQuery } from "../../redux/api/apiSlice";
import axios from "../../api/axios";

const teamNames = [
  "Support Team",
  "Development Team",
  "Testing Team",
  "Maintenance Team"
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#d3f261";
    case "in progress":
      return "#ffd666";
    case "in review":
      return "#b37feb";
    case "resolved":
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

function getFormattedDate(date: Date) {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day  = ("0" + (date.getDate())).slice(-2);
  var year = date.getFullYear();
  var hour =  ("0" + (date.getHours())).slice(-2);
  var min =  ("0" + (date.getMinutes())).slice(-2);
  var seg = ("0" + (date.getSeconds())).slice(-2);
  return year + "-" + month + "-" + day + " " + hour + ":" +  min + ":" + seg;
}

const getPriorityText = (priority: number) => {
  return priorityTexts[priority-1]
};

const priorityTexts = ['casual', 'not in hurry', 'don\'t delay', 'do it', 'super important'];

export function Component() {
  const maxRows = 10;
  const { Option } = Select;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [ticketForm] = Form.useForm();
  ticketForm.setFieldsValue(selectedTicket);

  const {data: tickets, isLoading: isTicketsLoading}  = useGetTicketsQuery(4);
  const [allTickets, setAllTickets] = useState<ITicket[]>([]);

  function mapDataToTickets(data: any){
    return {
      ticketId: data.ticketId,
      ticketCreator: data.ticketCreator,
      ticketCreatorName: data.ticketCreatorName,
      ticketCreationdate: data.ticketCreationdate,
      ticketLastUpdatedate: data.ticketLastUpdatedate,
      ticketTitle: data.ticketTitle,
      ticketDescription: data.ticketDescription,
      ticketStatus: data.ticketStatus,
      priority: data.ticketPriority,
      fromTeamId: data.ticketFromTeam,
      fromTeamName: data.fromTeamName,
      dueDate: data.ticketDuedate,
      assigns: data.assigns,
      ticketLogs: data.ticketLogs,
      files: data.files,
    }
  }

  useEffect(()=> {
    const baseUrl = 'http://localhost:8080';
    if(!isTicketsLoading && tickets){
      const fetchAdditionalData = async (ticket: any) => {
        let ticketWithAdditionalData = { ...ticket };
  
        // Fetch ticket creator's name
        if (ticket.ticketCreator) {
          const employeeResponse = await axios.get(`${baseUrl}/employee/${ticket.ticketCreator}`);
          if (employeeResponse.data) {
            ticketWithAdditionalData.ticketCreatorName = employeeResponse.data.employeeFirstname + " " + employeeResponse.data.employeeLastname;
          }
        }
  
        // Fetch from team name
        if (ticket.ticketFromTeam) {
          const teamResponse = await axios.get(`${baseUrl}/team/${ticket.ticketFromTeam}`);
          if (teamResponse.data) {
            ticketWithAdditionalData.fromTeamName = teamResponse.data.teamName;
          }
        }
  
        return ticketWithAdditionalData;
      };

      const fetchAndSetTickets = async () => {
        const mappedTickets = await Promise.all(tickets.map((data:any) => fetchAdditionalData(data)));
        const convertedTicket = mappedTickets.map((ticket) => mapDataToTickets(ticket));
        setAllTickets(convertedTicket);
      };

      fetchAndSetTickets();
    }
  }, [tickets, isTicketsLoading])

  useEffect(() => {
    if (allTickets) {
      // Add empty events until the list has at least 10 rows
      const emptyRowCount = maxRows - allTickets.length;
      if(emptyRowCount>0){
        const emptyRows = Array(emptyRowCount).fill(
          {
            ticketId: 0,
            ticketCreator: 0,
            ticketCreatorName: "",
            ticketCreationdate: undefined,
            ticketLastUpdatedate: undefined,
            ticketTitle: "",
            ticketDescription: "",
            ticketStatus: "",
            priority: 0,
            fromTeamId: 0,
            fromTeamName: "",
            dueDate: undefined,
            assigns: [],
            ticketLogs: [],
            files: [],
            }
        );

        setAllTickets((prevList) => [...prevList, ...emptyRows]);
      }
    }
  }, [allTickets])

  const showTicketModal = (record: ITicket) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
  };

  const handleAcceptClicked = () => {
    ticketForm.setFieldsValue({ status: 'in progress' });
  };

  const columns: ColumnsType<ITicket> = [
    {
      title: "Title",
      dataIndex: "ticketTitle",
      key: "ticketTitle",
      // fixed: 'left',
    },
    {
      title: "Status",
      dataIndex: "ticketStatus",
      key: "ticketStatus",
      filters: [
        {
          text: "pending",
          value: "pending",
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
          text: "resolved",
          value: "resolved",
        },
      ],
      onFilter: (value, record) => record.ticketStatus.indexOf(value as string) === 0,
      render: (ticketStatus) => (
        <Tag color={getStatusColor(ticketStatus)} key={ticketStatus}>
          {ticketStatus}
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
    // {
    //   title: "To Team",
    //   dataIndex: "toTeamName",
    //   key: "toTeamName",
    // },
    {
      title: "Assignee",
      dataIndex: "assigns",
      key: "assignee",
      render: (assigns) => {
        if (assigns && assigns.length > 0) {
          // Assuming "assigns" is an array of assignee objects
          const assigneeNames = assigns.map((assignee: ITicketAssign) => assignee.employeeId).join(', ');
          return assigneeNames;
        } else {
          return null; // Return null if there are no assignees
        }
      },
    },
    {
      title: "Created By",
      dataIndex: "ticketCreatorName",
      key: "ticketCreatorName",
    },
    {
      title: "Creation Date",
      dataIndex: "ticketCreationdate",
      key: "ticketCreationdate",

      sorter: (a, b) => {
        if (a.ticketCreationdate && b.ticketCreationdate) {
          return a.ticketCreationdate.getTime() - b.ticketCreationdate.getTime();
        } else {
          return 0;
        }
      },
      render: (ticketCreationdate) => {
        if(ticketCreationdate){
          return  getFormattedDate(new Date(ticketCreationdate));
        } 
        else return null;
      },
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (record) =>
        record.ticketId ? <a onClick={() => showTicketModal(record)}>View</a> : null,
    },
  ];

  return (
    <>
      <div className="mx-3 my-6 flex flex-col gap-3">
        <h2 className="text-xl font-bold m-auto">All Tickets Involved</h2>
        {/* TODO: add buttons for choosing: ticket assigned to me*/}
        <Table
          columns={columns}
          dataSource={allTickets}
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
                <Tag color={getStatusColor(selectedTicket.ticketStatus)}>
                  {selectedTicket.ticketStatus}
                </Tag>
              </Form.Item>

              {selectedTicket.ticketStatus === 'pending acceptance' && (
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
                <Form.Item name="fromTeamName" label="From Team" style={{width: '250px'}}>
                <Select placeholder="from team" disabled={true}>
                  {teamNames.map((teamName, index) => (
                    <Option key={index} value={`team${index}`}>
                      {teamName}
                    </Option>
                  ))}
                  </Select>
              </Form.Item>

              <Form.Item name="toTeamName" label="To Team" style={{width: '250px'}}>
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
