import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Switch,
  DatePicker,
  TimePicker,
  Modal,
  Radio,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import { useGetEmployeeTeamsQuery, useGetAllTeamsQuery } from "../../redux/user/userApiSlice";
import moment from 'moment';
import axios from 'axios';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

export function Component() {
  const user = useUser();
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();

  const { data: teams, isLoading } = useGetEmployeeTeamsQuery(user?.id);
  const { data: allTeams, isLoading: isAllTeamsLoading} = useGetAllTeamsQuery({});

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [eventType, setEventType] = useState("");
  const [eventScope, setEventScope] = useState(1);
  const [, setError] = useState("");

  const handleChangeEventType = (value: string) => {
    setEventType(value);
    form.setFieldValue("type", value);
  };

  const handleCancelCreateEvent = () => {
    setIsConfirmModalVisible(true);
  };

  const handleConfirmCancel = () => {
    setIsConfirmModalVisible(false);
    navigate("/user/dashboard/");
  };

  const handleContinue = () => {
    setIsConfirmModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);

    const collaborations = values.inviteTeams ? values.inviteTeams.map((teamId:number) => ({
      teamId: teamId,
      teamRole: "collaborator",
      acceptStatus: 0
    })) : [];
  

    const combineDateAndTime = (date: moment.Moment | null, time: moment.Moment | null) => {
      if (date && time) {
        return date.clone().set({
          hour: time.get('hour'),
          minute: time.get('minute'),
          second: time.get('second'),
        });
      }
      return null;
    };
  
    // Combine the date with start and end times
    const combinedStartTime = combineDateAndTime(values.date, values.startTime);
    const combinedEndTime = combineDateAndTime(values.date, values.endTime);
  

    const commonPayload = {
      eventCreationTeamId: values.creationTeam,
      eventCreator: user?.id,
      eventType: values.type,
      eventTitle: values.title,
      eventDescription: values.description,
      eventExpired: false,
      collaborations: collaborations,
    };

    let payload = {};
    switch(values.type){
      case "document":
        payload = {...commonPayload, 
          documentLink: values.link,
          deadline: values.deadlineDate,
        };
        break;
      case "meeting":
        payload = {...commonPayload, 
          meetingVirtual: values.virtual,
          meetingLocation: values.location,
          meetingLink: values.link,
          meetingStarttime: combinedStartTime ? combinedStartTime.toISOString() : null,
          meetingEndtime: combinedEndTime ? combinedEndTime.toISOString() : null,
          meetingNoteLink: values.noteLink,
          meetingAgendaLink: values.agendaLink,
          meetingType: values.meetingType,
        };
        break;
      case "activity":
        payload = {...commonPayload,
          activityVirtual: values.virtual,
          activityLocation: values.location,
          activityStarttime: combinedStartTime ? combinedStartTime.toISOString() : null,
          activityEndtime: combinedEndTime ? combinedEndTime.toISOString() : null,
        }
    }

    console.log("payload:", payload);
    axios
    .post("/api/event/add", payload)
    .then((r) => {
      if(!r.data){
        setError("Error: Event creation failed");
        return;
      }
      notification.success({
        type: "success",
        message: "Event Created successfully",
      });
      navigate("/user/dashboard");
    })
    .catch(() => {
      setError("Error: Event creation failed");
    });

  };

  const handleEventScopeChange = (e: any) => {
    setEventScope(e.target.value);
  };

  // TODO: add choice: internal/collaboration
  // if collaboration, invite other teams
  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        scrollToFirstError
      >
        <div className="relative flex flex-col flex-auto min-w-0 p-4 mt-6 mx-3 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
          <h2 className="text-xl font-bold m-auto"> New Event</h2>
          <div className="h-px mx-6 my-4 justify-center bg-transparent border-0 opacity-25 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"></div>
          <Row gutter={24}>
            <Col span={2} />
            <Col span={10}>
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Event Title
                </p>

                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your event title",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Event Description
                </p>
                <Form.Item
                  name="description"
                  rules={[
                    { required: true, message: "Please input description" },
                  ]}
                >
                  <Input.TextArea rows={4} showCount maxLength={200} />
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Event Scope
                </p>
                <Form.Item
                  name="eventScope"
                  rules={[
                    {
                      required: true,
                      message: "Please select the event scope",
                    },
                  ]}
                >
                  <Radio.Group onChange={handleEventScopeChange}>
                    <Radio value={1}>Within One Team</Radio>
                    <Radio value={2}>Cross Team Collaboration</Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
                
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Within Team
                </p>
                <Form.Item
                  name="creationTeam"
                  rules={[
                    {
                      required: true,
                      message: "Please select the creation team",
                    },
                  ]}
                >
                  <Select 
                    loading = {isLoading}
                    placeholder="Select a team">
                      {teams && teams.map((team: any) => (
                        <Option key={team.teamId} value={team.teamId}>
                          {team.teamName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              {eventScope === 2 && (
                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Invite Team
                    </p>
                    <Form.Item
                      name="inviteTeams"
                      rules={[
                        {
                          required: true,
                          message: "Please select the creation team",
                        },
                      ]}
                    >
                      <Select 
                        mode="multiple"
                        loading = {isAllTeamsLoading}
                        placeholder="Select a team">
                          {allTeams && allTeams.map((team: any) => (
                            <Option key={team.teamId} value={team.teamId}>
                              {team.teamName}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                </div>
              )}
              

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Event Type
                </p>
                <Form.Item
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: "Please select the event type",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select an event type"
                    onChange={handleChangeEventType}
                  >
                    <Option value="document">Document</Option>
                    <Option value="meeting">Meeting</Option>
                    <Option value="activity">Activity</Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>

            <Col span={10}>
              {eventType === "document" && (
                <>
                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Link
                    </p>
                    <Form.Item name="link">
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Deadline
                    </p>
                    <Form.Item name="deadlineDate">
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </div>
                </>
              )}

              {eventType === "meeting" && (
                <>
                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Virtual
                    </p>
                    <Form.Item name="virtual" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Location
                    </p>
                    <Form.Item name="location">
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Link
                    </p>
                    <Form.Item name="link">
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Date
                    </p>
                    <Form.Item name="date">
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </div>

                  <div className="flex w-full">
                    <div>
                      <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                        Start Time
                      </p>
                      <Form.Item name="startTime">
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                    </div>

                    <div>
                      <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                        End Time
                      </p>
                      <Form.Item name="endTime">
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                    </div>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Note Link
                    </p>
                    <Form.Item name="noteLink">
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Agenda Link
                    </p>
                    <Form.Item name="agendaLink">
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Meeting Type
                    </p>
                    <Form.Item name="meetingType">
                      <Select placeholder="Select a meeting type">
                        <Option value="business">Business</Option>
                        <Option value="internal">Internal</Option>
                        <Option value="casual">Casual</Option>
                      </Select>
                    </Form.Item>
                  </div>
                </>
              )}

              {eventType === "activity" && (
                <>
                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Virtual
                    </p>
                    <Form.Item name="virtual" valuePropName="checked">
                      <Switch />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Location
                    </p>
                    <Form.Item name="location">
                      <Input />
                    </Form.Item>
                  </div>

                  <div>
                    <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                      Date
                    </p>
                    <Form.Item name="date">
                      <DatePicker className="w-full" />
                    </Form.Item>
                  </div>

                  <div className="flex w-full">
                    <div>
                      <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                        Start Time
                      </p>
                      <Form.Item name="startTime">
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                    </div>

                    <div>
                      <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                        End Time
                      </p>
                      <Form.Item name="endTime">
                        <TimePicker format="HH:mm" />
                      </Form.Item>
                    </div>
                  </div>
                </>
              )}
            </Col>

            <Col span={2} />
          </Row>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              className="mr-3"
              onClick={handleCancelCreateEvent}
            >
              Cancel
            </Button>

            <Modal
              title="Confirm Cancel"
              open={isConfirmModalVisible}
              cancelButtonProps={{ style: { display: "none" } }}
              footer={[
                <Button key="cancel" onClick={handleContinue}>
                  No, Continue
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={handleConfirmCancel}
                >
                  Yes, Cancel
                </Button>,
              ]}
            >
              Are you sure you want to cancel creating the event?
            </Modal>
            <Button type="primary" htmlType="submit" className="ml-3">
              Create
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}
