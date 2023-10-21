import { useEffect, useState } from "react";
import { useGetEmployeeTeamsQuery, useGetEventsQuery } from "../redux/api/apiSlice";
import { IEvent } from "../types";

export const useEventCount = () => {
  const [uniqueEventCount, setUniqueEventCount] = useState<number | null>(null);
  const { data: teams, isLoading } = useGetEmployeeTeamsQuery({});

  useEffect(() => {
    if (!isLoading && teams) {
      const fetchUniqueEventCount = async () => {
        const uniqueEvents = new Set<number>();
        for (const team of teams) {
          const { data: teamEvents } = await useGetEventsQuery(team.teamId);
          if (teamEvents) {
            teamEvents.forEach((event: IEvent) => {
              uniqueEvents.add(event.eventId);
            });
          }
        }
        setUniqueEventCount(uniqueEvents.size);
      };
      fetchUniqueEventCount();
    }
  }, [isLoading, teams]);

  return uniqueEventCount;
};
