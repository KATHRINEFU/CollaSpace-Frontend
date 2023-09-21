export enum HTTP {
    POST = "POST",
    GET = "GET",
    PATCH = "PATCH",
    DELETE = "DELETE",
    PUT = "PUT",
}

export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    token?: string;
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
  