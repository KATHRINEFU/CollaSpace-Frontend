import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Modal,
  Slider,
  AutoComplete,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SelectProps } from "antd/es/select";
import UploadUserFile from "../../components/user/UploadUserFile";

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

const fakeUsers = ["User1", "User2", "User3", "User4", "User5"];

export function Component() {
  const [form] = Form.useForm();
  const { Option } = Select;
  const navigate = useNavigate();
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [selectedViewers, setSelectedViewers] = useState<string[]>([]);
  const [searchViewerResults, setSearchViewerResults] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const getRandomInt = (max: number, min = 0) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const handleViewerSearch = (value: string) => {
    // Simulate searching for users based on the input value
    const filteredUsers = fakeUsers.filter((user) =>
      user.toLowerCase().includes(value.toLowerCase()),
    );
    setSearchViewerResults(filteredUsers);
    setInputValue(value);
  };

  const handleSelectViewer = (value: string) => {
    // Add the selected user to the list of selected users
    setSelectedViewers([...selectedViewers, value]);
    // Clear the search results
    setInputValue("");
    setSearchViewerResults([]);
  };

  const handleRemoveViewer = (userToRemove: string) => {
    // Remove the user from the selected users list
    const updatedUsers = selectedViewers.filter(
      (user) => user !== userToRemove,
    );
    setSelectedViewers(updatedUsers);
  };

  const searchResult = (query: string) =>
    new Array(getRandomInt(5))
      .join(".")
      .split(".")
      .map((_, idx) => {
        const category = `${query}${idx}`;
        return {
          value: category,
          label: (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>
                Found {query} on{" "}
                <a
                  href={`https://s.taobao.com/search?q=${query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {category}
                </a>
              </span>
              <span>{getRandomInt(200, 100)} results</span>
            </div>
          ),
        };
      });

  // replace with query for employee in selected team
  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log("onSelect", value);
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
    console.log("Received uploaded file urls", uploadedUrls);
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
                  <Select placeholder="Select a team">
                    <Option value="teamA">Team A</Option>
                    <Option value="teamB">Team B</Option>
                    <Option value="teamC">Team C</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* all teams*/}
              <div>
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
              </div>

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
                  <AutoComplete
                    popupMatchSelectWidth={252}
                    style={{ width: 300 }}
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    size="large"
                  >
                    <Input.Search
                      size="large"
                      placeholder="input here"
                      enterButton
                    />
                  </AutoComplete>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Invite Viewers
                </p>
                <Form.Item name="viewers">
                  <AutoComplete
                    options={searchViewerResults.map((user) => ({
                      value: user,
                    }))}
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
                  </div>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Add Supporting Files
                </p>
                <UploadUserFile onUploadComplete={handleFileUploadComplete}/>
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
