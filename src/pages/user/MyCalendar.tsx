import MyCalendarComponent from "../../components/user/MyCalendarComponent";
import { useState, useEffect } from "react";
import {
  IDocumentEvent,
  IMeetingEvent,
  IActivityEvent,
  ITicket,
  ICalendarItem,
} from "../../types";
import {
  useGetEmployeeTeamsQuery,
  useGetTicketsQuery,
} from "../../redux/api/apiSlice";
import {
  mapEventDataToEvent,
  mapDataToTickets,
  mapEventToCalendarItem,
  mapTicketToCalendarItem,
} from "../../utils/functions";

export function Component() {
  const { data: teams, isLoading: isTeamsLoading } =
    useGetEmployeeTeamsQuery(4);
  const { data: tickets, isLoading: isTicketsLoading } = useGetTicketsQuery(4);

  const [eventList, setEventList] = useState<
    (IDocumentEvent | IMeetingEvent | IActivityEvent)[]
  >([]);
  const [ticketList, setTicketList] = useState<ITicket[]>([]);
  const [calendarItems, setCalendarItems] = useState<ICalendarItem[]>([]);

  useEffect(() => {
    const baseUrl = "http://localhost:8080";
    const fetchEvents = async () => {
      try {
        // Fetch event data for each team
        const allMappedEvents: (
          | IDocumentEvent
          | IMeetingEvent
          | IActivityEvent
        )[] = [];
        const eventPromises = teams.map(async (team: any) => {
          const eventResponse = await fetch(
            `${baseUrl}/event/byteam/${team.teamId}`,
          );
          if (!eventResponse.ok) {
            throw new Error("Error fetching events in AllEvents");
          }
          const eventData = await eventResponse.json();
          const mappedEvents = eventData.map((eventData: any) =>
            mapEventDataToEvent(eventData),
          );
          allMappedEvents.push(...mappedEvents);
        });

        // Wait for all event requests to complete
        await Promise.all(eventPromises);
        setEventList(allMappedEvents);
      } catch (error) {
        console.error("Error fetching events in MyCalendar:", error);
      }
    };

    if (teams && !isTeamsLoading) {
      fetchEvents();
    }
  }, [teams, isTeamsLoading]);

  useEffect(() => {
    if (!isTicketsLoading && tickets) {
      const mappedTickets = tickets.map((data: any) => mapDataToTickets(data));
      setTicketList(mappedTickets);
    }
  }, [tickets, isTicketsLoading]);

  useEffect(() => {
    if (eventList && ticketList) {
      const mappedEventItems = eventList.map((event) =>
        mapEventToCalendarItem(event),
      );
      const mappedTicketItems = ticketList.map((ticket) =>
        mapTicketToCalendarItem(ticket),
      );

      setCalendarItems([...mappedEventItems, ...mappedTicketItems]);
    }
  }, [eventList, ticketList]);

  return (
    <div className="mx-3 mt-3 rounded-xl">
      <MyCalendarComponent realData={calendarItems} />
    </div>
  );
}
