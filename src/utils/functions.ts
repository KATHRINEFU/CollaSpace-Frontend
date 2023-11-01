import { ITicket } from "../types";

export function mapToDocumentEvent(data: any) {
  return {
    eventId: data.eventId,
    eventCreationdate: new Date(data.eventCreationdate),
    team: data.team,
    eventCreator: data.eventCreator,
    eventType: data.eventType,
    eventTitle: data.eventTitle,
    eventDescription: data.eventDescription,
    eventExpired: data.eventExpired,
    eventLastUpdatedate: data.eventLastUpdatedate
      ? new Date(data.eventLastUpdatedate)
      : undefined,
    collaborations: data.collaborations,
    link: data.documentLink || null,
    deadlineDate: data.deadline ? new Date(data.deadline) : undefined,
  };
}

export function mapToMeetingEvent(data: any) {
  return {
    eventId: data.eventId,
    eventCreationdate: new Date(data.eventCreationdate),
    team: data.team,
    eventCreator: data.eventCreator,
    eventType: data.eventType,
    eventTitle: data.eventTitle,
    eventDescription: data.eventDescription,
    eventExpired: data.eventExpired,
    eventLastUpdatedate: data.eventLastUpdatedate
      ? new Date(data.eventLastUpdatedate)
      : undefined,
    collaborations: data.collaborations,
    virtual: data.meetingVirtual,
    location: data.meetingLocation,
    link: data.meetingLink,
    startTime: data.meetingStarttime
      ? new Date(data.meetingStarttime)
      : undefined,
    endTime: data.meetingEndtime ? new Date(data.meetingEndtime) : undefined,
    noteLink: data.meetingNoteLink,
    agendaLink: data.meetingAgendaLink,
    meetingType: data.meetingType,
  };
}

export function mapToActivityEvent(data: any) {
  return {
    eventId: data.eventId,
    eventCreationdate: new Date(data.eventCreationdate),
    team: data.team,
    eventCreator: data.eventCreator,
    eventType: data.eventType,
    eventTitle: data.eventTitle,
    eventDescription: data.eventDescription,
    eventExpired: data.eventExpired,
    eventLastUpdatedate: data.eventLastUpdatedate
      ? new Date(data.eventLastUpdatedate)
      : undefined,
    collaborations: data.collaborations,
    virtual: data.activityVirtual,
    location: data.activityLocation,
    startTime: data.activityStarttime
      ? new Date(data.activityStarttime)
      : undefined,
    endTime: data.activityEndtime ? new Date(data.activityEndtime) : undefined,
  };
}

export function mapEventDataToEvent(eventData: any) {
  switch (eventData.eventType) {
    case "document":
      return mapToDocumentEvent(eventData);
    case "meeting":
      return mapToMeetingEvent(eventData);
    case "activity":
      return mapToActivityEvent(eventData);
    default:
      return null;
  }
}

export function mapDataToTickets(data: any) {
  return {
    ticketId: data.ticketId,
    ticketCreator: data.ticketCreator,
    ticketCreatorName: data.ticketCreatorName,
    ticketCreationdate: data.ticketCreationdate,
    ticketLastUpdatedate: data.ticketLastUpdatedate,
    ticketTitle: data.ticketTitle,
    ticketDescription: data.ticketDescription,
    ticketStatus: data.ticketStatus,
    priority: data.ticketPriority,
    fromTeamId: data.ticketFromTeam,
    fromTeamName: data.fromTeamName,
    dueDate: data.ticketDuedate,
    assigns: data.assigns,
    ticketLogs: data.ticketLogs,
    files: data.files,
  };
}

export function mapDataToEmployee(data: any){
  return {
    id: data.employeeId,
    firstName: data.employeeFirstname,
    lastName: data.employeeLastname,
    email: data.employeeEmail,
    phone: data.employeePhone,
    locationCountry: data.employeeLocationCountry,
    locationCity: data.employeeLocationCity,
    departmentId: data.departmentId,
    departmentName: data.departmentName,
    startdate: data.employeeStartdate,
    role: data.employeeRole,
  }
}

export function mapEventToCalendarItem(data: any) {
  let date;
  if (data.eventType === "document") {
    date = data.dueDate;
  } else if (data.event === "meeting" || data.eventType === "activity") {
    date = data.startTime;
  }

  return {
    id: "event" + data.eventId,
    date: date ? date : new Date(),
    type: "success",
    content: data.eventTitle,
  };
}

export function mapTicketToCalendarItem(data: ITicket) {
  return {
    id: "ticket" + data.ticketId,
    date: data.dueDate ? new Date(data.dueDate) : new Date(),
    type: "error",
    content: data.ticketTitle,
  };
}

export const getEventTypeColor = (eventType: string) => {
  switch (eventType) {
    case "document":
      return "#5cdbd3";
    case "meeting":
      return "#ffd666";
    case "activity":
      return "#b37feb";
    default:
      return "";
  }
};

export function getFormattedDate(date: Date) {
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var year = date.getFullYear();
  var hour = ("0" + date.getHours()).slice(-2);
  var min = ("0" + date.getMinutes()).slice(-2);
  var seg = ("0" + date.getSeconds()).slice(-2);
  return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg;
}
