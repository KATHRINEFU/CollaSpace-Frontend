import { Avatar, Button, Form, Input, Spin } from "antd"
import { useGetEmployeeDetailQuery } from "../../redux/api/apiSlice";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { IEmployee } from "../../types";
import { mapDataToEmployee, getFormattedDate } from "../../utils/functions";

export function Component() {
    const [profileForm] = Form.useForm();
    const {data: employeeData, isLoading: isEmployeeLoading} = useGetEmployeeDetailQuery(4); // replace 4 with cur user id
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

    const handleEditBtnClicked = () => {
        setIsEditting(true);
    }

    const handleSaveBtnClicked = () => {
        setIsEditting(false);
    }

    useEffect(()=>{
        const baseUrl = "http://localhost:8080";
        const fetchDepartmentName = async (employeeData: any) => {
            let employeeWithAdditionalData = {...employeeData};
            if(employeeWithAdditionalData.departmentId){
                const departmentResponse = await axios.get(
                    `${baseUrl}/employee/department/${employeeWithAdditionalData.departmentId}`,
                );
                if (departmentResponse.data) {
                    employeeWithAdditionalData.departmentName = departmentResponse.data.departmentName;
                }
            }
            return employeeWithAdditionalData;
        };

        const fetchAndSetEmployee = async () => {
            const employeeWithAdditionalData = await fetchDepartmentName(employeeData);
            setEmployee(mapDataToEmployee(employeeWithAdditionalData));
        }

        if(!isEmployeeLoading && employeeData){
            fetchAndSetEmployee();
        }
    }, [employeeData, isEmployeeLoading])

    useEffect(() => {
        if(employee){
            profileForm.setFieldsValue(employee);
            console.log("Setting initial values:", employee);
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
        
    }, [employee])

    return (
        <>
            <div className="relative flex flex-col flex-auto min-w-0 p-4 mx-3 mt-3 overflow-hidden break-words bg-white border-0 shadow-3xl dark:bg-slate-850 rounded-2xl bg-clip-border">
                <div className="flex flex-wrap -mx-3">
                    <div className="flex w-auto max-w-full px-3">
                        <div className="relative inline-flex items-center justify-center text-base text-white transition-all duration-200 ease-in-out h-19 w-19 rounded-xl">
                        <Avatar src={<img src={"https://cdn-icons-png.flaticon.com/512/188/188987.png"} alt="Profile" />} />
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
                            <Spin size="large"/>
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
                                    >
                                    <div className="flex flex-wrap mt-4 -mx-3">
                                        <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                                            <Form.Item name="firstName">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">First Name</p>
                                                <Input disabled={!isEditting} value={initialValue.firstName}/>
                                                {/* <p>{employee.firstName}</p> */}
                                            </Form.Item>
                                        </div>

                                        <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                                            <Form.Item name="lastName">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700">Last Name</p>
                                                <Input value={initialValue.lastName} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mt-4 -mx-3">
                                        <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                                            <Form.Item name="email">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">Email</p>
                                                <Input value={initialValue.email} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>

                                        <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                                            <Form.Item name="phone">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">Phone</p>
                                                <Input value={initialValue.phone} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mt-4 -mx-3">
                                        <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                                            <Form.Item name="locationCountry">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">Location Country</p>
                                                <Input value={initialValue.locationCountry} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>

                                        <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                                            <Form.Item name="locationCity">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">Location City</p>
                                                <Input value={initialValue.locationCity} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap mt-4 -mx-3">
                                        <div className="w-full max-w-full px-3 flex-0 sm:w-6/12">
                                            <Form.Item name="startdate">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">Start Date</p>
                                                <Input value={initialValue.startdate} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>

                                        <div className="w-full max-w-full px-3 mt-4 flex-0 sm:mt-0 sm:w-6/12">
                                            <Form.Item name="role">
                                                <p className="mb-1 ml-1 text-xs font-bold text-slate-700 ">Role</p>
                                                <Input value={initialValue.role} className="focus:shadow-primary-outline text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none" disabled={!isEditting}/>
                                            </Form.Item>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 items-center justify-center">
                                        <Button type="primary" onClick={handleEditBtnClicked}>Edit</Button>
                                        <Button type="primary" onClick={handleSaveBtnClicked}>Save</Button>
                                    </div>
                                </Form>
                                )}
                            
                    </div>
                </div>
            </div>

        </>
    )
}