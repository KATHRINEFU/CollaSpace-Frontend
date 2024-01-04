import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Modal,
  Slider,
  DatePicker,
  notification,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadUserFile from "../../components/user/UploadUserFile";
import { useUser } from "../../hooks/useUser";
import {
  useGetEmployeeTeamsQuery,
  useGetAllEmployeesQuery,
} from "../../redux/user/userApiSlice";
import axios from "axios";

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
  const [, setError] = useState("");

  const { data: teams, isLoading } = useGetEmployeeTeamsQuery(user?.id);
  const { data: employees, isLoading: isEmployeesLoading } =
    useGetAllEmployeesQuery({});

  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

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
    const payload = {
      ticketCreator: user?.id,
      ticketTitle: values.title,
      ticketDescription: values.description,
      ticketPriority: values.priority,
      ticketFromTeam: values.fromTeam,
      ticketDueDate: values.dueDate,
      assigneeId: values.assignTo,
      viewerIds: values.viewers,
      supervisorIds: values.supervisors,
      files: uploadedUrls,
    };

    axios
      .post("/api/ticket/create", payload)
      .then((r) => {
        if (!r.data) {
          setError("Error: Ticket creation failed");
          return;
        }
        notification.success({
          type: "success",
          message: "Ticket Created successfully",
        });
        navigate("/user/dashboard");
      })
      .catch(() => {
        setError("Error: Ticket creation failed");
      });
  };

  const handleFileUploadComplete = (urls: string[]) => {
    setUploadedUrls(urls);
    // You can now use 'uploadedUrls' for further processing or sending to backend
  };

  return (
    <>
      <Form
        {...formItemLayout}
        form={form}
        onFinish={onFinish}
        scrollToFirstError
      >
        <div className="relative flex flex-col flex-auto min-w-0 p-4 mt-6 mx-3 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
          <h2 className="text-xl font-bold m-auto"> New Ticket</h2>
          <div className="h-px mx-6 my-4 justify-center bg-transparent border-0 opacity-25 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"></div>
          <Row gutter={24}>
            <Col span={2} />
            <Col span={10}>
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Ticket Title
                </p>

                <Form.Item
                  name="title"
                  rules={[
                    {
                      required: true,
                      message: "Please input your ticket title",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Ticket Description
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

              {/* current users teams*/}
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  From Team
                </p>
                <Form.Item
                  name="fromTeam"
                  rules={[
                    {
                      required: true,
                      message: "Please select the creation team",
                    },
                  ]}
                >
                  <Select loading={isLoading} placeholder="Select a team">
                    {teams &&
                      teams.map((team: any) => (
                        <Option key={team.teamId} value={team.teamId}>
                          {team.teamName}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              {/* all teams*/}
              {/* <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  To Team
                </p>
                <Form.Item name="toTeam">
                  <Select placeholder="Select a team">
                    <Option value="teamA">Team A</Option>
                    <Option value="teamB">Team B</Option>
                    <Option value="teamC">Team C</Option>
                  </Select>
                </Form.Item>
              </div> */}

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Ticket Priority
                </p>
                <Form.Item
                  name="priority"
                  rules={[
                    {
                      required: true,
                      message: "Please select the priority",
                    },
                  ]}
                >
                  <Slider min={1} max={5} marks={{ 1: 1, 5: 5 }} included />
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Ticket Due Date
                </p>
                <Form.Item name="dueDate">
                  <DatePicker className="w-full" />
                </Form.Item>
              </div>
            </Col>

            <Col span={10}>
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Assign To
                </p>
                <Form.Item
                  name="assignTo"
                  rules={[
                    {
                      required: true,
                      message: "Please select assignee",
                    },
                  ]}
                >
                  <Select
                    loading={isEmployeesLoading}
                    placeholder="Select an assignee"
                  >
                    {employees &&
                      employees.map((employee: any) => (
                        <Option
                          key={employee.employeeId}
                          value={employee.employeeId}
                        >
                          {employee.employeeFirstname}{" "}
                          {employee.employeeLastname}
                        </Option>
                      ))}
                  </Select>

                  {/* <AutoComplete
                    popupMatchSelectWidth={252}
                    style={{ width: 300 }}
                    options={employeeOptions}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    size="large"
                  >
                    <Input.Search
                      size="large"
                      placeholder="input here"
                      enterButton
                    />
                  </AutoComplete> */}
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Invite Viewers
                </p>
                <Form.Item name="viewers">
                  <Select
                    mode="multiple"
                    loading={isEmployeesLoading}
                    placeholder="Select viewers"
                  >
                    {employees &&
                      employees.map((employee: any) => (
                        <Option
                          key={employee.employeeId}
                          value={employee.employeeId}
                        >
                          {employee.employeeFirstname}{" "}
                          {employee.employeeLastname}
                        </Option>
                      ))}
                  </Select>
                  {/* <AutoComplete
                    options={employeeOptions}
                    onSearch={handleViewerSearch}
                    onSelect={handleSelectViewer}
                    placeholder="Search for users"
                    value={inputValue}
                  />
                  <div>
                    {selectedViewers.map((user) => (
                      <span key={user} className="selected-user">
                        {user}{" "}
                        <Button
                          type="link"
                          onClick={() => handleRemoveViewer(user)}
                        >
                          Remove
                        </Button>
                      </span>
                    ))}
                  </div> */}
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Invite Supervisors
                </p>
                <Form.Item name="supervisors">
                  <Select
                    mode="multiple"
                    loading={isEmployeesLoading}
                    placeholder="Select viewers"
                  >
                    {employees &&
                      employees.map((employee: any) => (
                        <Option
                          key={employee.employeeId}
                          value={employee.employeeId}
                        >
                          {employee.employeeFirstname}{" "}
                          {employee.employeeLastname}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Add Supporting Files
                </p>
                <UploadUserFile onUploadComplete={handleFileUploadComplete} />
              </div>
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
