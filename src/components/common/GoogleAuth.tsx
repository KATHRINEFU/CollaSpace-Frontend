import { Button } from "antd";
import { GoogleOutlined } from "@ant-design/icons";

export const GoogleAuthButton = ({} // liftData,
: {
  // liftData: (value: GoogleUserData) => void;
}) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const [fetched, setFetched] = useState(false);
  // const [tokens, { isLoading: fetchingTokens }] = useGetTokensMutation();

  // const fetchUserData = async (accessToken: string, idToken: string) => {
  // 	try {
  // 		setIsLoading(true);
  // 		const response = await fetch(
  // 			"https://www.googleapis.com/oauth2/v1/userinfo",
  // 			{
  // 				headers: {
  // 					Authorization: `Bearer ${accessToken}`,
  // 					Accept: "application/json",
  // 				},
  // 			}
  // 		);
  // 		const data = await response.json();

  // 		const userData = {
  // 			firstName: data.given_name,
  // 			lastName: data.family_name,
  // 			email: data.email,
  // 			profilePicture: data.picture,
  // 			token: idToken,
  // 		};
  // 		liftData(userData);
  // 		setIsLoading(false);
  // 		setFetched(true);
  // 	} catch (error) {
  // 		setIsLoading(false);
  // 	}
  // };

  // const getTokens = async (code: string) => {
  // 	try {
  // 		const { data } = await tokens({
  // 			code,
  // 		}).unwrap();
  // 		await fetchUserData(data.access_token, data.id_token);
  // 	} catch (error) {
  // 		console.log(error);
  // 	}
  // };

  // const loginHandler = useGoogleLogin({
  // 	onSuccess: (res) => getTokens(res.code),
  // 	onError: (error) => {
  // 		console.log("Login Failed:", error);
  // 	},
  // 	flow: "auth-code",
  // });

  return (
    <>
      <Button
        className="flex items-center"
        style={{ width: "85%" }}
        icon={<GoogleOutlined />}
      >
        {/* <img
				src="/google.svg"
				alt="Google Icon"
				style={{ width: '24px', height: '24px', marginRight: '8px' }}
			/> */}
        Continue With Google
      </Button>
    </>
  );
};
