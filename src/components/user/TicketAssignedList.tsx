import { List, Rate, Modal, Button } from "antd";
import { ITicket } from "../../types";
import { useState, useEffect } from "react";
import TicketDetail from "./TicketDetail";
import { useUser } from "../../hooks/useUser";

interface FilterOptions {
  status: string[];
  priority: string[];
  role?: string[];
  teamMember?: number[];
}

interface TicketAssignedListProps {
  tickets: ITicket[];
  filterOptions: FilterOptions;
}

function getBackgroundColor(status: string) {
  switch (status) {
    case "new":
      return "bg-teal-100";
    case "submitted":
      return "bg-teal-100";
    case "pending":
      return "bg-red-100";
    case "in progress":
      return "bg-orange-100";
    case "resolved":
      return "bg-lime-100";
    case "under review":
      return "bg-pink-100";
    default:
      return "bg-white";
  }
}

const TicketAssignedList: React.FC<TicketAssignedListProps> = ({
  tickets,
  filterOptions,
}) => {
  const user = useUser();
  const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);
  const [isTicketDetailModalVisible, setIsTicketDetailModalVisible] = useState(false);
 
  const [ticketInitialValue, setTicketInitialValue] = useState<{
    ticketTitle: string;
    ticketDescription: string;
    ticketStatus: string;
    priority: number;
    fromTeamName: string | undefined;
    ticketCreatorName: string | undefined;
    toTeamName: string | undefined;
    assignToName: string | undefined;
  }>();

  const handleTicketClick = (ticket: ITicket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailModalVisible(true);
  };

  const filteredTickets = tickets.filter((ticket) => {
    // Check if the ticket's status is in the selected status filter options
    const statusFilterMatch =
      filterOptions.status.length === 0 ||
      filterOptions.status.includes(ticket.ticketStatus);

    // Check if the ticket's priority is in the selected priority filter options
    const priorityFilterMatch =
      filterOptions.priority.length === 0 ||
      filterOptions.priority.includes(ticket.priority.toString()); // Convert priority to string for comparison

    if ( user?.id === ticket.ticketCreator && filterOptions.role?.includes("creator")) {
      return statusFilterMatch && priorityFilterMatch;
    }

    if (filterOptions.role) {
      const hasSelectedRole =
        filterOptions.role?.length === 0 || // No role selected (matches all roles)
        ticket.assigns.some((assign) => {
          // Check if the user's ID is found in the assigns
          if (filterOptions.role?.includes(assign.role)) {
            return user?.id === assign.employeeId;
          }
          return false;
        });
      return statusFilterMatch && priorityFilterMatch && hasSelectedRole;
    }

    if (filterOptions.teamMember) {
      const hasSelectedTeamMember =
        filterOptions.teamMember.length === 0 ||
        filterOptions.teamMember.some((teamMemberId) => {
          const isCreator = ticket.ticketCreator === Number(teamMemberId);
          const isAssigned = ticket.assigns.some(
            (assign) => assign.employeeId === Number(teamMemberId),
          );
          return isCreator || isAssigned;
        });

      return statusFilterMatch && priorityFilterMatch && hasSelectedTeamMember;
    }

    return statusFilterMatch && priorityFilterMatch;
  });

  const priorityTexts = [
    "casual",
    "not in hurry",
    "don't delay",
    "do it",
    "super important",
  ];

  useEffect(() => {
    if (selectedTicket) {
      console.log(selectedTicket);
      // todo: query for employee name and team name
      setTicketInitialValue({
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
    // console.log(ticketInitialValue);
    // console.log(selectedTicket);
  }, [ticketInitialValue])

  return (
    <>
        <Modal
          width={1000}
          title="Ticket Information"
          open={isTicketDetailModalVisible}
          onCancel={() => setIsTicketDetailModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsTicketDetailModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          {ticketInitialValue && selectedTicket && (
            <TicketDetail
              selectedTicket={selectedTicket}
              initialValue={ticketInitialValue}
            />
          )}
        </Modal>

      <div className="flex items-center justify-center gap-3">
        <div className="w-20 h-10 rounded text-center text-sm bg-teal-100">
          NEW
        </div>

        <div className="w-20 h-10 rounded text-center text-sm bg-red-100">
          PENDING
        </div>

        <div className="w-20 h-10 rounded text-center text-sm bg-orange-100">
          IN PROGRESS
        </div>

        <div className="w-20 h-10 rounded text-center text-sm bg-pink-100">
          UNDER REVIEW
        </div>

        <div className="w-20 h-10 rounded text-center text-sm bg-lime-100">
          RESOLVED
        </div>
      </div>

      <List
        itemLayout="horizontal"
        dataSource={filteredTickets}
        renderItem={(item) => (
          <List.Item
            className={`relative flex flex-col h-full min-w-0 my-3 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border cursor-pointer ${getBackgroundColor(
              item.ticketStatus,
            )}`}
            onClick={() => handleTicketClick(item)}
          >
            <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
              <div className="w-full flex justify-between">
                <p className="text-lg font-bold">{item.ticketTitle}</p>
                <div className="">
                  <span className="py-1.5 px-2.5 text-xs rounded-1.8 inline-block whitespace-nowrap bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">
                    {item.ticketStatus}
                  </span>

                  <span>
                    <Rate
                      tooltips={priorityTexts}
                      value={item.priority}
                      disabled
                    />
                  </span>
                </div>
              </div>
            </div>
            <div className=" p-6 pt-0 text-left">
              <p className="mb-0 text-sm">{item.ticketDescription}</p>
            </div>
          </List.Item>
        )}
      ></List>
    </>
  );
};

export default TicketAssignedList;
