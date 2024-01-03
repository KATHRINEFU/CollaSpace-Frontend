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
  DatePicker,
  Divider,
  notification
} from "antd";

import MessageList from "./MessageList";
import { ITicket, ITicketAssign } from "../../types";
import { getStatusColor } from "../../utils/functions";
import { useUser } from "../../hooks/useUser";
import { useEffect, useState } from "react";
import { TicketRole, TicketStatus } from "../../utils/constants";
import axios from 'axios';
import { useGetAllEmployeesQuery } from "../../redux/user/userApiSlice";
import UploadUserFile from "./UploadUserFile";
import moment from 'moment';


interface TicketDetailProps {
  selectedTicket: ITicket;
  initialValue: any;
}

const TicketDetail: React.FC<TicketDetailProps> = ({
  selectedTicket,
  initialValue,
}) => {
  const user = useUser();
  const {data: employees, isLoading: isEmployeesLoading} = useGetAllEmployeesQuery({});

  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [viewerProfiles, setViewerProfiles] = useState<any[]>([]);
  const [supervisorProfiles, setSupervisorProfiles] = useState<any[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [, setError] = useState("");
  const [curState, setCurState] = useState<string>(selectedTicket.ticketStatus);
  // const [ticketCreatorName, setTicketCreatorName] = useState('');
  // const [assignToName, setAssignToName] = useState('');

  const isCreator = user?.id === selectedTicket.ticketCreator;

  const [ticketForm] = Form.useForm();
  ticketForm.setFieldsValue({selectedTicket, dueDate: moment(initialValue.dueDate)});

  const { Option } = Select;

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

  const currentUserAssignments = selectedTicket.assigns.filter(
    (assign: ITicketAssign) => assign.employeeId === user?.id
  );

  const isAssignee = currentUserAssignments.some(
    (assign: ITicketAssign) => assign.role === TicketRole.ASSIGNEE
  );

  const isSupervisor = currentUserAssignments.some(
    (assign: ITicketAssign) => assign.role === TicketRole.SUPERVISOR
  );

  const viewers =  selectedTicket.assigns.filter(
    (assign: ITicketAssign) => assign.role === TicketRole.VIEWER
  );

  const supervisors =  selectedTicket.assigns.filter(
    (assign: ITicketAssign) => assign.role === TicketRole.SUPERVISOR
  );

  const isShowAcceptBtn =
    selectedTicket?.ticketStatus === TicketStatus.PENDING &&
    selectedTicket?.assigns.some(
      (assign: ITicketAssign) => assign.employeeId === user?.id
    );
  
  const isAllowEdit = isEditting && isCreator;

  const isAllowChangeStatus = isEditting && (isAssignee || isCreator || isSupervisor);

  const handleStatusChange = (value: any) => {
    setCurState(value);
  };
  
  const handleEditBtnClicked = () => {
    setIsEditting(true);
  };

  const handleCancelBtnClicked = () => {
    setIsEditting(false);
  };

  const getPriorityText = (priority: number) => {
    return priorityTexts[priority - 1];
  };

  const handleAcceptClicked = () => {
    ticketForm.setFieldsValue({ status: TicketStatus.IN_PROGRESS });
  };

  const handleFileUploadComplete = (urls: string[]) => {
    setUploadedUrls(urls);
  };

  const handleSaveTicket = (values: any) => {
    console.log(uploadedUrls);

    const payload = {
      ticketId: selectedTicket.ticketId,
      ticketDescription: values.ticketDescription,
      ticketStatus:curState,
      addViewerIds: values.viewers,
      addSupervisorIds: values.supervisors,
    }

    axios
    .put("/api/ticket/edit", payload)
    .then((r) => {
      if(!r.data){
        setError("Error: Ticket edit failed");
        return;
      }
      notification.success({
        type: "success",
        message: "Ticket edit success",
      });

      setIsEditting(false);

    })
    .catch(() => {
      setError("Error: Ticket edition failed");
    });
  }

  useEffect(() => {
    const fetchEmployeeProfiles = async () => {
      const profiles = [];

      for (const viewer of viewers) {
        try {
          const response = await axios.get(`/api/employee/${viewer.employeeId}`);
          profiles.push(response.data);
        } catch (error) {
          console.error('Error fetching employee info: ', error);
          profiles.push(null); // Push null if there's an error fetching profile
        }
      }

      setViewerProfiles(profiles);
    };

    fetchEmployeeProfiles();
  }, []);

  useEffect(() => {
    const fetchEmployeeProfiles = async () => {
      const profiles = [];

      for (const supervisor of supervisors) {
        try {
          const response = await axios.get(`/api/employee/${supervisor.employeeId}`);
          profiles.push(response.data);
        } catch (error) {
          console.error('Error fetching employee info: ', error);
          profiles.push(null); // Push null if there's an error fetching profile
        }
      }

      setSupervisorProfiles(profiles);
    };

    fetchEmployeeProfiles();
  }, []);

  return (
    <div>
      <Form
        onFinish={handleSaveTicket}
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
              <Input.TextArea rows={4} disabled = {!isAllowEdit} />
            </Form.Item>

            <div className="flex gap-3">
              <Form.Item name="ticketStatus" label="Status">
                {isAllowChangeStatus ? (
                  <div>
                    <Select
                      style={{width: 200}}
                      // value={ticketForm.getFieldValue('ticketStatus')}
                      value={curState}
                      onChange={handleStatusChange}
                      options={
                        [
                          {value: TicketStatus.PENDING, label: 'PENDING'},
                          {value: TicketStatus.IN_PROGRESS, label: 'IN PROGRESS'},
                          {value: TicketStatus.UNDER_REVIEW, label: 'UNDER REVIEW'},
                          {value: TicketStatus.RESOLVED, label: 'RESOLVED'},
                        ]
                      }
                    />
                  </div>
                ) : (
                  <Tag color={getStatusColor(selectedTicket.ticketStatus)}>
                    {selectedTicket.ticketStatus}
                  </Tag>
                )}

              </Form.Item>

              {isShowAcceptBtn && (
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

            <Form.Item name="dueDate" label="Due Date">
              {isAllowEdit ? (
                <DatePicker className="w-full" />
                // <Input disabled={true}/>
              ) : (
                <Input disabled={true}/>
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

            <div className="flex gap-3 w-full">
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
                    style={{width: "200"}}
                  >
                    {viewerProfiles.map((profile, index) => (
                      <Tooltip key={index} title={profile ? `${profile.employeeFirstname} ${profile.employeeLastname}` : 'No Data'} placement="top">
                        <Avatar src={profile ? profile.employeeProfileUrl : ''} style={{ backgroundColor: '#bae0ff' }}>
                          {profile ? `${profile.employeeFirstname.charAt(0)}${profile.employeeLastname.charAt(0)}` : 'N/A'}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </div>

              <div className="flex gap-3 items-center">
                <p>Supervisors: </p>

                {supervisorProfiles.length===0 ?? (<p>No Supervisors</p>)}

                {/*TODO: get viewer's profile photo, popover to show fullname */}
                <Avatar.Group
                  maxCount={5}
                  size="large"
                  maxStyle={{
                    color: "#f56a00",
                    backgroundColor: "#fde3cf",
                  }}
                  style={{width: "200"}}
                >
          
                  {supervisorProfiles.map((profile, index) => (
                    <Tooltip key={index} title={profile ? `${profile.employeeFirstname} ${profile.employeeLastname}` : 'No Data'} placement="top">
                      <Avatar src={profile ? profile.employeeProfileUrl : ''} style={{ backgroundColor: '#bae0ff' }}>
                        {profile ? `${profile.employeeFirstname.charAt(0)}${profile.employeeLastname.charAt(0)}` : 'N/A'}
                      </Avatar>
                    </Tooltip>
                  ))}
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

            <Divider/>

            <div>
                <p className="inline-block mb-1 font-semibold text-slate-700">
                  Invite Viewers
                </p>
                <Form.Item name="viewers">
                  <Select 
                    mode="multiple"
                    loading = {isEmployeesLoading}
                    disabled = {!isAllowEdit}
                    placeholder="Select viewers">
                      {employees && employees.map((employee: any) => (
                        <Option key={employee.employeeId} value={employee.employeeId}>
                          {employee.employeeFirstname} {employee.employeeLastname}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
            </div>

            <div>
                <p className="inline-block mb-1 font-semibold text-slate-700">
                  Invite Supervisors
                </p>
                <Form.Item name="supervisors">
                  <Select 
                    mode="multiple"
                    loading = {isEmployeesLoading}
                    disabled = {!isAllowEdit}
                    placeholder="Select viewers">
                      {employees && employees.map((employee: any) => (
                        <Option key={employee.employeeId} value={employee.employeeId}>
                          {employee.employeeFirstname} {employee.employeeLastname}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
            </div>

            <div>
              <p className="inline-block mb-1 font-semibold text-slate-700">
                Add Supporting Files
              </p>
              <UploadUserFile onUploadComplete={handleFileUploadComplete}/>
            </div>

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

          </Col>
          <Col span={12}>
            <div className="ml-3 bg-blue-100 w-full h-full rounded-xl">
              <p className="ml-3 text-base mb-3">Ticket Logs</p>
                {user?.id && (<MessageList logs={selectedTicket.ticketLogs} currentUserId={user?.id} ticketId={selectedTicket.ticketId}/>)}
            </div>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default TicketDetail;
