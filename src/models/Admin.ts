export interface Admin {
    objectKey: string;
    email: string;
    name: string;
    other_numbers: string;
    responsibilities: string;
    sex: string;
    user_id: string;
    whatsapp_number: string;
}

export const adminDefaultObject: Admin = {
    objectKey: "",
    email: "",
    name: "",
    other_numbers: "",
    responsibilities: "",
    sex: "",
    user_id: "",
    whatsapp_number: ""
}