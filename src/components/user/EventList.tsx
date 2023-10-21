import { List } from "antd";
import { useGetEventsQuery } from "../../redux/api/apiSlice";
import { IEvent } from "../../types";


interface FilterOptions {
  type: string[];
  team: string[];
}

interface EventListProps {
  teamIds: number[],
  filterOptions: FilterOptions;
}

interface EventFetcherProps {
  teamId: number,
  filterOptions: FilterOptions;
}

function getBackgroundColor(type: string) {
  switch (type) {
    case "activity":
      return "bg-teal-100";
    case "document":
      return "bg-orange-100";
    case "meeting":
      return "bg-pink-100";
    case "other":
      return "bg-lime-100";
    default:
      return "bg-white";
  }
}

const EventFetcher: React.FC<EventFetcherProps> = ({ teamId, filterOptions }) => {
  const { data: teamEvents } = useGetEventsQuery(teamId);
  // console.log("team ", teamId, teamEvents);

  if (!teamEvents) {
    return null;
  }

  // Filter and map the teamEvents as needed
  const filteredEvents = teamEvents.filter(
    (event: IEvent) =>
      (filterOptions.type.length === 0 ||
        filterOptions.type.includes(event.eventType)) &&
      (filterOptions.team.length === 0 || filterOptions.team.includes(event.team.teamName))
  );

  // Render the filtered events
  return (
    <List
      itemLayout="horizontal"
      dataSource={filteredEvents.slice(0, 5)}
      renderItem={(item: IEvent) => (
            <List.Item
              className={`relative flex flex-col my-3 h-full min-w-0 break-words border-0 shadow-xl dark:shadow-dark-xl rounded-2xl bg-clip-border ${getBackgroundColor(
                item.eventType,
              )}`}
            >
              <div className="w-full pb-0 border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                <div className="w-full flex justify-between">
                  <p className="text-lg font-bold">{item.eventTitle}</p>
                  <div className="">
                    <span className="py-1.5 px-2.5 text-xs w-40 rounded-1.8 inline-block bg-blue-100 text-center align-baseline font-bold uppercase leading-none text-blue-600">
                      {item.team.teamName}
                    </span>
                  </div>
                </div>
              </div>
              <div className=" p-6 pt-0 text-left">
                <p className="mb-0 text-sm">{item.eventDescription}</p>
              </div>
          </List.Item>
      )}
    />
  );
};

const EventList: React.FC<EventListProps> = ({ teamIds, filterOptions }) => {
  return (
    <div>
      <div className="flex items-center justify-center gap-6">
        <div className="w-16 h-4 rounded text-center text-sm bg-orange-100">
          Document
        </div>

        <div className="w-16 h-4 rounded text-center text-sm bg-pink-100">
          Meeting
        </div>

        <div className="w-16 h-4 rounded text-center text-sm bg-teal-100">
          Activity
        </div>

        <div className="w-16 h-4 rounded text-center text-sm bg-lime-100">
          Others
        </div>

      </div>
      
      {teamIds.map((teamId) => (
        <EventFetcher key={teamId} teamId={teamId} filterOptions={filterOptions} />
      ))}
    </div>
  );
};
export default EventList;
