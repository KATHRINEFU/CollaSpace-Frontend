import {
  Button,
  Tag,
  Form,
  Input,
  Rate,
  Select,
  Avatar,
  Tooltip,
  List,
  Row,
  Col,
} from "antd";

import { UserOutlined, AntDesignOutlined } from "@ant-design/icons";

import MessageList from "./MessageList";
import { ITicket } from "../../types";
import { getStatusColor } from "../../utils/functions";

interface TicketDetailProps {
  selectedTicket: ITicket;
  initialValue: any;
}

const TicketDetail: React.FC<TicketDetailProps> = ({
  selectedTicket,
  initialValue,
}) => {
  const priorityTexts = [
    "casual",
    "not in hurry",
    "don't delay",
    "do it",
    "super important",
  ];

  const teamNames = [
    "Support Team",
    "Development Team",
    "Testing Team",
    "Maintenance Team",
  ];

  const getPriorityText = (priority: number) => {
    return priorityTexts[priority - 1];
  };

  const [ticketForm] = Form.useForm();
  ticketForm.setFieldsValue(selectedTicket);

  const { Option } = Select;

  const handleAcceptClicked = () => {
    ticketForm.setFieldsValue({ status: "in progress" });
  };

  return (
    <div>
      <Form
        form={ticketForm}
        initialValues={initialValue}
        key={selectedTicket.ticketId}
      >
        <Row>
          <Col span={12}>
            <Form.Item name="ticketTitle" label="Title">
              <Input disabled />
            </Form.Item>
            <Form.Item name="ticketDescription" label="Description">
              <Input.TextArea rows={4} disabled />
            </Form.Item>

            <div className="flex gap-3">
              <Form.Item name="ticketStatus" label="Status">
                <Tag color={getStatusColor(selectedTicket.ticketStatus)}>
                  {selectedTicket.ticketStatus}
                </Tag>
              </Form.Item>

              {selectedTicket.ticketStatus === "pending" && (
                // todo: check if cur user is the assignee
                <Form.Item>
                  <Button
                    type="primary"
                    size="small"
                    onClick={handleAcceptClicked}
                    style={{ height: "10px" }}
                  >
                    Accept
                  </Button>
                </Form.Item>
              )}
            </div>

            <Form.Item name="priority" label="Priority">
              <Rate
                tooltips={priorityTexts}
                value={selectedTicket.priority}
                disabled={true}
              />
              {selectedTicket.priority ? (
                <span className="ant-rate-text">
                  {getPriorityText(selectedTicket.priority)}
                </span>
              ) : (
                ""
              )}
            </Form.Item>

            <div className="flex gap-3 w-full justify-between">
              <Form.Item
                name="fromTeamName"
                label="From Team"
                style={{ width: "250px" }}
              >
                <Select placeholder="from team" disabled={true}>
                  {teamNames.map((teamName, index) => (
                    <Option key={index} value={`team${index}`}>
                      {teamName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex gap-3 w-full justify-between">
              <Form.Item
                name="ticketCreatorName"
                label="Created By"
                style={{ width: "250px" }}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="assignToName"
                label="Assigned To"
                style={{ width: "250px" }}
              >
                <Input disabled />
              </Form.Item>
            </div>

            <div className="flex gap-3 w-full justify-between">
              <div className="flex gap-3 items-center">
                <p>Viewers: </p>

                {/*TODO: get viewer's profile photo, popover to show fullname */}
                <Avatar.Group
                  maxCount={5}
                  size="large"
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  }}
                >
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
                  <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                  <Tooltip title="Ant User" placement="top">
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </Tooltip>
                  <Avatar
                    style={{ backgroundColor: "#1677ff" }}
                    icon={<AntDesignOutlined />}
                  />
                </Avatar.Group>
              </div>

              <div className="flex gap-3 items-center">
                <p>Supervisors: </p>

                {/*TODO: get viewer's profile photo, popover to show fullname */}
                <Avatar.Group
                  maxCount={5}
                  size="large"
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  }}
                >
                  <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel&key=3" />
                  <Avatar style={{ backgroundColor: "#f56a00" }}>K</Avatar>
                  <Tooltip title="Ant User" placement="top">
                    <Avatar
                      style={{ backgroundColor: "#87d068" }}
                      icon={<UserOutlined />}
                    />
                  </Tooltip>
                  <Avatar
                    style={{ backgroundColor: "#1677ff" }}
                    icon={<AntDesignOutlined />}
                  />
                </Avatar.Group>
              </div>
            </div>

            <div className="flex gap-3 mt-3">
              <p>Attachments: </p>
              {/*TODO: filename, filepath */}
              <List
                size="small"
                bordered
                dataSource={selectedTicket.files}
                style={{ width: "300px" }}
                renderItem={(file) => (
                  <List.Item>
                    <a
                      href={`path_to_your_files/${file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {file}
                    </a>
                  </List.Item>
                )}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className="ml-3 bg-lime-100 w-full h-full rounded-xl">
              <p className="ml-3 text-base mb-3">Ticket Logs</p>
              <MessageList logs={selectedTicket.ticketLogs} currentUserId={4} />
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TicketDetail;
