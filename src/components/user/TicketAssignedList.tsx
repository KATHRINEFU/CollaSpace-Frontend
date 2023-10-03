import { List } from "antd";

interface TicketItem {
    title: string;
    description: string;
    creator: string;
    status: string;
}

interface FilterOptions {
    status: string[];
}
  
interface TicketAssignedListProps {
    tickets: TicketItem[];
    filterOptions: FilterOptions;
}

function getBackgroundColor(status: string) {
    switch (status) {
      case "new":
        return 'bg-teal-100';
      case "pending acceptance":
        return 'bg-red-100';
      case "in progress":
        return "bg-orange-100";
      case "done":
        return "bg-teal-100";
      case "under review":
        return 'bg-pink-100';
      default:
        return "bg-white";
    }
}

const TicketAssignedList: React.FC<TicketAssignedListProps> = ({
    tickets, filterOptions
  }) => {

    const filteredTickets = tickets.filter(
    (ticket) =>
        (filterOptions.status.length === 0 ||
        filterOptions.status.includes(ticket.status))
    );

    return (
        <List
        itemLayout="horizontal"
        dataSource={filteredTickets}
        renderItem={(item) => (
            <List.Item className={`relative flex flex-col h-full min-w-0 my-3 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border ${
                getBackgroundColor(item.status)
              }`}>
                <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                    <div className="w-full flex justify-between">
                        <p className="text-lg font-bold">{item.title}</p>
                        <div className="">
                            <span className="py-1.5 px-2.5 text-xs rounded-1.8 inline-block whitespace-nowrap bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">{item.status}</span>
                        </div>
                    </div>
                </div>
                <div className=" p-6 pt-0 text-left">
                    <p className="mb-0 text-sm">{item.description}</p>
                </div>
            </List.Item>
        )}
        >
            
        </List>
    )
}

export default TicketAssignedList;