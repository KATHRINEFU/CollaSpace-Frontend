import { Table, Modal, Button, Tag, Form, Input, Space } from "antd";
import { useEffect, useState, useRef } from "react";
import { ITicket } from "../../types";
import { SearchOutlined } from "@ant-design/icons";
import { useGetTicketsByEmployeeQuery } from "../../redux/user/userApiSlice";
import axios from "axios";
import type { ColumnType, ColumnsType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import type { InputRef } from "antd";
import Highlighter from "react-highlight-words";
import {
  mapDataToTickets,
  getFormattedDate,
  getPriorityColor,
  getStatusColor,
} from "../../utils/functions";
import TicketDetail from "../../components/user/TicketDetail";
import { useUser } from "../../hooks/useUser";

const getPriorityText = (priority: number) => {
  return priorityTexts[priority - 1];
};

const priorityTexts = [
  "casual",
  "not in hurry",
  "don't delay",
  "do it",
  "super important",
];

export function Component() {
  const user = useUser();
  const maxRows = 10;

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [ticketForm] = Form.useForm();
  ticketForm.setFieldsValue(selectedTicket);
  const [fromTeamNameFilterArray, setFromTeamNameFilterArray] = useState<
    { text: string; value: string }[]
  >([]);
  const [, setToTeamNameFilterArray] = useState<
    { text: string; value: string }[]
  >([]);

  const { data: tickets, isLoading: isTicketsLoading } =
    useGetTicketsByEmployeeQuery(user?.id);
  const [allTickets, setAllTickets] = useState<ITicket[]>([]);
  const [initialValue, setInitialValue] = useState<{
    ticketTitle: string;
    ticketDescription: string;
    ticketStatus: string;
    priority: number;
    fromTeamName: string | undefined;
    ticketCreatorName: string | undefined;
    toTeamName: string | undefined;
    assignToName: string | undefined;
  }>();

  useEffect(() => {
    if (selectedTicket) {
      setInitialValue({
        ticketTitle: selectedTicket.ticketTitle,
        ticketDescription: selectedTicket.ticketDescription,
        ticketStatus: selectedTicket.ticketStatus,
        priority: selectedTicket.priority,
        fromTeamName: selectedTicket.fromTeamName,
        ticketCreatorName: selectedTicket.ticketCreatorName,
        toTeamName: selectedTicket.assigns.find(
          (assign) => assign.role === "assignee",
        )?.teamName,
        assignToName: selectedTicket.assigns.find(
          (assign) => assign.role === "assignee",
        )?.employeeName,
      });
    }
  }, [selectedTicket]);

  useEffect(() => {
    ticketForm.resetFields();
  }, [initialValue]);

  useEffect(() => {
    const baseUrl = "http://localhost:8080";
    if (!isTicketsLoading && tickets) {
      const fetchAdditionalData = async (ticket: any) => {
        let ticketWithAdditionalData = { ...ticket };

        // Fetch ticket creator's name
        if (ticketWithAdditionalData.ticketCreator) {
          const employeeResponse = await axios.get(
            `${baseUrl}/employee/${ticketWithAdditionalData.ticketCreator}`,
          );
          if (employeeResponse.data) {
            ticketWithAdditionalData.ticketCreatorName =
              employeeResponse.data.employeeFirstname +
              " " +
              employeeResponse.data.employeeLastname;
          }
        }

        // Fetch from team name
        if (ticketWithAdditionalData.ticketFromTeam) {
          const teamResponse = await axios.get(
            `${baseUrl}/team/${ticketWithAdditionalData.ticketFromTeam}`,
          );
          if (teamResponse.data) {
            ticketWithAdditionalData.fromTeamName = teamResponse.data.teamName;
          }
        }

        if (ticketWithAdditionalData.assigns) {
          const assignsWithAdditionalData = [];
          for (const assign of ticketWithAdditionalData.assigns) {
            if (assign.role === "assignee") {
              const assignWithAdditionalData = { ...assign };

              if (assignWithAdditionalData.employeeId) {
                const employeeResponse = await axios.get(
                  `${baseUrl}/employee/${assignWithAdditionalData.employeeId}`,
                );
                if (employeeResponse.data) {
                  assignWithAdditionalData.employeeName = `${employeeResponse.data.employeeFirstname} ${employeeResponse.data.employeeLastname}`;
                }
              }

              if (assignWithAdditionalData.teamId) {
                const teamResponse = await axios.get(
                  `${baseUrl}/team/${assignWithAdditionalData.teamId}`,
                );
                if (teamResponse.data) {
                  assignWithAdditionalData.teamName =
                    teamResponse.data.teamName;
                }
              }

              assignsWithAdditionalData.push(assignWithAdditionalData);
            } else {
              assignsWithAdditionalData.push(assign);
            }
          }

          ticketWithAdditionalData.assigns = assignsWithAdditionalData;
        }

        if (ticketWithAdditionalData.ticketLogs) {
          const logsWithAdditionalData = [];
          for (const log of ticketWithAdditionalData.ticketLogs) {
            const logWithAdditionalData = { ...log };
            if (log.ticketLogCreator) {
              const employeeResponse = await axios.get(
                `${baseUrl}/employee/${log.ticketLogCreator}`,
              );
              if (employeeResponse.data) {
                logWithAdditionalData.ticketLogCreatorName = `${employeeResponse.data.employeeFirstname} ${employeeResponse.data.employeeLastname}`;
              }
            }
            logsWithAdditionalData.push(logWithAdditionalData);
          }
          ticketWithAdditionalData.ticketLogs = logsWithAdditionalData;
        }

        return ticketWithAdditionalData;
      };

      const fetchAndSetTickets = async () => {
        const mappedTickets = await Promise.all(
          tickets.map((data: any) => fetchAdditionalData(data)),
        );
        const convertedTicket = mappedTickets.map((ticket) =>
          mapDataToTickets(ticket),
        );
        setAllTickets(convertedTicket);
      };

      fetchAndSetTickets();
    }
  }, [tickets, isTicketsLoading]);

  useEffect(() => {
    if (allTickets) {
      // get FromTeamNameFilterArray and ToTeamNameFilterArray
      const uniqueFromTeamNames = new Set<string>();
      const uniqueToTeamNames = new Set<string>();
      allTickets.forEach((ticket) => {
        const teamName = ticket.fromTeamName;
        if (teamName) {
          uniqueFromTeamNames.add(teamName);
        }

        const assigns = ticket?.assigns;
        assigns.forEach((assign) => {
          const teamName = assign.teamName;
          if (teamName) {
            uniqueToTeamNames.add(teamName);
          }
        });
      });

      setFromTeamNameFilterArray(
        Array.from(uniqueFromTeamNames).map((teamName) => ({
          text: teamName,
          value: teamName,
        })),
      );
      setToTeamNameFilterArray(
        Array.from(uniqueToTeamNames).map((teamName) => ({
          text: teamName,
          value: teamName,
        })),
      );

      // Add empty events until the list has at least 10 rows
      const emptyRowCount = maxRows - allTickets.length;
      if (emptyRowCount > 0) {
        const emptyRows = Array(emptyRowCount).fill({
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
        });

        setAllTickets((prevList) => [...prevList, ...emptyRows]);
      }
    }
  }, [allTickets]);

  const showTicketModal = (record: ITicket) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
  };

  const [searchText, setSearchText] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (): ColumnType<ITicket> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={"Search Ticket By Title"}
          value={(selectedKeys as string[])[0]}
          // value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record.ticketTitle
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ),
  });

  const columns: ColumnsType<ITicket> = [
    {
      title: "Title",
      dataIndex: "ticketTitle",
      key: "ticketTitle",
      fixed: "left",
      ...getColumnSearchProps(),
    },
    {
      title: "Status",
      dataIndex: "ticketStatus",
      key: "ticketStatus",
      width: 180,
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
          text: "under review",
          value: "under review",
        },
        {
          text: "resolved",
          value: "resolved",
        },
      ],
      onFilter: (value, record) =>
        record.ticketStatus.indexOf(value as string) === 0,
      render: (ticketStatus) => {
        return ticketStatus ? (
          <Tag color={getStatusColor(ticketStatus)} key={ticketStatus}>
            {ticketStatus}
          </Tag>
        ) : null;
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 180,
      filters: [
        { text: "Low", value: 1 },
        { text: "Medium Low", value: 2 },
        { text: "Medium", value: 3 },
        { text: "Medium High", value: 4 },
        { text: "High", value: 5 },
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
      title: "My Role",
      dataIndex: "assigns",
      key: "myRole",
      width: 150,
      filters: [
        {
          text: "creator",
          value: "creator",
        },
        {
          text: "viewer",
          value: "viewer",
        },
        {
          text: "supervisor",
          value: "supervisor",
        },
      ],
      onFilter: (value, record) => {
        // Replace 4 with the current user's ID
        const currentUserID = 4;

        // Check if the user's role matches the selected filter value
        if (value === "creator") {
          // Check if the user is the creator
          if (record.ticketCreator === currentUserID) {
            return true;
          }
        } else {
          // Check if the user has the role in assigns
          if (record.assigns && record.assigns.length > 0) {
            for (const assign of record.assigns) {
              if (
                assign.employeeId === currentUserID &&
                assign.role === value
              ) {
                return true;
              }
            }
          }
        }
        return false;
      },
      render: (assigns) => {
        let isCreator = true;
        if (assigns && assigns.length > 0) {
          for (const assign of assigns) {
            if (assign.employeeId === 4) {
              // replace 4 with current user id
              isCreator = false;
              return assign.role;
            }
          }

          if (isCreator) {
            return "creator";
          }
        } else {
          return null;
        }
      },
    },
    // {
    //   title: "From Team",
    //   dataIndex: "fromTeamName",
    //   width: 180,
    //   filters: fromTeamNameFilterArray,
    //   onFilter: (value, record) =>
    //     record.fromTeamName?.indexOf(value as string) === 0,
    //   key: "fromTeamName",
    // },
    // {
    //   title: "To Team",
    //   dataIndex: "assigns",
    //   key: "toTeamName",
    //   filters: toTeamNameFilterArray,
    //   onFilter: (value, record) => {
    //     if (record.assigns && record.assigns.length > 0) {
    //       for (const assign of record.assigns) {
    //         if (assign.role === "assignee" && assign.teamName === value) {
    //           return true;
    //         }
    //       }
    //     }
    //     return false;
    //   },
    //   render: (assigns) => {
    //     if (assigns && assigns.length > 0) {
    //       for (const assign of assigns) {
    //         if (assign.role === "assignee") {
    //           return assign.teamName;
    //         }
    //       }
    //     } else {
    //       return null;
    //     }
    //   },
    // },
    {
      title: "Assignee",
      dataIndex: "assigns",
      key: "assignee",
      width: 180,
      render: (assigns) => {
        if (assigns && assigns.length > 0) {
          for (const assign of assigns) {
            if (assign.role === "assignee") {
              return assign.employeeName;
            }
          }
        } else {
          return null;
        }
      },
    },
    {
      title: "Created By",
      dataIndex: "ticketCreatorName",
      key: "ticketCreatorName",
      width: 180,
    },
    {
      title: "Creation Date",
      dataIndex: "ticketCreationdate",
      key: "ticketCreationdate",
      width: 200,

      sorter: (a, b) => {
        if (a.ticketCreationdate && b.ticketCreationdate) {
          return (
            a.ticketCreationdate.getTime() - b.ticketCreationdate.getTime()
          );
        } else {
          return 0;
        }
      },
      render: (ticketCreationdate) => {
        if (ticketCreationdate) {
          return getFormattedDate(new Date(ticketCreationdate));
        } else return null;
      },
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 100,
      render: (record) =>
        record.ticketId ? (
          <a onClick={() => showTicketModal(record)}>View</a>
        ) : null,
    },
  ];

  return (
    <>
      <div className="mx-3 my-6 flex flex-col gap-3">
        <h2 className="text-xl font-bold m-auto">All Tickets Involved</h2>
        {/* TODO: add buttons for choosing: ticket assigned to me*/}
        <Table columns={columns} dataSource={allTickets} scroll={{ x: 1000 }} />

        <Modal
          width={1000}
          title="Ticket Information"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {initialValue && selectedTicket && (
            <TicketDetail
              selectedTicket={selectedTicket}
              initialValue={initialValue}
            />
          )}
        </Modal>
      </div>
    </>
  );
}
