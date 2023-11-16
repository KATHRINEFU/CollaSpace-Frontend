import { Table, Modal, Button, Tag, Tooltip, Form } from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { IDocumentEvent, IMeetingEvent, IActivityEvent } from "../../types";
import {
  useGetAllTeamsQuery,
  useGetEmployeeTeamsQuery,
} from "../../redux/api/apiSlice";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { mapEventDataToEvent, getEventTypeColor } from "../../utils/functions";
import EventDetail from "../../components/user/EventDetail";

export function Component() {
  // const maxRows = 10;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    IDocumentEvent | IMeetingEvent | IActivityEvent | null
  >(null);
  const { data: teams, isLoading: isTeamsLoading } =
    useGetEmployeeTeamsQuery(4);
  const { data: allTeams, isLoading: isAllTeamsLoading } = useGetAllTeamsQuery(
    {},
  );
  const [eventList, setEventList] = useState<
    (IDocumentEvent | IMeetingEvent | IActivityEvent)[]
  >([]);
  // const [eventsWithEmptyRows, setEventsWithEmptyRows]= useState<(IDocumentEvent | IMeetingEvent | IActivityEvent) []>([]);
  const [isTableLoading, setIsTableLoading] = useState(true); // Add loading state
  const [teamNameFilterArray, setTeamNameFilterArray] = useState<
    { text: string; value: string }[]
  >([]);
  const [allTeamIdAndNames, setAllTeamIdAndNames] = useState<
    { id: number; name: string }[]
  >([]);
  const [eventForm] = Form.useForm();
  eventForm.setFieldsValue(selectedEvent);

  dayjs.extend(customParseFormat);

  const showEventModal = (
    record: IDocumentEvent | IMeetingEvent | IActivityEvent,
  ) => {
    setSelectedEvent(record);
    setIsModalVisible(true);
  };

  useEffect(() => {
    if (!isAllTeamsLoading && allTeams) {
      allTeams.map((team: any) => {
        setAllTeamIdAndNames((prevList) => [
          ...prevList,
          { id: team.teamId, name: team.teamName },
        ]);
      });
    }
  }, [allTeams, isAllTeamsLoading]);

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
        setIsTableLoading(false);
      } catch (error) {
        console.error("Error fetching events in AllEvents:", error);
        setIsTableLoading(false);
      }
    };

    if (teams && !isTeamsLoading) {
      fetchEvents();
    }
  }, [teams, isTeamsLoading]);

  useEffect(() => {
    const uniqueTeamNames = new Set<string>();
    eventList.forEach((event) => {
      const teamName = event.team?.teamName;
      if (teamName) {
        uniqueTeamNames.add(teamName);
      }
    });

    setTeamNameFilterArray(
      Array.from(uniqueTeamNames).map((teamName) => ({
        text: teamName,
        value: teamName,
      })),
    );
  }, [eventList]);

  const columns: ColumnsType<IDocumentEvent | IMeetingEvent | IActivityEvent> =
    [
      {
        title: "Title",
        dataIndex: "eventTitle",
        key: "eventTitle",
        ellipsis: {
          showTitle: false,
        },
        render: (eventTitle) => (
          <Tooltip placement="topLeft" title={eventTitle}>
            {eventTitle}
          </Tooltip>
        ),
      },
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
        onFilter: (value, record) =>
          record.eventType.indexOf(value as string) === 0,
        render: (eventType) => (
          <Tag color={getEventTypeColor(eventType)} key={eventType}>
            {eventType.toUpperCase()}
          </Tag>
        ),
      },
      {
        title: "Created By Team",
        dataIndex: "team",
        key: "team",
        ellipsis: {
          showTitle: false,
        },
        filters: teamNameFilterArray,
        onFilter: (value, record) =>
          record.team?.teamName.indexOf(value as string) === 0,
        render: (team) => (
          <Tooltip placement="topLeft" title={team.teamName}>
            {team.teamName}
          </Tooltip>
        ),
      },
      {
        title: "Cross-Team",
        dataIndex: "collaborations",
        key: "collaborations",
        filters: [
          {
            text: "Yes",
            value: "Yes",
          },
          {
            text: "No",
            value: "No",
          },
        ],
        onFilter: (value, record) => {
          if ("Yes".indexOf(value as string)) {
            return record.collaborations.length > 0;
          } else if ("No".indexOf(value as string)) {
            return record.collaborations.length === 0;
          }
          return false;
        },
        render: (collaborations) => {
          return collaborations.length ? "Yes" : "No";
        },
      },

      {
        title: "Status",
        dataIndex: "eventExpired",
        key: "eventExpired",
        filters: [
          {
            text: "Ongoing",
            value: "Ongoing",
          },
          {
            text: "Expired",
            value: "Expired",
          },
        ],
        onFilter: (value, record) => {
          if ("Ongoing".indexOf(value as string)) {
            return record.eventExpired === true;
          } else if ("Expired".indexOf(value as string)) {
            return record.eventExpired === false;
          }
          return false;
        },
        render: (eventExpired) => {
          return eventExpired ? "Expired" : "Ongoing";
        },
      },
      {
        title: "Last Update Date",
        dataIndex: "eventLastUpdatedate",
        key: "eventLastUpdatedate",

        sorter: (a, b) => {
          if (a.eventLastUpdatedate && b.eventLastUpdatedate) {
            return (
              a.eventLastUpdatedate.getTime() - b.eventLastUpdatedate.getTime()
            );
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
          record.eventId ? (
            <a onClick={() => showEventModal(record)}>View</a>
          ) : null,
      },
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
            <EventDetail
              selectedEvent={selectedEvent}
              allTeamIdAndNames={allTeamIdAndNames}
            />
          )}
        </Modal>
      </div>
    </>
  );
}
