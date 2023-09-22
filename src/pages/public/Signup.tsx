import { GoogleAuthButton } from "../../components/common/GoogleAuth"
import { Alert, Button, Form, Input, notification, Select, Spin } from "antd";
import { useState } from "react";
import { departmentOptions, roleOptions } from "../../utils/constants";
import moment from 'moment-timezone';
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/auth/authSlice";
import { useSignUpMutation } from "../../redux/auth/authApiSlice";


export const SignUp = () => {

    const [error, setError] = useState("");
    const [registerFormRef] = Form.useForm();
    const dispatch = useAppDispatch();
    const [signUp, { isLoading: isSubmitting }] = useSignUpMutation();

    moment.tz.setDefault("America/New_York");


    const handleSignup = async (values: {
		firstname: string;
        lastname: string;
        email: string;
        phone: string;
        location: string;
        department: string;
        role: string;
		password: string;
	}) => {

		try {
            console.log(values)
			const { data } = await signUp({
				...values,
			}).unwrap();

			dispatch(
				setCredentials({
					user: {
						...data,
					},
				})
			);
			notification.success({
				type: "success",
				message: "Register successful",
			});
			// navigate("/user/dashboard");
		} catch (error: any) {
			setError(error?.data?.message ?? error?.message);
		}
	};


    return (
        <>
            <Form
            form={registerFormRef}
            className="w-full text-center m-auto"
            onFinish={handleSignup}
            scrollToFirstError
            preserve={false}
		>
        <main className="mt-0 transition-all duration-200 ease-in-out w-full flex items-center justify-center bg-cover bg-[url('/src/assets/img/publicBackground.jpg')]">
        <div className="mt-24 mb-12 w-1/3 text-center relative z-0 flex flex-col min-w-0 break-words bg-white border-0 shadow-xl dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
            <div className="text-center border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6">
                {error && (
                    <Alert
                        message={`Error - ${error}`}
                        type="error"
                        showIcon
                        onClick={() => setError("")}
                    />
                )}
            <h2 className="mt-2 mb-4 text-xl">Sign Up</h2>

            <GoogleAuthButton/>
            </div>
            <div className="flex-auto p-12 pt-0 pb-6 text-center">
            <div className="mb-6 text-center text-slate-500">
                <small>Or Register with credentials</small>
            </div>

                <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your first name",
                            },
                        ]}
                        name="firstname"
                    >
                        <Input
                            size="small"
                            placeholder="Firstname"
                            className="h-8 text-sm input focus:shadow-primary-outline leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        />
                    </Form.Item>

                </div>


                <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your last name",
                            },
                        ]}
                        name="lastname"
                    >
                        <Input
                            size="small"
                            placeholder="Lastname"
                            className="h-8 text-sm input focus:shadow-primary-outline leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        />
                    </Form.Item>

                </div>


            
                <div className="mb-4">
                <Form.Item
                    className="mb-4"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your email",
                        },
                    ]}
                    name="email"
                >
                    <Input
                        size="small"
                        placeholder="Email"
                        className="h-8 text-sm input focus:shadow-primary-outline leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                    />
                </Form.Item>

                </div>

                <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your phone number",
                            },
                        ]}
                        name="phone"
                    >
                        <Input
                            size="small"
                            placeholder="+x xxxxxxxxx"
                            className="h-8 text-sm input focus:shadow-primary-outline leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        />
                    </Form.Item>

                </div>

                <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please enter your location",
                            },
                        ]}
                        name="location"
                    >
                        <Input
                            size="small"
                            placeholder="Office City"
                            className="h-8 text-sm input focus:shadow-primary-outline leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        />
                    </Form.Item>

                </div>

                <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please select your department",
                            },
                        ]}
                        name="department"
                    >

                        <Select
                            className=""
                            placeholder="Department"
                            allowClear
                            options={departmentOptions}
                        />
                    </Form.Item>
                </div>


                <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please select your role",
                            },
                        ]}
                        name="role"
                    >

                        <Select
                            className=""
                            placeholder="Role"
                            allowClear
                            options={roleOptions}
                        />
                    </Form.Item>
                </div>

                {/* <div className="mb-4">
                    <Form.Item
                        className="mb-4"
                        rules={[
                            {
                                required: true,
                                message: "Please select your birthday",
                            },
                        ]}
                        name="email"
                    >

                        <DatePicker
                            className="w-full h-8 text-sm input focus:shadow-primary-outline leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                            placeholder = "Select your birthday"
                        />
                    </Form.Item>
                </div> */}

                <div className="mb-4">
                
                <Form.Item
                    className="mb-4"
                    rules={[
                        {
                            required: true,
                            message: "Please enter your password",
                        },
                    ]}
                    name="password"
                >
                    <Input.Password
                        size="small"
                        placeholder="Password"
                        className="h-8 text-sm focus:shadow-primary-outline leading-5.6 ease w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        visibilityToggle
                    />
                </Form.Item>

                </div>

                <div className="mb-4">
                
                <Form.Item
                    className="mb-4"
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                              }
                              return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                          }),
                    ]}
                    name="confirmPassword"
                    dependencies={['password']}
                    hasFeedback
                >
                    <Input.Password
                        size="small"
                        placeholder="Confirm Password"
                        className="h-8 text-sm focus:shadow-primary-outline leading-5.6 ease w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 font-normal text-gray-700 transition-all focus:bg-white focus:text-gray-700 focus:outline-none focus:transition-shadow"
                        visibilityToggle
                    />
                </Form.Item>

                </div>
                
                <div className="text-center">
                    <Button
                        disabled={isSubmitting}
					    icon={isSubmitting ? <Spin size="small" /> : null}
                        htmlType="submit"
                        type="primary"
                        className="bg-primary-blue inline-block w-full px-5 py-2.5 mt-2 mb-3 text-sm font-bold text-center text-white align-middle transition-all ease-in bg-transparent border-0 rounded-lg shadow-md cursor-pointer active:-translate-y-px hover:-translate-y-px hover:shadow-xs leading-normal tracking-tight-rem bg-150 bg-x-25 bg-gradient-to-tl from-zinc-800 to-zinc-700 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                        style={{background: '#F9DFDC', height: '50px', color: 'black'}}
                    >
                        Sign up
                    </Button>{" "}
                </div>
            
            </div>
        </div>
        
            </main>
            </Form>
        </>
    )
} 