export interface User{
    child_key: string | string[];
    email: string;
    enrolled: string;
    first_name: string;
    has_child_in_citigems: string;
    last_name: string;
    other_numbers: string;
    parent_key: string;
    photo_url: string;
    role: string;
    selected_role: string;
    user_id: string;
    whatsapp_number: string;
}

export const userDefaultObject : User = {
    child_key: "",
    email: "",
    enrolled: "",
    first_name: "",
    has_child_in_citigems: "",
    last_name: "",
    other_numbers: "",
    parent_key: "",
    photo_url: "",
    role: "",
    selected_role: "",
    user_id: "",
    whatsapp_number: ""
}