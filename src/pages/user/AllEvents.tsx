import { Table, Modal, Button } from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { IDocumentEvent, IMeetingEvent, IActivityEvent } from "../../types";
import { useGetEmployeeTeamsQuery } from "../../redux/api/apiSlice";

// const fakeEvents: (IDocumentEvent | IMeetingEvent | IActivityEvent)[] = [
//   {
//     id: 1,
//     creationTeamId: 1,
//     creationTeamName: "Team A",
//     creatorId: 101,
//     creatorName: "John Doe",
//     type: "document",
//     title: "Document Event 1",
//     description: "This is a document event.",
//     creationDate: new Date("2023-10-01T10:00:00"),
//     link: "https://example.com/document1",
//     deadlineDate: new Date("2023-10-10"),
//   },
//   {
//     id: 2,
//     creationTeamId: 2,
//     creationTeamName: "Team B",
//     creatorId: 102,
//     creatorName: "Jane Smith",
//     type: "meeting",
//     title: "Meeting Event 1",
//     description: "This is a meeting event.",
//     creationDate: new Date("2023-10-05T10:00:00"),
//     virtual: true,
//     location: "Online",
//     link: "https://example.com/meeting1",
//     startTime: new Date("2023-09-28T14:00:00"),
//     endTime: new Date("2023-09-28T15:30:00"),
//     noteLink: "https://example.com/meeting1-notes",
//     agendaLink: "https://example.com/meeting1-agenda",
//     meetingType: "Team Meeting",
//   },
//   {
//     id: 3,
//     creationTeamId: 1,
//     creationTeamName: "Team A",
//     creatorId: 101,
//     creatorName: "John Doe",
//     type: "activity",
//     title: "Activity Event 1",
//     description: "This is an activity event.",
//     creationDate: new Date("2023-10-05T10:00:00"),
//     virtual: false,
//     location: "Park",
//     startTime: new Date("2023-10-05T10:00:00"),
//     endTime: new Date("2023-10-05T12:00:00"),
//   },
//   // Add more fake events as needed...
// ];

export function Component() {
  const maxRows = 10;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    IDocumentEvent | IMeetingEvent | IActivityEvent | null
  >(null);
  const { data: teams, isLoading: isTeamsLoading} = useGetEmployeeTeamsQuery(4);
  const [eventList, setEventList] = useState< (IDocumentEvent | IMeetingEvent | IActivityEvent) []>([]);
  const [eventsWithEmptyRows, setEventsWithEmptyRows]= useState<(IDocumentEvent | IMeetingEvent | IActivityEvent) []>([]);
  const [isTableLoading, setIsTableLoading] = useState(true); // Add loading state

  const showEventModal = (
    record: IDocumentEvent | IMeetingEvent | IActivityEvent,
  ) => {
    setSelectedEvent(record);
    setIsModalVisible(true);
  };

  function mapToDocumentEvent(data: any) {
    return {
      eventId: data.eventId,
      eventCreationdate: new Date(data.eventCreationdate),
      team: data.team,
      eventCreator: data.eventCreator,
      eventType: data.eventType,
      eventTitle: data.eventTitle,
      eventDescription: data.eventDescription,
      eventExpired: data.eventExpired,
      eventLastUpdatedate: data.eventLastUpdatedate
        ? new Date(data.eventLastUpdatedate)
        : undefined,
      collaborations: data.collaborations,
      link: data.documentLink || null,
      deadlineDate: data.deadline ? new Date(data.deadline) : undefined,
    };
  }

  function mapToMeetingEvent(data: any) {
    return {
      eventId: data.eventId,
      eventCreationdate: new Date(data.eventCreationdate),
      team: data.team,
      eventCreator: data.eventCreator,
      eventType: data.eventType,
      eventTitle: data.eventTitle,
      eventDescription: data.eventDescription,
      eventExpired: data.eventExpired,
      eventLastUpdatedate: data.eventLastUpdatedate
        ? new Date(data.eventLastUpdatedate)
        : undefined,
      collaborations: data.collaborations,
      virtual: data.meetingVirtual,
      location: data.meetingLocation,
      link: data.meetingLink,
      startTime: data.meetingStarttime ? new Date(data.meetingStarttime): undefined,
      endTime: data.meetingEndtime ? new Date(data.meetingEndtime): undefined,
      noteLink: data.meetingNoteLink,
      agendaLink: data.meetingAgendaLink,
      meetingType: data.meetingType,
    };
  }

  function mapToActivityEvent(data: any) {
    return {
      eventId: data.eventId,
      eventCreationdate: new Date(data.eventCreationdate),
      team: data.team,
      eventCreator: data.eventCreator,
      eventType: data.eventType,
      eventTitle: data.eventTitle,
      eventDescription: data.eventDescription,
      eventExpired: data.eventExpired,
      eventLastUpdatedate: data.eventLastUpdatedate
        ? new Date(data.eventLastUpdatedate)
        : undefined,
      collaborations: data.collaborations,
      virtual: data.activityVirtual,
      location: data.activityLocation,
      startTime: data.activityStarttime ? new Date(data.activityStarttime): undefined,
      endTime: data.activityEndtime ? new Date(data.activityEndtime): undefined,
    };
  }
  

  function mapEventDataToEvent(eventData: any) {
    switch (eventData.eventType) {
      case 'document':
        return mapToDocumentEvent(eventData);
      case 'meeting':
        return mapToMeetingEvent(eventData);
      case 'activity':
        return mapToActivityEvent(eventData);
      default:
        return null; 
    }
  }

  useEffect(() => {
    const baseUrl = 'http://localhost:8080';
    const fetchEvents = async () => {
      try {
        // Fetch event data for each team
        const allMappedEvents: (IDocumentEvent|IMeetingEvent|IActivityEvent)[] = [];
        const eventPromises = teams.map(async (team: any) => {
          const eventResponse = await fetch(`${baseUrl}/event/byteam/${team.teamId}`);
          if (!eventResponse.ok) {
            throw new Error('Error fetching events in AllEvents');
          }
          const eventData = await eventResponse.json();
          const mappedEvents = eventData.map((eventData: any) => mapEventDataToEvent(eventData));
          allMappedEvents.push(...mappedEvents);
        });
        
        // Wait for all event requests to complete
        await Promise.all(eventPromises);
        setEventList(allMappedEvents);
        setIsTableLoading(false);
        
      } catch (error) {
        console.error('Error fetching events in AllEvents:', error);
        setIsTableLoading(false);
      }
    };

    if(teams && !isTeamsLoading){
      fetchEvents();
    }
  }, [teams, isTeamsLoading])

  useEffect(() => {
    console.log(eventList);
    setEventsWithEmptyRows(eventList);
  }, [eventList])

  // while (eventsWithEmptyRows.length < maxRows) {
  //   // Add empty events until the list has at least 10 rows
  //   eventsWithEmptyRows.push({
  //     eventId: 0,
  //     eventCreationdate: undefined,
  //     team: null,
  //     eventCreator: 0,
  //     eventType: "",
  //     eventTitle: "",
  //     eventDescription: "",
  //     eventExpired: false,
  //     eventLastUpdatedate: undefined,
  //     collaborations: [],
  //     link: undefined,
  //     deadlineDate: undefined,
  //   });
  // }  

  const columns: ColumnsType<IDocumentEvent | IMeetingEvent | IActivityEvent> =
    [
      {
        title: "Title",
        dataIndex: "eventTitle",
        key: "eventTitle",
        // fixed: 'left',
      },
      // {
      //   title: "Description",
      //   dataIndex: "eventDescription",
      //   key: "eventDescription",
      // },
      // {
      //   title: "Creation Team",
      //   dataIndex: "creationTeamName",
      //   key: "creationTeamName",
      //   filters: [
      //     {
      //       text: "Team A",
      //       value: "Team A",
      //     },
      //     {
      //       text: "Team B",
      //       value: "Team B",
      //     },
      //     {
      //       text: "Team C",
      //       value: "Team C",
      //     },
      //   ],
      //   onFilter: (value, record) =>
      //     record.creationTeamName.indexOf(value as string) === 0,
      // },
      // {
      //   title: "Creator",
      //   dataIndex: "creatorName",
      //   key: "creatorName",
      // },
      {
        title: "Type",
        dataIndex: "eventType",
        key: "eventType",
        filters: [
          {
            text: "meeting",
            value: "meeting",
          },
          {
            text: "document",
            value: "document",
          },
          {
            text: "activity",
            value: "activity",
          },
        ],
        onFilter: (value, record) => record.eventType.indexOf(value as string) === 0,
      },
      {
        title: "Creation Date",
        dataIndex: "eventCreationdate",
        key: "eventCreationdate",

        sorter: (a, b) => {
          if (a.eventCreationdate && b.eventCreationdate) {
            return a.eventCreationdate.getTime() - b.eventCreationdate.getTime();
          } else {
            return 0;
          }
        },
        render: (creationDate) => {
          return creationDate?.toLocaleString();
        },
      },

      {
        title: "Last Update Date",
        dataIndex: "eventLastUpdatedate",
        key: "eventLastUpdatedate",

        sorter: (a, b) => {
          if (a.eventLastUpdatedate && b.eventLastUpdatedate) {
            return a.eventLastUpdatedate.getTime() - b.eventLastUpdatedate.getTime();
          } else {
            return 0;
          }
        },
        render: (eventLastUpdatedate) => {
          return eventLastUpdatedate?.toLocaleString();
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
      // Additional columns specific to each event type
      // {
      //   title: 'Link',
      //   dataIndex: 'link',
      //   key: 'link',
      //   render: (link, record) => {
      //     if (record.type === 'document') {
      //       return link;
      //     }
      //     return null;
      //   },
      // },
      // {
      //     title: 'Deadline',
      //     dataIndex: 'deadline',
      //     key: 'deadline',
      //     render: (deadlineDate, record) => {
      //         if (record.type === 'document') {
      //           return deadlineDate?.toLocaleString();
      //         }
      //         return null;
      //       },
      //   },
      // {
      //   title: 'Virtual',
      //   dataIndex: 'virtual',
      //   key: 'virtual',
      //   render: (virtual, record) => {
      //     if (record.type === 'meeting' || record.type === 'activity') {
      //       return virtual.toString();
      //     }
      //     return null;
      //   },
      // },
      // {
      //   title: 'Location',
      //   dataIndex: 'location',
      //   key: 'location',
      //   render: (location, record) => {
      //     if (record.type === 'meeting' || record.type === 'activity') {
      //       return location;
      //     }
      //     return null;
      //   },
      // },
      // {
      //   title: 'Start Time',
      //   dataIndex: 'startTime',
      //   key: 'startTime',
      //   render: (startTime, record) => {
      //     if (record.type === 'meeting' || record.type === 'activity') {
      //       return startTime?.toLocaleString();
      //     }
      //     return null;
      //   },
      // },
      // {
      //   title: 'End Time',
      //   dataIndex: 'endTime',
      //   key: 'endTime',
      //   render: (endTime, record) => {
      //     if (record.type === 'meeting' || record.type === 'activity') {
      //       return endTime?.toLocaleString();
      //     }
      //     return null;
      //   },
      // },
      // {
      //     title: 'Note Link',
      //     dataIndex: 'noteLink',
      //     key: 'noteLink',
      //     render: (noteLink, record) => {
      //       if (record.type === 'meeting') {
      //         return noteLink;
      //       }
      //       return null;
      //     },
      // },
      // {
      //     title: 'Agenda Link',
      //     dataIndex: 'agendaLink',
      //     key: 'agendaLink',
      //     render: (agendaLink, record) => {
      //       if (record.type === 'meeting') {
      //         return agendaLink;
      //       }
      //       return null;
      //     },
      // },
      // {
      //     title: 'Meeting Type',
      //     dataIndex: 'meetingType',
      //     key: 'meetingType',
      //     render: (meetingType, record) => {
      //       if (record.type === 'meeting') {
      //         return meetingType;
      //       }
      //       return null;
      //     },
      // },
    ];

  return (
    <>
      <div className="mx-3 my-6 flex flex-col gap-3">
        <h2 className="text-xl font-bold m-auto">All Events</h2>
        <Table
          columns={columns}
          dataSource={eventList}
          scroll={{ x: 1000 }}
          loading={isTableLoading} 
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
        >
          {selectedEvent && (
            <div>
              <p className="text-sm">ID: {selectedEvent.eventId}</p>
              <p className="text-base">Title: {selectedEvent.eventTitle}</p>
              <p className="text-base">
                Description: {selectedEvent.eventDescription}
              </p>
              <p className="text-base">
                Created By: {selectedEvent.eventCreator}
              </p>
              {/* <p className="text-base">
                Creator from team: {selectedEvent.creationTeamName}
              </p> */}
              {/* Add more event-specific information */}
            </div>
          )}

          {selectedEvent?.eventType === "document" && (
            <div>
              {/* Display Document Event specific information */}
              <p className="text-base">
                Link: {(selectedEvent as IDocumentEvent).link}
              </p>
              <p className="text-base">
                Deadline Date:{" "}
                {(
                  selectedEvent as IDocumentEvent
                ).deadlineDate?.toLocaleString()}
              </p>
            </div>
          )}

          {selectedEvent?.eventType === "meeting" && (
            <div>
              {/* Display Meeting Event specific information */}
              <p className="text-base">
                Virtual:{" "}
                {(selectedEvent as IMeetingEvent).virtual ? "Yes" : "No"}
              </p>
              <p className="text-base">
                Location: {(selectedEvent as IMeetingEvent).location}
              </p>
              <p className="text-base">
                Start Time:{" "}
                {(selectedEvent as IMeetingEvent).startTime.toLocaleString()}
              </p>
              <p className="text-base">
                End Time:{" "}
                {(selectedEvent as IMeetingEvent).endTime.toLocaleString()}
              </p>
              <p className="text-base">
                Note Link: {(selectedEvent as IMeetingEvent).noteLink}
              </p>
              <p className="text-base">
                Agenda Link: {(selectedEvent as IMeetingEvent).agendaLink}
              </p>
              <p className="text-base">
                Meeting Type: {(selectedEvent as IMeetingEvent).meetingType}
              </p>
            </div>
          )}

          {selectedEvent?.eventType === "activity" && (
            <div>
              {/* Display Activity Event specific information */}
              <p className="text-base">
                Virtual:{" "}
                {(selectedEvent as IActivityEvent).virtual ? "Yes" : "No"}
              </p>
              <p className="text-base">
                Location: {(selectedEvent as IActivityEvent).location}
              </p>
              <p className="text-base">
                Start Time:{" "}
                {(selectedEvent as IActivityEvent).startTime.toLocaleString()}
              </p>
              <p className="text-base">
                End Time:{" "}
                {(selectedEvent as IActivityEvent).endTime.toLocaleString()}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </>
  );
}
