import { Button, Col, Form, Input, Row, Select, Modal, notification, Upload, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUser } from "../../hooks/useUser";
import { clientStatusByDepartment } from "../../utils/constants";
import { useGetEmployeeByDepartmentQuery, useGetEmployeeDetailQuery } from "../../redux/user/userApiSlice";
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { UploadChangeParam } from 'antd/es/upload';
import AWS from "aws-sdk";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>('');

  const {data: curEmployee, } = useGetEmployeeDetailQuery(user?.id);
  const {data: biddingEmployees, } = useGetEmployeeByDepartmentQuery(1);
  const {data: salesEmployees, } = useGetEmployeeByDepartmentQuery(2);
  const {data: solutionEmployees, } = useGetEmployeeByDepartmentQuery(3);
  const {data: customerEmployees, } = useGetEmployeeByDepartmentQuery(4);

  const currentDepartmentId = curEmployee.departmentId;
  const currentDepartmentProcesses = currentDepartmentId ? clientStatusByDepartment.find(
    (department) => department.departmentId === Number(currentDepartmentId)
  )?.processes : [];


  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // S3 Configuration
  const S3_BUCKET = import.meta.env.VITE_AWS_S3_BUCKET as string;
  const REGION = import.meta.env.VITE_AWS_REGION;
  const s3BaseUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com`;
  const ACCESS_KEY = import.meta.env.VITE_AWS_ACCESS_KEY;
  const SECRET_KEY = import.meta.env.VITE_AWS_SECRET_KEY;

  AWS.config.update({
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  });
  const s3 = new AWS.S3({
    region: REGION,
  });

  // Function to upload file to S3
  const uploadToS3 = (file: any, onUpload: (url: string) => void) => {
    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    s3.upload(params, (err: any) => {
      if (err) {
        console.error("Error uploading file to cloud: ", err);
        message.error(`${file.name} file upload to cloud failed.`);
      } else {
        const fileUrl = `${s3BaseUrl}/${encodeURIComponent(file.name)}`;
        onUpload(fileUrl);
        message.success(`${file.name} file uploaded successfully to cloud.`);
      }
    });
  
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

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {

      setLoading(false);

      // Upload file to S3
      uploadToS3(info.file.originFileObj, (url) => {
        setImageUrl(url);

        // After successful upload, send POST request to the backend
        const payload = {
          employeeId: user?.id,
          newImageUrl: url,
        };

        axios.post("/api/employee/updateprofile", payload)
          .then((response) => {
            if(response.status >= 200 && response.status < 300) {
              notification.success({
                type: "success",
                message: "Update Company Logo Success",
              });
            } else {
              notification.error({
                type: "error",
                message: "Failed to Update Company Logo",
              });
            }
          })
          .catch(() => {
            notification.error({
              type: "error",
              message: "Failed to Update Company Logo",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      })
    }
  };


  const onFinish = (values: any) => {

    console.log(values);
    console.log(imageUrl);

    const companyPayload = {
        companyName: values.companyName,
        companyWebsite: values.companyWebsite,
        companyLogoUrl: imageUrl
    }

    axios
      .post("/api/client/create", companyPayload)
      .then((r) => {
        if(!r.data){
          setError("Error: Account creation failed");
          return;
        }

        const companyId = r.data.companyId;

        const accountPayload = {
            companyId: companyId,
            accountStatus: values.accountStatus,
            accountType: values.accountType,
            accountCreator: user?.id,
            biddingPersonnel: values.accountBiddingPersonnel,
            salesPersonnel: values.accountSalesPersonnel,
            solutionArchitectPersonnel: values.accountSolutionPersonnel,
            customerSuccessPersonnel: values.accountCustomerPersonnel,
        }

        console.log(accountPayload);

        axios.post("/api/account/create", accountPayload).then((r) => {
            if(!r.data){
                setError("Error: Account creation failed");
                return;
            }

            notification.success({
                type: "success",
                message: "Account created successfully",
              });
              navigate("/user/dashboard");
        }).catch(() => {
            setError("Error: Account creation failed");
          });
      })
      .catch(() => {
        setError("Error: Account creation failed");
      });

    // const payload = {
    //   teamCreator: user?.id,
    //   teamName: values.title,
    //   teamDescription: values.description,
    //   teamTypes: values.type,
    // };


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
          <h2 className="text-xl font-bold m-auto"> New Account</h2>
          <div className="h-px mx-6 my-4 justify-center bg-transparent border-0 opacity-25 bg-gradient-to-r from-transparent via-black/40 to-transparent dark:bg-gradient-to-r dark:from-transparent dark:via-white dark:to-transparent"></div>
          <Row gutter={24}>
            <Col span={2} />
            <Col span={10}>
              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Company Name
                </p>

                <Form.Item
                  name="companyName"
                  rules={[
                    {
                      required: true,
                      message: "Please input company name",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

            <div>
              <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Company Website
                </p>

                <Form.Item
                  name="companyWebsite"
                  rules={[
                    {
                      message: "Please input company website",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>

              <div>
              <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Account Status
                </p>
              <Form.Item
                 name="accountStatus"
                 rules={[
                   {
                     required: true,
                     message: "Please select status",
                   },
                 ]}
                >

                  <Select
                    placeholder="Select Client Status"
                    // style={{ width: 250 }}
                    onChange={(value) => form.setFieldsValue({ accountStatus: value })}
                  >
                    {currentDepartmentProcesses &&
                      currentDepartmentProcesses.map((process, index) => (
                        <Option key={index} value={process}>
                          {process}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Account Type
                </p>
                <Form.Item
                  name="accountType"
                  rules={[
                    {
                      required: true,
                      message: "Please select account type",
                    },
                  ]}
                >
                  <Select placeholder="Select a team type">
                    <Option value="standard">Standard</Option>
                    <Option value="premium">Premium</Option>
                  </Select>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Upload Company Logo
                </p>

                <Upload
                    name="avatar"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                >
                    {imageUrl ? 
                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> 
                    : uploadButton}
                </Upload>
              </div>
            </Col>

            <Col span={2} />
            <Col span={10}>
            <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Bidding Personnel
                </p>
                <Form.Item
                  name="accountBiddingPersonnel"
                >
                  <Select placeholder="Select a bidding personnel">
                  {biddingEmployees &&
                    biddingEmployees.map((employee: any) => (
                    <Option key={employee.employeeId} value={employee.employeeId}>
                        {`${employee.employeeFirstname} ${employee.employeeLastname}`}
                    </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Sales Personnel
                </p>
                <Form.Item
                  name="accountSalesPersonnel"
                >
                  <Select placeholder="Select a sales personnel">
                  {salesEmployees &&
                    salesEmployees.map((employee: any) => (
                    <Option key={employee.employeeId} value={employee.employeeId}>
                        {`${employee.employeeFirstname} ${employee.employeeLastname}`}
                    </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Solution Architect Personnel
                </p>
                <Form.Item
                  name="accountSolutionPersonnel"
                >
                  <Select placeholder="Select a solution architect personnel">
                  {solutionEmployees &&
                    solutionEmployees.map((employee: any) => (
                    <Option key={employee.employeeId} value={employee.employeeId}>
                        {`${employee.employeeFirstname} ${employee.employeeLastname}`}
                    </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div>
                <p className="inline-block mb-1 ml-1 text-base font-semibold text-slate-700">
                  Customer Success Personnel
                </p>
                <Form.Item
                  name="accountCustomerPersonnel"
                >
                  <Select placeholder="Select a customer success personnel">
                  {customerEmployees &&
                    customerEmployees.map((employee: any) => (
                    <Option key={employee.employeeId} value={employee.employeeId}>
                        {`${employee.employeeFirstname} ${employee.employeeLastname}`}
                    </Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Col>
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
