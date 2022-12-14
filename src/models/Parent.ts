export interface Parent {
    objectKey: string;
    child_name: string | string[];
    email: string;
    name: string;
    number_of_children: string;
    other_phone_numbers: string;
    place_of_work: string;
    profession: string;
    relationship: string;
    telegram_number: string;
    user_id: string;
    whatsapp_number: string;
}

export const parentDefaultObject: Parent = {
    objectKey: "",
    child_name: "",
    email: "",
    name: "",
    number_of_children: "",
    other_phone_numbers: "",
    place_of_work: "",
    profession: "",
    relationship: "",
    telegram_number: "",
    user_id: "",
    whatsapp_number: ""
}