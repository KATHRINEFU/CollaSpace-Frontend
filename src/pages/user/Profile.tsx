import {
  Avatar,
  Button,
  Form,
  Input,
  Spin,
  message,
  Upload,
  notification,
  Select,
} from "antd";
import { useGetEmployeeDetailQuery } from "../../redux/user/userApiSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { IEmployee } from "../../types";
import { mapDataToEmployee, getFormattedDate } from "../../utils/functions";
import { useUser } from "../../hooks/useUser";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import AWS from "aws-sdk";
import { roleOptions } from "../../utils/constants";

export function Component() {
  const user = useUser();
  const [profileForm] = Form.useForm();
  const { data: employeeData, isLoading: isEmployeeLoading } =
    useGetEmployeeDetailQuery(user?.id);

  const [employee, setEmployee] = useState<IEmployee>();
  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [initialValue, setInitialValue] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    locationCountry: string;
    locationCity: string;
    startdate: string;
    role: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    employee?.profileUrl,
  );
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState({});
  let refreshPage = false;

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

  const handleEditBtnClicked = () => {
    setIsEditting(true);
  };

  const handleCancelBtnClicked = () => {
    refreshPage = !true;
    setIsEditting(false);
  };

  const handleUpdateProfile = (values: any) => {
    setIsEditting(false);
    console.log(values);
    axios
      .put("/api/employee/edit" + user?.id, values)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          notification.success({
            type: "success",
            message: "Update Profile Success",
          });
        } else {
          notification.error({
            type: "error",
            message: "Failed to Update Profile",
          });
        }
      })
      .catch(() => {
        notification.error({
          type: "error",
          message: "Failed to Update Profile",
        });
      });
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

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

  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>,
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);

      // Upload file to S3
      uploadToS3(info.file.originFileObj, (url) => {
        setImageUrl(url);

        // After successful upload, send POST request to the backend
        const payload = {
          employeeId: user?.id,
          newImageUrl: url,
        };

        axios
          .post("/api/employee/updateprofile", payload)
          .then((response) => {
            if (response.status >= 200 && response.status < 300) {
              notification.success({
                type: "success",
                message: "Update Profile Image Success",
              });
            } else {
              notification.error({
                type: "error",
                message: "Failed to Update Profile Image",
              });
            }
          })
          .catch(() => {
            notification.error({
              type: "error",
              message: "Failed to Update Profile Image",
            });
          })
          .finally(() => {
            setLoading(false);
          });
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    fetch(
      "https://valid.layercode.workers.dev/list/countries?format=select&flags=true&value=code",
    )
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.countries);
        setSelectedCountry(data.userSelectValue);
      });
  }, []);

  useEffect(() => {}, [refreshPage]);

  useEffect(() => {
    const baseUrl = "http://localhost:8080";
    const fetchDepartmentName = async (employeeData: any) => {
      let employeeWithAdditionalData = { ...employeeData };
      if (employeeWithAdditionalData.departmentId) {
        const departmentResponse = await axios.get(
          `${baseUrl}/employee/department/${employeeWithAdditionalData.departmentId}`,
        );
        if (departmentResponse.data) {
          employeeWithAdditionalData.departmentName =
            departmentResponse.data.departmentName;
        }
      }
      return employeeWithAdditionalData;
    };

    const fetchAndSetEmployee = async () => {
      const employeeWithAdditionalData =
        await fetchDepartmentName(employeeData);
      setEmployee(mapDataToEmployee(employeeWithAdditionalData));
    };

    if (!isEmployeeLoading && employeeData) {
      fetchAndSetEmployee();
    }
  }, [employeeData, isEmployeeLoading]);

  useEffect(() => {
    if (employee) {
      setImageUrl(employee.profileUrl);
      profileForm.setFieldsValue(employee);
      // console.log("Setting initial values:", employee);
      setInitialValue({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        locationCountry: employee.locationCountry,
        locationCity: employee.locationCity,
        startdate: getFormattedDate(new Date(employee.startdate)),
        role: employee.role,
      });
    }
  }, [employee]);

  return (
    <>
      <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-3 mt-3 overflow-hidden break-words bg-white border-0 shadow-3xl dark:bg-slate-850 rounded-2xl bg-clip-border">
        <div className="flex flex-wrap -mx-3">
          <div className="flex w-auto max-w-full px-3">
            <div className="relative inline-flex items-center justify-center text-base text-white transition-all duration-200 ease-in-out h-19 w-19 rounded-xl">
              <Avatar
                src={
                  <img
                    src={
                      "https://cdn-icons-png.flaticon.com/512/188/188987.png"
                    }
                    alt="Profile"
                  />
                }
              />

              <div className="mt-4 px-3">
                <Upload
                  name="avatar"
                  listType="picture-circle"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
            </div>
            {employee ? (
              <div className="flex-none w-auto max-w-full px-3 my-auto">
                <div className="h-full">
                  <h5 className="mb-1 text-2xl font-bold">
                    {employee.firstName + " " + employee.lastName}
                  </h5>
                  <p className="mb-0 text-sm font-semibold leading-normal dark:text-white dark:opacity-60">
                    {employee.departmentName}
                  </p>
                </div>
              </div>
            ) : (
              <Spin size="large" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap -mx-3">
          <div className="w-full max-w-full px-3 m-auto flex-0 lg:w-8/12">
            {employee && initialValue && (
              <Form
                className="mb-32"
                form={profileForm}
                initialValues={initialValue}
                onFinish={handleUpdateProfile}
                onValuesChange={() => profileForm.resetFields()}
              >
                <div className="flex flex-wrap mt-4 -mx-3">
                  <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                    <Form.Item name="firstName">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        First Name
                      </p>
                      <Input
                        disabled={!isEditting}
                        defaultValue={initialValue.firstName}
                      />
                      {/* <p>{employee.firstName}</p> */}
                    </Form.Item>
                  </div>

                  <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                    <Form.Item name="lastName">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700">
                        Last Name
                      </p>
                      <Input
                        defaultValue={initialValue.lastName}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={!isEditting}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex flex-wrap mt-4 -mx-3">
                  <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                    <Form.Item name="email">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        Email
                      </p>
                      <Input
                        value={initialValue.email}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={true}
                      />
                    </Form.Item>
                  </div>

                  <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                    <Form.Item name="phone">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        Phone
                      </p>
                      <Input
                        value={initialValue.phone}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={!isEditting}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex flex-wrap mt-4 -mx-3">
                  <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                    <Form.Item name="locationCountry">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        Location Country
                      </p>
                      {/* <Input
                        value={initialValue.locationCountry}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={!isEditting}
                      /> */}
                      <Select
                        options={countries}
                        value={selectedCountry}
                        onChange={(selectedOption) =>
                          setSelectedCountry(selectedOption)
                        }
                        disabled={!isEditting}
                      />
                    </Form.Item>
                  </div>

                  <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                    <Form.Item name="locationCity">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        Location City
                      </p>
                      <Input
                        value={initialValue.locationCity}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={!isEditting}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex flex-wrap mt-4 -mx-3">
                  <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                    <Form.Item name="startdate">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        Start Date
                      </p>
                      <Input
                        value={initialValue.startdate}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={true}
                      />
                    </Form.Item>
                  </div>

                  <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                    <Form.Item name="role">
                      <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">
                        Role
                      </p>
                      {/* <Input
                        value={initialValue.role}
                        className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                        disabled={!isEditting}
                      /> */}
                      <Select
                        className=""
                        value={initialValue.role}
                        allowClear
                        options={roleOptions}
                        disabled={!isEditting}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="flex gap-3 items-center justify-center">
                  {isEditting ? (
                    <Button type="primary" onClick={handleCancelBtnClicked}>
                      Cancel
                    </Button>
                  ) : (
                    <Button type="primary" onClick={handleEditBtnClicked}>
                      Edit
                    </Button>
                  )}

                  <Button
                    htmlType="submit"
                    type="primary"
                    disabled={!isEditting}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
