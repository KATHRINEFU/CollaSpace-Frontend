import { GoogleAuthButton } from "../../components/common/GoogleAuth"
import { Alert, Button, Form, Input, Spin, notification } from "antd";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useIsCookieDisabled } from "../../hooks/useIsCookieDisabled";
import { setCredentials } from "../../redux/auth/authSlice";
// const [signIn, { isLoading }] = useSignInMutation();


export const Login = () => {

    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loginFormRef] = Form.useForm();
    const dispatch = useAppDispatch();
    const [isCookieDisabled] = useIsCookieDisabled();
    const [requireCookie, setRequireCookie] = useState(false);

    const handleSignupClick = () => {
		navigate("/sign-up");
	};

    const handleLogin = async (values: {
		email: string;
		password?: string;
		token?: string;
	}) => {
		if (isCookieDisabled) {
			setRequireCookie(true);
			return;
		}

		try {
            console.log(values)
			// const { data } = await signIn({
			// 	...values,
			// }).unwrap();

			// dispatch(
			// 	setCredentials({
			// 		user: {
			// 			...data,
			// 		},
			// 	})
			// );
			notification.success({
				type: "success",
				message: "Login successful",
			});
			navigate("/user/dashboard");
		} catch (error: any) {
			setError(error?.data?.message ?? error?.message);
		}
	};


    return (
        <>
        <Form
            form={loginFormRef}
            className="w-full text-center m-auto"
            onFinish={handleLogin}
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
            <h2 className="mt-2 mb-4 text-xl">Sign in</h2>
            {/* <div className="text-center">
                <a href="javascript:;" className="inline-block px-8 py-2 text-xs font-bold leading-normal text-center align-middle transition-all ease-in bg-transparent rounded-lg shadow-md cursor-pointer select-none active:-translate-y-px hover:-translate-y-px hover:shadow-xs text-slate-500 tracking-tight-rem">
                <img src="/src/assets/img/logos/google.svg" alt="social icon" className="w-3/10"/>
                Google
                </a>
            </div> */}

            <GoogleAuthButton/>
            </div>
            <div className="flex-auto p-12 pt-0 pb-6 text-center">
            <div className="mb-6 text-center text-slate-500">
                <small>Or sign in with credentials</small>
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
                <div className="min-h-6 mb-0.5 block pl-12 text-left">

                <input id="rememberMe" className="mt-0.5 rounded-10 duration-250 ease-in-out after:rounded-circle after:shadow-2xl after:duration-250 checked:after:translate-x-5.3 h-5 relative float-left -ml-12 w-10 cursor-pointer appearance-none border border-solid border-gray-200 bg-slate-800/10 bg-none bg-contain bg-left bg-no-repeat align-top transition-all after:absolute after:top-px after:h-4 after:w-4 after:translate-x-px after:bg-white after:content-[''] checked:border-blue-500/95 checked:bg-blue-500/95 checked:bg-none checked:bg-right" type="checkbox"/>
                <label className="ml-1 text-sm font-normal cursor-pointer select-none text-slate-700" htmlFor="rememberMe">Remember me</label>
                </div>
                <div className="text-center">
                    <Button
                        // disabled={isLoading}
                        // icon={isLoading ? <Spin size="small" /> : null}
                        type="primary"
                        htmlType="submit"
                        className="bg-primary-pink h-12 inline-block w-full px-5 py-2.5 mt-6 mb-2 text-sm font-bold text-center text-white align-middle transition-all ease-in border-0 rounded-lg shadow-md cursor-pointer active:-translate-y-px active:hover:text-white active:text-black hover:-translate-y-px hover:shadow-xs leading-normal tracking-tight-rem hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                        style={{background: '#0A81AB', height: '50px'}}
                    >
                        Sign in
                    </Button>{" "}

                </div>
                <div className="relative w-full max-w-full px-3 mb-2 text-center shrink-0">
                <p className="inline mb-2 px-4 text-slate-400 bg-white z-2 text-sm leading-normal font-semibold before:bg-gradient-to-r before:from-transparent before:via-neutral-500/40 before:to-neutral-500/40 before:right-2 before:-ml-1/2 before:content-[''] before:inline-block before:w-3/10 before:h-px before:relative before:align-middle after:left-2 after:-mr-1/2 after:bg-gradient-to-r after:from-neutral-500/40 after:via-neutral-500/40 after:to-transparent after:content-[''] after:inline-block after:w-3/10 after:h-px after:relative after:align-middle">or</p>
                </div>
                <div className="text-center">
                    <Button
                        // disabled={isLoading}
                        type="primary"
                        className="bg-primary-blue inline-block w-full px-5 py-2.5 mt-2 mb-3 text-sm font-bold text-center text-white align-middle transition-all ease-in bg-transparent border-0 rounded-lg shadow-md cursor-pointer active:-translate-y-px hover:-translate-y-px hover:shadow-xs leading-normal tracking-tight-rem bg-150 bg-x-25 bg-gradient-to-tl from-zinc-800 to-zinc-700 hover:border-slate-700 hover:bg-slate-700 hover:text-white"
                        style={{background: '#F9DFDC', height: '50px', color: 'black'}}
                        onClick={handleSignupClick}
                    >
                        Sign up
                    </Button>{" "}
                </div>

                <div className="flex-auto p-12 pt-0 pb-6 text-center">
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                        {/* Forgot your password?{" "} */}
                        <Link
                            to="/forgot-password"
                            className="font-medium text-primary-purple hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </p>
                </div>
            
            </div>
        </div>
        
            </main>
            </Form>
        </>
    )
} 