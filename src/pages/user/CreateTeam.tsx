import { Button, Col, Form, Input, Row, Select, Modal, notification } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUser } from "../../hooks/useUser";
// import InviteTeamMember from "../../components/user/InviteMember";
// import InviteClient from "../../components/user/InviteClient";
// import { IAccount, ITeamMember } from "../../types";

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
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [, setError] = useState("");

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
      teamCreator: user?.id,
      teamName: values.title,
      teamDescription: values.description,
      teamTypes: values.type,
    };

    axios
      .post("/api/team/create", payload)
      .then((r) => {
        if(!r.data){
          setError("Error: Team creation failed");
          return;
        }
        notification.success({
          type: "success",
          message: "Team Created successfully",
        });
        navigate("/user/dashboard");
      })
      .catch(() => {
        setError("Error: Team creation failed");
      });

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
          <h2 className="text-xl font-bold m-auto"> New Team</h2>
          <div className="h-px mx-6 my-4 justify-center bg-transparent border-0 opacity-25 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"></div>
          <Row gutter={24}>
            <Col span={2} />
            <Col span={10}>
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Team Name
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
                  Team Description
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
                  Team Tags
                </p>
                <Form.Item
                  name="type"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one team tag",
                    },
                  ]}
                >
                  <Select mode="tags" placeholder="Select a team type">
                    <Option value="client onboarding">Client Onboarding</Option>
                    <Option value="internal management">
                      Internal Management
                    </Option>
                    <Option value="client maintenance">
                      Client Maintenance
                    </Option>
                    <Option value="product update">Product Update</Option>
                    <Option value="technical problem solving">
                      Technical Problem Solving
                    </Option>
                  </Select>
                </Form.Item>
              </div>
            </Col>

            {/* <Col span={10}>
              <div>
                <InviteTeamMember 
                  existingTeamMembers={[]}
                  />
                <div className="mb-3"></div>
                <InviteClient existingTeamAccounts={[]}/>
              </div>
            </Col> */}

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
              Are you sure you want to cancel creating the team?
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
