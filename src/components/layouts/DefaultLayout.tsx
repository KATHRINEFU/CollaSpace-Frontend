import { Outlet, useNavigate } from "react-router-dom";
import ErrorBoundary from "../ErrorBoundary";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useUser } from "../../hooks/useUser";
import { useEffect } from "react";
import { Login } from "../../pages/public/Login";

export default function DefaultLayout() {
	const user = useUser();
	const navigate = useNavigate();

	useEffect(() => {
		if (user) {
			navigate("/user/dashboard");
		}else{
			navigate("/login")
		}
	}, [navigate, user]);
	return (
		<div className="flex flex-col">
			<Navbar />
			<main className="">
				<Login/>
				{/* <ErrorBoundary> */}
					{/* <Outlet /> */}
				{/* </ErrorBoundary> */}
			</main>
			<Footer />
		</div>
	);
}
