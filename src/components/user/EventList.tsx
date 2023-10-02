import { List } from "antd";

interface EventItem {
    title: string;
    team: string;
    description: string;
    type: string;
}

interface FilterOptions {
    type: string[];
    team: string[];
}
  
interface EventListProps {
    events: EventItem[];
    filterOptions: FilterOptions;
}

function getBackgroundColor(type: string) {
    switch (type) {
      case "activity":
        return "#FFEECC";
      case "document":
        return "#FFDDCC";
      case "meeting":
        return "#FFCCCC";
      case "other":
        return "#FEBBCC";
      default:
        return "bg-white";
    }
}

const EventList: React.FC<EventListProps> = ({
    events, filterOptions
  }) => {

    const filteredEvents = events.filter(
    (event) =>
        (filterOptions.type.length === 0 ||
        filterOptions.type.includes(event.type)) &&
        (filterOptions.team.length === 0 || filterOptions.team.includes(event.team))
    );

    return (
        <List
        itemLayout="horizontal"
        dataSource={filteredEvents}
        renderItem={(item) => (
            <List.Item className={`relative flex flex-col h-full min-w-0 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border ${
                getBackgroundColor(item.type)
              }`}>
                <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                    <div className="w-full flex justify-between">
                        <p className="text-lg font-bold">{item.title}</p>
                        <div className="">
                            <span className="py-1.5 px-2.5 text-xs rounded-1.8 inline-block whitespace-nowrap bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">{item.team}</span>
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

export default EventList;