import { useState } from "react";
import { IAccount } from "../../types";
import { Card, Image, Row, Col, Divider, List, Form, Select, Button, ConfigProvider } from "antd";
import ClientTimeline from "./ClientTimeline";
import UploadFile from "./UploadFile";
import { getFormattedDate } from "../../utils/functions";
import { clientStatusByDepartment } from "../../utils/constants";

interface ClientDetailProps {
  selectedAccount: IAccount;
  departmentId: string | undefined;
}

const ClientDetail: React.FC<ClientDetailProps> = ({
  selectedAccount,
  departmentId,
}) => {

  const [clientStatusForm] = Form.useForm();
  const {Option} = Select;

  const [documents, setDocuments] = useState([
    "www.googledoc.com/clientfile/1",
    "ClientFile-Version1.doc",
    "ClientFile-Version2.doc",
    "ClientFile-Version3.doc",
    "ClientFile-Version4.doc",
    "ClientFile-Final.pdf",
  ]);

  const currentDepartmentId = departmentId;
  const currentDepartmentProcesses = currentDepartmentId ? clientStatusByDepartment.find(
    (department) => department.departmentId === Number(currentDepartmentId)
  )?.processes : [];

  const handleUploadSuccess = (fileName: string) => {
    // Add the uploaded file name to the documents list
    setDocuments([fileName, ...documents]);
  };

  const onUpdateClientStatus = (values: any) => {
    console.log(values);
  }

  const handlePushToNextDepartment = () => {

  }

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
                    onChange={(value) => clientStatusForm.setFieldsValue({ status: value })}
                  >
                    {currentDepartmentProcesses &&
                      currentDepartmentProcesses.map((process, index) => (
                        <Option key={index} value={process}>
                          {process}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                <Button className="" htmlType="submit"> Update</Button>
              </Form>


              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#D2DE32',
                  },
                }}
              >
                <Button className = "w-full mt-3" type="primary" onClick={handlePushToNextDepartment} >Push to next department</Button>
              </ConfigProvider>
            </div>
              

        </Col>

        <Col span={8}>
          <Divider orientation="right">Documents</Divider>
          <List
            dataSource={documents}
            renderItem={(item) => (
              <List.Item>
                <p className="text-sky-600">{item}</p>
              </List.Item>
            )}
          />

          <div className="h-30">
            <UploadFile onUploadSuccess={handleUploadSuccess} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ClientDetail;
