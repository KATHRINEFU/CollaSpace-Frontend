import * as AntdIcons from "@ant-design/icons";

export enum HTTP {
  POST = "POST",
  GET = "GET",
  PATCH = "PATCH",
  DELETE = "DELETE",
  PUT = "PUT",
}

export interface IClient {
  account: IAccount;
  company: ICompany;
}

export interface IAccount {
  accountId: number;
  accountType: string;
  companyId: number;
  accountCurrentStatus: string;
  accountCurrentResponsibleDepartmentId: number;
  biddingPersonnel: number;
  salesPersonnel: number;
  solutionArchitectPersonnel: number;
  accountCreationdate: Date; 
  accountLastUpdatedate: Date;
  customerSuccessPersonnel: number;
}

export interface ICompany{

  companyId: number;
  companyName: string;
  companyWebsite: string;
  joindate: Date;
  companyLogoUrl: string;

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

export interface IEmployee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  departmentId: number;
  departmentName: string;
  birthday: Date;
  startDate: Date;
  role: string;
}
export interface IAnnouncement {
  id: number;
  teamId: number;
  teamName: string;
  creatorId: number;
  creatorName: string;
  creationDate: Date;
  content: string;
}

export interface ITeam {
  teamId: number;
  teamName: string;
  teamCreator: number;
  teamCreationdate: Date;
  teamType: string;
  teamDepartmentId?: number;
}

export interface IEvent {
  eventId: number;
  eventCreationdate?: Date;
  team: ITeam;
  eventCreator: number;
  eventType: string;
  eventTitle: string;
  eventDescription: string;
  eventExpired: boolean;
  eventLastUpdatedate: Date;
  collaborations: IEventCollaboration[];
}

export interface IEventCollaboration {
  eventCollaborationId: number;
  team: ITeam;
  invitedate: Date;
  acceptStatus: boolean;
  teamRole: string;
}

export interface IDocumentEvent extends IEvent {
  link?: string;
  deadlineDate?: Date;
}

export interface IMeetingEvent extends IEvent {
  virtual: boolean;
  location?: string;
  link?: string;
  startTime: Date;
  endTime: Date;
  noteLink?: string;
  agendaLink?: string;
  meetingType?: string;
}

export interface IActivityEvent extends IEvent {
  virtual: boolean;
  location?: string;
  startTime: Date;
  endTime: Date;
}

export interface ITicket {
  id: number;
  creatorId: number;
  creatorName: string;
  creationDate?: Date;
  title: string;
  description: string;
  status: string;
  priority: number;
  fromTeamId: number;
  fromTeamName: string;
  toTeamId: number;
  toTeamName: string;
  assignToName: string;
  viewers: string[];
  files: string[];
  dueDate?: Date;
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
