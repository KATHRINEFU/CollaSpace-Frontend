import { Card } from "antd";
import { useEffect, useState } from "react";
import { useGetEventsQuery } from "../../redux/api/apiSlice";
import { IEvent } from "../../types";

interface EventNumberCardProps {
  teamIds: number[];
}

const EventNumberCard: React.FC<EventNumberCardProps> = ({ teamIds }) => {
//   const [uniqueEventCount, setUniqueEventCount] = useState(0);

//   useEffect(() => {
//     let uniqueEvents = new Set<number>();

//     // Fetch and accumulate the events for each team
//     teamIds.forEach((teamId) => {
//       const { data: teamEvents } = useGetEventsQuery(teamId);

//       if (teamEvents) {
//         teamEvents.forEach((event: IEvent) => {
//           uniqueEvents.add(event.eventId);
//         });
//       }
//     });

//     // Calculate the number of unique events
//     setUniqueEventCount(uniqueEvents.size);
//   }, [teamIds]);

  return (
    <Card className="relative flex flex-col min-w-0 break-words bg-white shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
      <div className="flex-auto p-4">
        <div className="flex flex-row -mx-3">
          <div className="flex-none w-2/3 max-w-full px-3">
            <div>
              <p className="mb-0 font-sans text-lg font-semibold leading-normal uppercase dark:opacity-60">
                Event Involved
              </p>
            </div>
          </div>
          <div className="px-3 text-right basis-1/3">
            <div className="inline-block w-12 h-12 text-center rounded-full bg-gradient-to-tl from-blue-500 to-violet-500 flex items-center justify-center">
              <p className="text-xl text-white">{15}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventNumberCard;
