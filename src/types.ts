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

export interface IEmployee{
    id: number,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    location: string,
    departmentId: number,
    departmentName: string,
    birthday: Date,
    startDate: Date,
    role: string
}
export interface IAnnouncement {
    id: number,
    teamId: number,
    teamName: string,
    creatorId: number,
    creatorName: string,
    creationDate: Date,
    content: string,
}

export interface ITeam{
    id: number,
    name: string,
    creatorId: number,
    creatorName: string,
    creationDate: Date,
    description: string,
    type: string,
    departmentId?: number,
    departmentName?: string,
}

export interface IEvent{
    id: number,
    creationTeamId: number,
    creationTeamName: string,
    creatorId: number,
    creatorName: string,
    type: string,
    title: string,
    description: string,
    creationDate: Date,
}

export interface IDocumentEvent extends IEvent{
    link?:string,
    deadlineDate?:Date,
}

export interface IMeetingEvent extends IEvent{
    virtual: boolean,
    location?:string,
    link?:string,
    startTime: Date,
    endTime: Date,
    noteLink?: string,
    agendaLink?: string,
    meetingType?:string
}

export interface IActivityEvent extends IEvent{
    virtual: boolean,
    location?:string,
    startTime: Date,
    endTime: Date,
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
  