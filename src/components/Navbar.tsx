import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";

export default function Navbar() {
	const navigate = useNavigate();
	const handleSigninClicked = () => {
		navigate("/login");
	};

	const handleSignupClicked = () => {
		navigate("/sign-up");
	};

	return (
		<>
			<div className="flex justify-center m-0 font-sans text-base antialiased font-normal text-left bg-transparent leading-default text-slate-500">
				<header className="fixed flex items-center z-30 md:bg-opacity-70 transition duration-300 ease-in-out flex-wrap justify-between w-full max-w-[90rem] mx-auto h-16 px-4 py-1 mt-4 shadow-md backdrop-blur-2xl backdrop-saturate-200 rounded-xl lg:flex-nowrap lg:justify-start">
					<div className="container h-16 flex flex-wrap items-center justify-between px-0 lg-max:overflow-hidden lg:flex-nowrap">
						<div className="w-full h-16 sm:px-6 xl:px-0">
							<div className="flex items-center justify-between h-16 gap-2">
								{/* Logo */}
								<div className="shrink-0 mr-4">
								</div>

								{/* Navigations */}

								<nav className="md:flex md:grow">
									<ul className="flex grow justify-end space-x-6 items-center">
										<li className="px-5 py-3">
											<Button
												type="primary"
												className="bg-primary-purple text-center w-24"
												onClick={handleSigninClicked}
											>
												Log In
											</Button>
										</li>
										<li className="px-5 py-3">
											<Button
												type="primary"
												className="text-center w-24"
												onClick={handleSignupClicked}
												style={{ backgroundColor: "black", color: "white" }}
											>
												Sign Up
											</Button>
										</li>
									</ul>
								</nav>
							</div>
						</div>
					</div>
				</header>
			</div>
		</>
	);
}
