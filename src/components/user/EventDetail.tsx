import {
  Form,
  Input,
  Divider,
  DatePicker,
  TimePicker,
  Switch,
  Select,
  List,
  Button,
  notification
} from "antd";
import { useState, useEffect } from "react";
import { IActivityEvent, IDocumentEvent, IEventCollaboration, IMeetingEvent } from "../../types";
import { getEventTypeColor } from "../../utils/functions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import TeamSearchAutocomplete from "./TeamSearchAutocomplete";
import { useGetAllTeamsQuery } from "../../redux/user/userApiSlice";
import { useUser } from "../../hooks/useUser";
import axios from "axios";

interface EventDetailProps {
  selectedEvent: IDocumentEvent | IActivityEvent | IMeetingEvent;
}

const EventDetail: React.FC<EventDetailProps> = ({
  selectedEvent,
}) => {
  const user = useUser();
    const [allTeamIdAndNames, setAllTeamIdAndNames] = useState<
    { id: number; name: string }[]
  >([]);
  const [, setError] = useState("");
  const [creatorAndSupervisorIds, setCreatorAndSupervisorIds] = useState<{teamId: number, ids: number[]}[]>([]);
  const [isEditting, setIsEditting] = useState<boolean>(false);

   const { data: allTeams, isLoading: isAllTeamsLoading } = useGetAllTeamsQuery(
        {},
      );

  const isUserCreatorOrSupervisor = (collaboration: IEventCollaboration) => {
    const teamId = collaboration.team.teamId;
    // Find the object that matches the teamId in the state array
    const teamObj = creatorAndSupervisorIds.find(item => item.teamId === teamId);
    // If the teamObj exists, check if user ID is in the ids array for that team
    if(user?.id){
      return teamObj?.ids.includes(user?.id) ?? false;
    }
    return false;
  };

    const handleAcceptEventCollaboration = (collaboration: IEventCollaboration) => {
      console.log(collaboration);
    } 

    const handleEditBtnClicked = () => {
      setIsEditting(true);
    };
  
    const handleCancelBtnClicked = () => {
      setIsEditting(false);
    };

    const handleEditEvent = (values: any) => {
      console.log(values);

      const {
        eventDescription,
        documentLink,
        deadline,
        meetingVirtual,
        meetingLocation,
        meetingLink,
        meetingNoteLink,
        meetingAgendaLink,
        meetingType,
        activityVirtual,
        activityLocation,
      } = values;


      let payload: any = {
        eventDescription,
        eventType: selectedEvent.eventType,
        documentLink: '',
        deadline: null,
        meetingVirtual: false,
        meetingLocation: '',
        startTime: null,
        endTime: null,
        meetingLink: '',
        meetingNoteLink: '',
        meetingAgendaLink: '',
        meetingType: '',
        activityVirtual: false,
        activityLocation: '',
      };

      if(selectedEvent?.eventType === 'document'){
        payload = {
          ...payload,
          documentLink,
          deadline,
        }
      }
      else if (selectedEvent?.eventType === 'meeting') {
        payload = {
          ...payload,
          meetingVirtual,
          meetingLocation,
          meetingLink,
          meetingNoteLink,
          meetingAgendaLink,
          meetingType,
        };
      } else if (selectedEvent?.eventType === 'activity') {
        payload = {
          ...payload,
          activityVirtual,
          activityLocation,
        };
      }

      axios
      .put("/api/event/edit/"+ selectedEvent.eventId, payload)
      .then((r) => {
        if(!r.data){
          setError("Error: Event edit failed");
          return;
        }
        notification.success({
          type: "success",
          message: "Event edit success",
        });

        setIsEditting(false);

      })
      .catch(() => {
        setError("Error: Event edit failed");
      });

    }

    useEffect(() => {
      const fetchCreatorAndSupervisors = async () => {
        try {
          const collaborationPromises = selectedEvent.collaborations.map(async (collaboration) => {
            const teamId = collaboration.team.teamId;
            try {
              const response = await axios.get(`/api/team/getCreatorandSupervisor/${teamId}`);
              return { teamId: teamId, ids: response.data?.ids ?? [] };
            } catch (error) {
              console.error('Error fetching creator and supervisor IDs for team:', teamId, error);
              return { teamId: teamId, ids: [] };
            }
          });
    
          const collaborationIds = await Promise.all(collaborationPromises);
          setCreatorAndSupervisorIds(collaborationIds);
        } catch (error) {
          console.error('Error fetching creator and supervisor IDs:', error);
        }
      };
    
      fetchCreatorAndSupervisors();
    }, [selectedEvent.collaborations]);


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

  dayjs.extend(customParseFormat);
  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = 'HH:mm:ss';

  const { Option } = Select;

  const isAllowEdit = (selectedEvent.eventCreator === user?.id) && isEditting;

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
      <Form 
        form={eventForm}
        onFinish={handleEditEvent}
        >
        {selectedEvent && (
          <div>
            <Form.Item name="eventTitle" label="Title">
              <Input disabled />
            </Form.Item>
            <Form.Item name="eventDescription" label="Description">
              <Input.TextArea rows={4} disabled = {!isAllowEdit} />
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
              <Input disabled = {!isAllowEdit} />
            </Form.Item>

            <span>Deadline: </span>
            <DatePicker
              defaultValue={dayjs(
                (
                  selectedEvent as IDocumentEvent
                ).deadlineDate?.toLocaleString(),
                dateFormat,
              )}
              disabled = {!isAllowEdit}
            />
            <span> </span>
            <TimePicker
              defaultValue={dayjs(
                (
                  selectedEvent as IDocumentEvent
                ).deadlineDate?.toLocaleString(),
                timeFormat,
              )}
              disabled = {!isAllowEdit}
            />

            <div className="flex mt-3 gap-3 items-center justify-center">
              {isEditting ? (
                <Button type="primary" onClick={handleCancelBtnClicked}>
                Cancel
                </Button>
              ) : (

              <Button type="primary" onClick={handleEditBtnClicked}>
              Edit
              </Button>
                
              )}
              
              <Button htmlType="submit" type="primary" disabled={!isEditting}>
                Save
              </Button>
            </div>
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
              <Form.Item name="meetingVirtual" valuePropName="checked">
                <Switch
                  checked={(selectedEvent as IActivityEvent)?.virtual || false} // Set default to false if undefined
                  disabled={!isAllowEdit}
                />
              </Form.Item>
            </div>

            <Form.Item name="meetingLocation" label="location">
              <Input disabled = {!isAllowEdit} />
            </Form.Item>

            {/*TODO: timeformat */}

            <Form.Item name={"startTime"} label="Start Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).startTime,
                )}
                format={dateFormat}
                disabled = {!isAllowEdit}
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).startTime
                )}
                format={timeFormat}
                disabled = {!isAllowEdit}
              />
            </Form.Item>

            <Form.Item name={"endTime"} label="End Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).endTime,
                )}
                format={dateFormat}
                disabled = {!isAllowEdit}
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IMeetingEvent).endTime,
                )}
                disabled = {!isAllowEdit}
                format={timeFormat}
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

            <Form.Item name="meetingNoteLink" label="Note Link">
              <Input disabled = {!isAllowEdit} />
            </Form.Item>

            <Form.Item name="meetingAgendaLink" label="Agenda Link">
              <Input disabled = {!isAllowEdit} />
            </Form.Item>

            <Form.Item name="meetingType" label="Meeting Type">
              <Select disabled = {!isAllowEdit}>
                <Option value="business">Business</Option>
                <Option value="internal">Internal</Option>
                <Option value="casual">Casual</Option>
              </Select>
            </Form.Item>

            <div className="flex mt-3 gap-3 items-center justify-center">
              {isEditting ? (
                <Button type="primary" onClick={handleCancelBtnClicked}>
                Cancel
                </Button>
              ) : (

              <Button type="primary" onClick={handleEditBtnClicked}>
              Edit
              </Button>
                
              )}
              
              <Button htmlType="submit" type="primary" disabled={!isEditting}>
                Save
              </Button>
            </div>

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
              <Form.Item name="activityVirtual" valuePropName="checked">
                <Switch
                  defaultChecked={(selectedEvent as IActivityEvent).virtual}
                  disabled = {!isAllowEdit}
                />
              </Form.Item>
            </div>

            <Form.Item name="activityLocation" label="location">
              <Input disabled = {!isAllowEdit} />
            </Form.Item>

            {/*TODO: timeformat */}
            <Form.Item name={"startTime"} label="Start Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).startTime,
                )}
                format={dateFormat}
                disabled = {!isAllowEdit}
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).startTime,
                )}
                format={timeFormat}
                disabled = {!isAllowEdit}
              />
            </Form.Item>

            <Form.Item name={"endTime"} label="End Time">
              <DatePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).endTime,
                )}
                format={dateFormat}
                disabled = {!isAllowEdit}
              />
              <span> </span>
              <TimePicker
                defaultValue={dayjs(
                  (selectedEvent as IActivityEvent).endTime,
                )}
                format={timeFormat}
                disabled = {!isAllowEdit}
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

            <div className="flex mt-3 gap-3 items-center justify-center">
              {isEditting ? (
                <Button type="primary" onClick={handleCancelBtnClicked}>
                Cancel
                </Button>
              ) : (

              <Button type="primary" onClick={handleEditBtnClicked}>
              Edit
              </Button>
                
              )}
              
              <Button htmlType="submit" type="primary" disabled={!isEditting}>
                Save
              </Button>
            </div>

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
                ) : isUserCreatorOrSupervisor(collaboration) ? ( // Check if the user is creator or supervisor
                <button
                  className="w-24 h-6 mb-3 rounded text-center text-sm bg-blue-200"
                  onClick={() => handleAcceptEventCollaboration(collaboration)} // handleAccept function for the Accept action
                >
                  Accept
                </button>
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
