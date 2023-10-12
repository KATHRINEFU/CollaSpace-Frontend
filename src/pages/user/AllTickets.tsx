import { Table, Modal, Button, Tag } from "antd";
import { useState } from "react";
import { ColumnsType } from "antd/es/table";
import { ITicket } from "../../types";

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
  switch (priority) {
    case 1:
      return "casual";
    case 2:
      return "not in hurry";
    case 3:
      return "don't delay";
    case 4:
      return "do it";
    case 5:
      return "super important";
    default:
      return "";
  }
};

export function Component() {
  const maxRows = 10;
  const ticketsWithEmptyRows = [...fakeTickets];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

  const showEventModal = (record: ITicket) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
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
          title="Event Information"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        ></Modal>
      </div>
    </>
  );
}
