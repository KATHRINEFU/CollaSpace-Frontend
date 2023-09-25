import * as AntdIcons from "@ant-design/icons"

export enum HTTP {
    POST = "POST",
    GET = "GET",
    PATCH = "PATCH",
    DELETE = "DELETE",
    PUT = "PUT",
}
export interface ISignIn {
    email: string;
    password?: string;
    token?: string;
}
export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
}

export type IconName = keyof typeof AntdIcons;
export interface INav {
    name: string;
    path: string;
    icon: React.ReactNode;
  }

export enum environment {
    PRODUCTION = "production",
    DEVELOPMENT = "development",
}

export interface GoogleUserData {
firstName: string;
lastName: string;
email: string;
profilePicture: string;
token: string;
}
  