import { List , Rate} from "antd";
import { ITicket } from "../../types";

interface FilterOptions {
  status: string[];
  priority: string[];
  role: string[];
}

interface TicketAssignedListProps {
  tickets: ITicket[];
  filterOptions: FilterOptions;
}

function getBackgroundColor(status: string) {
  switch (status) {
    case "new":
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
  const filteredTickets = tickets.filter((ticket) => {
    // Check if the ticket's status is in the selected status filter options
    const statusFilterMatch =
      filterOptions.status.length === 0 ||
      filterOptions.status.includes(ticket.ticketStatus);

    // Check if the ticket's priority is in the selected priority filter options
    const priorityFilterMatch =
      filterOptions.priority.length === 0 ||
      filterOptions.priority.includes(ticket.priority.toString()); // Convert priority to string for comparison

    // replace 4 with cur user id
    if (4 === ticket.ticketCreator && filterOptions.role.includes("creator")) {
      return statusFilterMatch && priorityFilterMatch;
    }
     // replace 4 with cur user id
    const hasSelectedRole =
      filterOptions.role.length === 0 || // No role selected (matches all roles)
      ticket.assigns.some((assign) => {
        // Check if the user's ID is found in the assigns
        if (filterOptions.role.includes(assign.role)) {
          return 4 === assign.employeeId; // replace 4 with cur user id
        }
        return false;
      });

    return statusFilterMatch && priorityFilterMatch && hasSelectedRole;
  });

  const priorityTexts = ['casual', 'not in hurry', 'don\'t delay', 'do it', 'super important'];

  return (
    <>
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
          className={`relative flex flex-col h-full min-w-0 my-3 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border ${getBackgroundColor(
            item.ticketStatus,
          )}`}
        >
          <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
            <div className="w-full flex justify-between">
              <p className="text-lg font-bold">{item.ticketTitle}</p>
              <div className="">
                <span className="py-1.5 px-2.5 text-xs rounded-1.8 inline-block whitespace-nowrap bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">
                  {item.ticketStatus}
                </span>

                <span>
                  <Rate tooltips={priorityTexts} value={item.priority} disabled/>
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
