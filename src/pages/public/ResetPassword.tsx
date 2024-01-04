import { useState } from "react";
import { Alert, Button, Form, Input, notification } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CollaSpaceLogo from "/logoIcon.png";

export const ResetPassword = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [resetPasswordFormRef] = Form.useForm();
  const queryParameters = new URLSearchParams(window.location.search);
  const userToken = queryParameters.get("token") ?? "";

  const handleResetPassword = (values: any) => {
    const payload = {
      email: values.email,
      token: userToken,
      newPassword: values.password,
    };

    axios
      .post("/api/auth/reset", payload)
      .then((r) => {
        if (r.status >= 200 && r.status < 300) {
          notification.success({
            type: "success",
            message: "Reset password success",
          });
          navigate("/login");
        } else {
          notification.error({
            type: "error",
            message: "Failed to reset password",
          });
        }
      })
      .catch(() => {
        setError("Failed to reset password");
      });
  };
  return (
    <div className="m-0 font-sans text-base antialiased font-normal text-left leading-default text-slate-500 bg-cover bg-[url('/src/assets/img/oceanBackground.jpg')]">
      <main className="mt-0 transition-all duration-200 ease-in-out">
        <Form
          form={resetPasswordFormRef}
          onFinish={handleResetPassword}
          layout="vertical"
          className="w-full"
          scrollToFirstError
          preserve={false}
        >
          <div className="pb-0 pt-0 justify-center h-full min-h-screen items-start p-0 relative overflow-hidden flex bg-cover bg-center bg-[url('/images/forgotPasswordBackground.png')]">
            <div className="container w-80 md:w-full">
              <div className="flex flex-wrap justify-center -mx-3">
                <div className="w-full max-w-full px-5 mx-auto shrink-0 md:flex-0 md:w-7/12 lg:w-4/12">
                  <div className="relative z-0 flex flex-col min-w-0 mt-40 mb-6 break-words bg-white border-0 shadow-xl sm:mt-48 dark:bg-slate-850 dark:shadow-dark-xl rounded-2xl bg-clip-border">
                    <div className="border-black/12.5 rounded-t-2xl border-b-0 border-solid p-6 text-center pt-6 pb-1">
                      {error && (
                        <Alert
                          message={`Error - ${error}`}
                          type="error"
                          showIcon
                          onClick={() => setError("")}
                        />
                      )}

                      <Link
                        to="/"
                        className="flex items-center justify-center mb-6 text-2xl font-semibold"
                      >
                        <div className="h-20 bg-transparent">
                          <img
                            src={CollaSpaceLogo}
                            alt="Spur Text"
                            className="h-20"
                          />
                        </div>
                      </Link>
                    </div>
                    <h4 className="mb-1 font-bold text-center text-2xl">
                      Reset password?
                    </h4>
                    <p className="mb-0 text-center">
                      Input your email and new password
                    </p>

                    <div className="flex-auto p-6 text-center">
                      <div className="mb-4">
                        <Form.Item
                          className="!-mb-0"
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
                            className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                          />
                        </Form.Item>
                      </div>

                      <div className="mb-4">
                        <Form.Item
                          className="!-mb-0"
                          rules={[
                            {
                              required: true,
                              message: "Please enter your new password",
                            },
                          ]}
                          name="password"
                        >
                          <Input.Password
                            size="small"
                            placeholder="new password"
                            className="focus:shadow-primary-outline dark:bg-slate-850 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none"
                          />
                        </Form.Item>
                      </div>

                      <div className="text-center">
                        <Button
                          className="inline-block w-full px-16 py-3.5 mb-2 mt-6 font-bold text-center text-white align-middle transition-all border-0 rounded-lg cursor-pointer hover:-translate-y-px active:-translate-y-px hover:shadow-xs dark:bg-gradient-to-tl dark:from-slate-750 dark:to-gray-850 bg-gradient-to-tl from-zinc-800 to-zinc-700 leading-normal text-sm ease-in tracking-tight-rem shadow-md bg-150 bg-x-25"
                          type="primary"
                          htmlType="submit"
                        >
                          Reset Password
                        </Button>{" "}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </main>
    </div>
  );
};
