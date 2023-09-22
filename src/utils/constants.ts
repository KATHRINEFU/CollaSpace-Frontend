import { SelectProps } from "antd";

export const CS_LOCAL_STORAGE = 'cs_user'
export const CS_TOKEN = 'cs_at'

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
]

export const roleOptions: SelectProps["options"] = [
    {
        label: 'Manager',
        value: 'Manager',
    },
    {
        label: 'Staff',
        value: 'Staff',
    },
    {
        label: 'Intern',
        value: 'Intern',
    },
]