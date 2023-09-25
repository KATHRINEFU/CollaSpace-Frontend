import { PropsWithChildren, useEffect, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../redux/auth/authSlice';
import { useUser } from '../hooks/useUser';
import { notification } from 'antd';

const AuthProvider = ({ children }: PropsWithChildren): React.ReactNode => {
	const user = useUser()
	const [validatingToken, setValidatingToken] = useState(true);
	const dispatch = useAppDispatch()
	const navigate = useNavigate()

	const checkLoginState = async () => {
		setValidatingToken(true)
		try{
			if (!user) {
				dispatch(logOut());
				notification.error({
					message: "You are not authenticated to view this route",
					description: 'Please login again'
				});
				navigate('/login')
			}
		}catch(error: any){
			notification.error({
				message: 'Login state check failed',
				description: error.message ?? error
			});
		} finally{
			setValidatingToken(false)
		}

	}

	useEffect(() => {
		if (!user) {
			navigate('/login')
		}
	}, [navigate, user])

	useEffect(() => {
		checkLoginState()
	}, [])

	// TODO: Show loader instead of null
	return !validatingToken ? children : null
}

export default AuthProvider

