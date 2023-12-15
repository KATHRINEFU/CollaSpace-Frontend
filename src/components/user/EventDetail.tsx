import {
  Form,
  Input,
  Divider,
  DatePicker,
  TimePicker,
  Switch,
  Select,
  List,
} from "antd";
import { useState, useEffect } from "react";
import { IActivityEvent, IDocumentEvent, IMeetingEvent } from "../../types";
import { getEventTypeColor } from "../../utils/functions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TeamSearchAutocomplete from "./TeamSearchAutocomplete";
import { useGetAllTeamsQuery } from "../../redux/user/userApiSlice";

interface EventDetailProps {
  selectedEvent: IDocumentEvent | IActivityEvent | IMeetingEvent;
}

const EventDetail: React.FC<EventDetailProps> = ({
  selectedEvent,
}) => {
    const [allTeamIdAndNames, setAllTeamIdAndNames] = useState<
    { id: number; name: string }[]
  >([]);
   const { data: allTeams, isLoading: isAllTeamsLoading } = useGetAllTeamsQuery(
        {},
      );

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

  const [eventForm] = Form.useForm();
  eventForm.setFieldsValue(selectedEvent);

//   console.log(selectedEvent);

  dayjs.extend(customParseFormat);
  const dateFormat = "M/D/YYYY hh:mm:ss A";
  const timeFormat = "h:mm A";

  const { Option } = Select;

  return (
    <div>
      <div
        className="w-full h-2 mb-3 rounded text-center text-sm"
        style={{
          backgroundColor: selectedEvent
            ? getEventTypeColor(selectedEvent.eventType)
            : "white",
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
            <p className="">Created By Team: {selectedEvent.team?.teamName}</p>

            <p className="">
              Creation Time: {selectedEvent.eventCreationdate?.toLocaleString()}
            </p>

            <p className="">
              Last Update Time:{" "}
              {selectedEvent.eventLastUpdatedate?.toLocaleString()}
            </p>
          </div>
        )}

        <Divider>
          {selectedEvent?.eventType.toUpperCase()} Specific Info
        </Divider>

        {selectedEvent?.eventType === "document" && (
          <div>
            {/* Display Document Event specific information */}
            <Form.Item name="documentLink" label="Link">
              <Input disabled />
            </Form.Item>

            <span>Deadline: </span>
            <DatePicker
              defaultValue={dayjs(
                (
                  selectedEvent as IDocumentEvent
                ).deadlineDate?.toLocaleString(),
                dateFormat,
              )}
              disabled
            />
            <span> </span>
            <TimePicker
              defaultValue={dayjs(
                (
                  selectedEvent as IDocumentEvent
                ).deadlineDate?.toLocaleString(),
                timeFormat,
              )}
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
                <Switch
                  defaultChecked={(selectedEvent as IActivityEvent).virtual}
                  disabled
                />
              </Form.Item>
            </div>

            <Form.Item name="meetingLocation" label="location">
              <Input disabled />
            </Form.Item>

            {/*TODO: timeformat */}
            <Form.Item name={"startTime"} label="Start Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).startTime?.toLocaleString(),
                  dateFormat,
                )}
                disabled
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).startTime?.toLocaleString(),
                  timeFormat,
                )}
                disabled
              />
            </Form.Item>

            <Form.Item name={"endTime"} label="End Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).endTime?.toLocaleString(),
                  dateFormat,
                )}
                disabled
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).endTime?.toLocaleString(),
                  timeFormat,
                )}
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
                <Switch
                  defaultChecked={(selectedEvent as IActivityEvent).virtual}
                  disabled
                />
              </Form.Item>
            </div>

            <Form.Item name="activityLocation" label="location">
              <Input disabled />
            </Form.Item>

            {/*TODO: timeformat */}
            <Form.Item name={"startTime"} label="Start Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).startTime?.toLocaleString(),
                  dateFormat,
                )}
                disabled
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).startTime?.toLocaleString(),
                  timeFormat,
                )}
                disabled
              />
            </Form.Item>

            <Form.Item name={"endTime"} label="End Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).endTime?.toLocaleString(),
                  dateFormat,
                )}
                disabled
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).endTime?.toLocaleString(),
                  timeFormat,
                )}
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
        {selectedEvent?.collaborations.length === 0 ? (
          <div className="flex flex-col justify-center">
            <p>This event has no collaborations</p>
          </div>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={selectedEvent?.collaborations}
            renderItem={(collaboration) => (
              <List.Item>
                <List.Item.Meta
                  title={collaboration.team.teamName}
                  description={`
                         Role: ${collaboration.teamRole}, 
                         Accept Status: ${
                           collaboration.acceptStatus
                             ? "Joined"
                             : "Pending Acceptance"
                         }`}
                />
                {collaboration.acceptStatus ? (
                  <div className="w-24 h-6 mb-3 rounded text-center text-sm bg-orange-100">
                    Joined
                  </div>
                ) : (
                  <div className="w-24 h-6 mb-3 rounded text-center text-sm bg-lime-100">
                    Pending Acceptance
                  </div>
                )}
              </List.Item>
            )}
          />
        )}
        <p>Add More Teams to Collaborate:</p>
        <TeamSearchAutocomplete allTeamIdAndNames={allTeamIdAndNames} />
      </Form>
    </div>
  );
};

export default EventDetail;
