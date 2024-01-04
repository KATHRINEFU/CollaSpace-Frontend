import { useState } from "react";
import { IAccount } from "../../types";
import {
  Card,
  Image,
  Row,
  Col,
  Divider,
  List,
  Form,
  Select,
  Button,
  ConfigProvider,
  notification,
} from "antd";
import ClientTimeline from "./ClientTimeline";
import UploadUserFile from "./UploadUserFile";
import { getFormattedDate } from "../../utils/functions";
import { clientStatusByDepartment } from "../../utils/constants";
import axios from "axios";

interface ClientDetailProps {
  selectedAccount: IAccount;
  departmentId: string | undefined;
  teamId: string | undefined;
}

const ClientDetail: React.FC<ClientDetailProps> = ({
  selectedAccount,
  departmentId,
  teamId,
}) => {
  const [clientStatusForm] = Form.useForm();
  const { Option } = Select;

  const [documents] = useState([selectedAccount.files]);

  // const fakeDocuments = [
  // "www.googledoc.com/clientfile/1",
  // "ClientFile-Version1.doc",
  // "ClientFile-Version2.doc",
  // "ClientFile-Version3.doc",
  // "ClientFile-Version4.doc",
  // "ClientFile-Final.pdf",]

  const currentDepartmentId = departmentId;
  const currentDepartmentProcesses = currentDepartmentId
    ? clientStatusByDepartment.find(
        (department) => department.departmentId === Number(currentDepartmentId),
      )?.processes
    : [];
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [, setError] = useState("");

  const onUpdateClientStatus = (values: any) => {
    axios
      .put("/api/account/updatestatus/" + selectedAccount.accountId, values)
      .then((r) => {
        if (!r.data) {
          setError("Error: Update status failed");
          return;
        }
        notification.success({
          type: "success",
          message: "Update status success",
        });
      })
      .catch(() => {
        setError("Error: Update status failed");
      });
  };

  const handlePushToNextDepartment = () => {
    axios
      .put(
        "/api/account/push/" + selectedAccount.accountId,
        selectedAccount.accountCurrentResponsibleDepartmentId,
      )
      .then((r) => {
        if (!r.data) {
          setError("Error: Push to next department failed");
          return;
        }
        notification.success({
          type: "success",
          message: "Push to next department success",
        });
      })
      .catch(() => {
        setError("Error: Push to next department failed");
      });
  };

  const handleFileUploadComplete = (urls: string[]) => {
    setUploadedUrls(urls);
  };

  const handleSaveDocuments = () => {
    const payload = {
      files: uploadedUrls,
    };
    axios
      .put("/api/account/adddocuments/" + selectedAccount.accountId, payload)
      .then((r) => {
        if (!r.data) {
          setError("Error: Add documents failed");
          return;
        }
        notification.success({
          type: "success",
          message: "Add documents success",
        });
      })
      .catch(() => {
        setError("Error: Add documents failed");
      });
  };

  return (
    <div>
      <div className="flex gap-3 items-center justify-center mb-3">
        <Image
          src={selectedAccount.accountCompany?.companyLogoUrl}
          preview={false}
          width={100}
        />
        <p className="text-base font-bold">
          {selectedAccount.accountCompany?.companyName}
        </p>
      </div>
      <Row gutter={{ xs: 8, sm: 12, md: 16, lg: 32 }}>
        <Col span={8}>
          <div className="ml-12">
            <ClientTimeline
              currentDepartmentId={Number(departmentId)}
              currentStatus={selectedAccount.accountCurrentStatus}
            />
          </div>
        </Col>

        <Col span={8}>
          <Divider orientation="right">Client Information</Divider>
          <p>Client Name: {selectedAccount.accountCompany?.companyName}</p>
          <p>
            Client Website: {selectedAccount.accountCompany?.companyWebsite}
          </p>
          <p>
            Joined Date:{" "}
            {getFormattedDate(new Date(selectedAccount.accountCreationdate))}
          </p>
          <p>
            Last Update Date:{" "}
            {getFormattedDate(new Date(selectedAccount.accountLastUpdatedate))}
          </p>

          <Divider orientation="right">Personnel Information</Divider>

          <Row className="mb-3" gutter={{ xs: 4, sm: 8, md: 16, lg: 16 }}>
            <Col span={12}>
              <Card>
                <p className="text-sm">Bidding</p>
                <h5>
                  {selectedAccount.biddingPersonnelEmployee?.firstName +
                    " " +
                    selectedAccount.biddingPersonnelEmployee?.lastName}
                </h5>
                <p>{selectedAccount.biddingPersonnelEmployee?.email}</p>
              </Card>
            </Col>

            <Col span={12}>
              <Card>
                <p className="text-sm">Sales</p>
                <h5>
                  {selectedAccount.salesPersonnelEmployee?.firstName +
                    " " +
                    selectedAccount.salesPersonnelEmployee?.lastName}
                </h5>
                <p>{selectedAccount.salesPersonnelEmployee?.email}</p>
              </Card>
            </Col>
          </Row>

          <Row gutter={{ xs: 4, sm: 8, md: 16, lg: 16 }}>
            <Col span={12}>
              <Card>
                <p className="text-sm">Solution Architect</p>
                <h5>
                  {selectedAccount.solutionArchitectPersonnelEmployee
                    ?.firstName +
                    " " +
                    selectedAccount.solutionArchitectPersonnelEmployee
                      ?.lastName}
                </h5>
                <p>
                  {selectedAccount.solutionArchitectPersonnelEmployee?.email}
                </p>
              </Card>
            </Col>

            <Col span={12}>
              <Card>
                <p className="text-sm">Customer Success</p>
                <h5>
                  {selectedAccount.customerSuccessPersonnelEmployee?.firstName +
                    " " +
                    selectedAccount.customerSuccessPersonnelEmployee?.lastName}
                </h5>
                <p>{selectedAccount.customerSuccessPersonnelEmployee?.email}</p>
              </Card>
            </Col>
          </Row>

          {Number(teamId) === Number(departmentId) && (
            <div>
              <Divider orientation="right">Status Update</Divider>
              <div className="flex flex-col justify-center">
                <Form
                  form={clientStatusForm}
                  onFinish={onUpdateClientStatus}
                  scrollToFirstError
                  className="flex flex-col justify-center"
                >
                  <Form.Item
                    name="status"
                    rules={[
                      {
                        required: true,
                        message: "Please select status",
                      },
                    ]}
                  >
                    <span className="mr-3">New Status: </span>
                    <Select
                      placeholder="Select Client Status"
                      style={{ width: 250 }}
                      onChange={(value) =>
                        clientStatusForm.setFieldsValue({ status: value })
                      }
                    >
                      {currentDepartmentProcesses &&
                        currentDepartmentProcesses.map((process, index) => (
                          <Option key={index} value={process}>
                            {process}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>

                  <Button className="" htmlType="submit">
                    {" "}
                    Update
                  </Button>
                </Form>

                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#D2DE32",
                    },
                  }}
                >
                  <Button
                    className="w-full mt-3"
                    type="primary"
                    onClick={handlePushToNextDepartment}
                  >
                    Push to next department
                  </Button>
                </ConfigProvider>
              </div>
            </div>
          )}
        </Col>

        <Col span={8}>
          <Divider orientation="right">Documents</Divider>
          {documents && documents.length > 0 ? (
            <List
              dataSource={documents}
              renderItem={(item) => (
                <List.Item>
                  <p className="text-sky-600">{item}</p>
                </List.Item>
              )}
            />
          ) : (
            <p className="text-base">No Documents</p>
          )}

          <div className="h-30">
            <UploadUserFile onUploadComplete={handleFileUploadComplete} />
          </div>

          <Button type="primary" className="mt-3" onClick={handleSaveDocuments}>
            Save Documents
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ClientDetail;
