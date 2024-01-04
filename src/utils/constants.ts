import { SelectProps } from "antd";

export const CS_LOCAL_STORAGE = "cs_user";
export const CS_TOKEN = "cs_at";

export const departmentOptions: SelectProps["options"] = [
  {
    label: "Bidding",
    value: "Bidding",
  },
  {
    label: "Sales",
    value: "Sales",
  },
  {
    label: "Solution Architect",
    value: "Solution Architect",
  },
  {
    label: "Customer Success",
    value: "Customer Success",
  },
  {
    label: "Product",
    value: "Product",
  },
  {
    label: "Marketing",
    value: "Marketing",
  },
  {
    label: "General Management",
    value: "General Management",
  },
];

export const roleOptions: SelectProps["options"] = [
  {
    label: "Manager",
    value: "Manager",
  },
  {
    label: "Staff",
    value: "Staff",
  },
  {
    label: "Intern",
    value: "Intern",
  },
];

export const clientStatusByDepartment = [
  {
    departmentId: 1,
    department: "Bidding",
    processes: ["Initial Reachout", "Presale Demo", "Intention Confirmed"],
  },
  {
    departmentId: 2,
    department: "Sales",
    processes: [
      "Requirement Analysis",
      "Requirement Review",
      "Solution Overview",
      "Pricing",
      "Contract Signing",
      "Contract Review",
      "Contract Confirmed",
    ],
  },
  {
    departmentId: 3,
    department: "Solution Architect",
    processes: [
      "Technical Implementation Planning",
      "Technical Implementation",
      "Testing",
      "Trouble Shooting",
      "Technical Implementation Completed",
    ],
  },
  {
    departmentId: 4,
    department: "Customer Success",
    processes: [
      "Training",
      "Networking",
      "Routine Maintenance",
      "Contract Renew",
      "Leaving",
    ],
  },
];

export const TicketStatus = {
  NEW: "new",
  PENDING: "pending",
  IN_PROGRESS: "in progress",
  UNDER_REVIEW: "under review",
  RESOLVED: "resolved",
};

export const TicketRole = {
  CREATOR: "creator",
  ASSIGNEE: "assignee",
  VIEWER: "viewer",
  SUPERVISOR: "supervisor",
};
