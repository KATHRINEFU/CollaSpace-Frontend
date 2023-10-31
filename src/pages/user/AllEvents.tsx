import { Table, Modal, Button, Tag, Tooltip, Form, Input, Divider, DatePicker, TimePicker, Switch, Select, List} from "antd";
import { useEffect, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { IDocumentEvent, IMeetingEvent, IActivityEvent } from "../../types";
import { useGetAllTeamsQuery, useGetEmployeeTeamsQuery } from "../../redux/api/apiSlice";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import TeamSearchAutocomplete from "../../components/user/TeamSearchAutocomplete";
import { mapEventDataToEvent, getEventTypeColor } from "../../utils/functions";

export function Component() {
  // const maxRows = 10;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<
    IDocumentEvent | IMeetingEvent | IActivityEvent | null
  >(null);
  const { data: teams, isLoading: isTeamsLoading} = useGetEmployeeTeamsQuery(4);
  const {data: allTeams, isLoading: isAllTeamsLoading} = useGetAllTeamsQuery({});
  const [eventList, setEventList] = useState< (IDocumentEvent | IMeetingEvent | IActivityEvent) []>([]);
  // const [eventsWithEmptyRows, setEventsWithEmptyRows]= useState<(IDocumentEvent | IMeetingEvent | IActivityEvent) []>([]);
  const [isTableLoading, setIsTableLoading] = useState(true); // Add loading state
  const [teamNameFilterArray, setTeamNameFilterArray] = useState<{text:string, value: string}[]>([]);
  const [allTeamIdAndNames, setAllTeamIdAndNames] = useState<{'id': number, 'name': string}[]>([]);
  const [eventForm] = Form.useForm();
  eventForm.setFieldsValue(selectedEvent);

  dayjs.extend(customParseFormat);
  const dateFormat = 'M/D/YYYY hh:mm:ss A';
  const timeFormat = 'h:mm A';

  const { Option } = Select;


  const showEventModal = (
    record: IDocumentEvent | IMeetingEvent | IActivityEvent,
  ) => {
    setSelectedEvent(record);
    setIsModalVisible(true);
  };

  useEffect(()=> {
    if(!isAllTeamsLoading && allTeams){
      allTeams.map((team: any)=> {
        setAllTeamIdAndNames((prevList)=> [...prevList, {'id': team.teamId, 'name': team.teamName}]);
      })
    }

  }, [allTeams, isAllTeamsLoading])

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
    const uniqueTeamNames = new Set<string>();
    eventList.forEach((event) => {
      const teamName = event.team?.teamName;
      if (teamName) {
        uniqueTeamNames.add(teamName);
      }
    });

    setTeamNameFilterArray(Array.from(uniqueTeamNames).map((teamName) => ({
      text: teamName,
      value: teamName,
    })));
  }, [eventList])

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
        onFilter: (value, record) => record.eventType.indexOf(value as string) === 0,
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
        onFilter: (value, record) => record.team?.teamName.indexOf(value as string) === 0,
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
            "text": "Yes",
            "value": "Yes",
          },
          {
            "text": "No",
            "value": "No",
          }
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
          return collaborations.length? "Yes": "No"
        }
      },

      {
        title: "Status",
        dataIndex: "eventExpired",
        key: "eventExpired",
        filters: [
          {
            "text": "Ongoing",
            "value": "Ongoing",
          },
          {
            "text": "Expired",
            "value": "Expired",
          }
        ],
        onFilter: (value, record) => {
          if ("Ongoing".indexOf(value as string)) {
            return record.eventExpired===true;
          } else if ("Expired".indexOf(value as string)) {
            return record.eventExpired===false;
          }
          return false;
        },
        render: (eventExpired) => {
          return eventExpired? "Expired": "Ongoing"
        }
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
          record.eventId ? <a onClick={() => showEventModal(record)}>View</a> : null,
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
          <div className="w-full h-2 mb-3 rounded text-center text-sm"
          style={{
            backgroundColor: selectedEvent? getEventTypeColor(selectedEvent.eventType): "white",
          }}
          />
          <Form form={eventForm}>
            {selectedEvent && (
              <div>
                <Form.Item name="eventTitle" label="Title">
                  <Input disabled />
                </Form.Item>
                <Form.Item name="eventDescription" label="Description">
                  <Input.TextArea rows={4} disabled />
                </Form.Item>
                <p className="">
                  Created By Team: {selectedEvent.team?.teamName}
                </p>

                <p className="">
                  Creation Time: {selectedEvent.eventCreationdate?.toLocaleString()}
                </p>

                <p className="">
                  Last Update Time: {selectedEvent.eventLastUpdatedate?.toLocaleString()}
                </p>
              </div>
            )}

            <Divider>{selectedEvent?.eventType.toUpperCase()} Specific Info</Divider>

            {selectedEvent?.eventType === "document" && (
              <div>
                {/* Display Document Event specific information */}
                <Form.Item name="link" label="Link">
                  <Input disabled />
                </Form.Item>

                <span>Deadline: </span>
                <DatePicker 
                  defaultValue={dayjs((selectedEvent as IDocumentEvent).deadlineDate?.toLocaleString(), dateFormat)} 
                  disabled />
                <span>    </span>
                <TimePicker
                  defaultValue={dayjs((selectedEvent as IDocumentEvent).deadlineDate?.toLocaleString(), timeFormat)}
                  disabled
                />
              </div>
            )}

            {selectedEvent?.eventType === "meeting" && (
              <div>
                {/* Display Meeting Event specific information */}
                <div className="flex gap-3 items-center">
                  <p className="">
                    Virtual:{" "}
                    {(selectedEvent as IActivityEvent).virtual ? "Yes" : "No"}
                  </p>
                  <Form.Item name="virtual" valuePropName="checked">
                    <Switch defaultChecked={(selectedEvent as IActivityEvent).virtual} disabled/>
                  </Form.Item>
                </div>
                
                <Form.Item name="location" label="location">
                  <Input disabled />
                </Form.Item>

                {/*TODO: timeformat */}
                <Form.Item name={"startTime"} label="Start Time">
                  <DatePicker 
                    defaultValue={dayjs((selectedEvent as IMeetingEvent).startTime?.toLocaleString(), dateFormat)} 
                    disabled />
                  <span>    </span>
                  <TimePicker
                    defaultValue={dayjs((selectedEvent as IMeetingEvent).startTime?.toLocaleString(), timeFormat)}
                    disabled
                  />
                </Form.Item>

                <Form.Item name={"endTime"} label = "End Time">
                  <DatePicker 
                    defaultValue={dayjs((selectedEvent as IMeetingEvent).endTime?.toLocaleString(), dateFormat)} 
                    disabled />
                  <span>    </span>
                  <TimePicker
                    defaultValue={dayjs((selectedEvent as IMeetingEvent).endTime?.toLocaleString(), timeFormat)}
                    disabled
                  />
                </Form.Item>

                {/* <p className="">
                  Start Time:{" "}
                  {(selectedEvent as IMeetingEvent).startTime.toLocaleString()}
                </p>
                <p className="">
                  End Time:{" "}
                  {(selectedEvent as IMeetingEvent).endTime.toLocaleString()}
                </p> */}

                <Form.Item name="noteLink" label="Note Link">
                  <Input disabled />
                </Form.Item>

                <Form.Item name="agendaLink" label="Agenda Link">
                  <Input disabled />
                </Form.Item>

                <Form.Item name="meetingType" label="Meeting Type">
                  <Select disabled>
                    <Option value="document">Business</Option>
                    <Option value="meeting">Internal</Option>
                    <Option value="activity">Casual</Option>
                  </Select>
                </Form.Item>
              </div>
            )}

            {selectedEvent?.eventType === "activity" && (
              <div>
                {/* Display Activity Event specific information */}
                <div className="flex gap-3 items-center">
                  <p className="">
                    Virtual:{" "}
                    {(selectedEvent as IActivityEvent).virtual ? "Yes" : "No"}
                  </p>
                  <Form.Item name="virtual" valuePropName="checked">
                    <Switch defaultChecked={(selectedEvent as IActivityEvent).virtual} disabled/>
                  </Form.Item>
                </div>
                
                <Form.Item name="location" label="location">
                  <Input disabled />
                </Form.Item>

                {/*TODO: timeformat */}
                <Form.Item name={"startTime"} label="Start Time">
                  <DatePicker 
                    defaultValue={dayjs((selectedEvent as IActivityEvent).startTime?.toLocaleString(), dateFormat)} 
                    disabled />
                  <span>    </span>
                  <TimePicker
                    defaultValue={dayjs((selectedEvent as IActivityEvent).startTime?.toLocaleString(), timeFormat)}
                    disabled
                  />
                </Form.Item>

                <Form.Item name={"endTime"} label = "End Time">
                  <DatePicker 
                    defaultValue={dayjs((selectedEvent as IActivityEvent).endTime?.toLocaleString(), dateFormat)} 
                    disabled />
                  <span>    </span>
                  <TimePicker
                    defaultValue={dayjs((selectedEvent as IActivityEvent).endTime?.toLocaleString(), timeFormat)}
                    disabled
                  />
                </Form.Item>
               

                {/* <p className="text-base">
                  Start Time:{" "}
                  {(selectedEvent as IActivityEvent).startTime.toLocaleString()}
                </p>
                <p className="text-base">
                  End Time:{" "}
                  {(selectedEvent as IActivityEvent).endTime.toLocaleString()}
                </p> */}
              </div>
            )}

            <Divider>Collaboration Specific Info</Divider>
            {selectedEvent?.collaborations.length===0
            ? (
              <div className="flex flex-col justify-center">
                <p>This event has no collaborations</p>
              </div>
              
            )
            : (
              <List
                itemLayout="horizontal"
                dataSource={selectedEvent?.collaborations}
                renderItem={(collaboration) => (
                  <List.Item>
                    <List.Item.Meta
                      title={collaboration.team.teamName}
                      description={
                        `
                         Role: ${collaboration.teamRole}, 
                         Accept Status: ${collaboration.acceptStatus ? 'Joined' : 'Pending Acceptance'
                      }`}
                    />
                    {collaboration.acceptStatus ? (
                      <div className="w-24 h-6 mb-3 rounded text-center text-sm bg-orange-100">
                        Joined
                      </div>
                    ): (

                      <div className="w-24 h-6 mb-3 rounded text-center text-sm bg-lime-100">
                        Pending Acceptance
                      </div>
                    )}
                    
                  </List.Item>
                )}
              />
              
            )

            
          }
            <p>Add More Teams to Collaborate:</p>
            <TeamSearchAutocomplete allTeamIdAndNames={allTeamIdAndNames}/>
          </Form>
          
        </Modal>
      </div>
    </>
  );
}
