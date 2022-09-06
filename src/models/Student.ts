export interface Student {
    additional_info: string;
    address: string;
    birth_certificate_photo_url?: string;
    current_class: string;
    date_of_birth: string;
    father_first_name: string;
    father_last_name: string;
    first_name: string;
    home_town: string;
    image_of_child_url: string;
    language_at_home: string;
    last_name: string;
    local_govt_area: string;
    mother_first_name: string;
    mother_last_name: string;
    sex: string;
    student_key: string;
}

export const studentDefaultObject : Student = {
    additional_info: "",
    address: "",
    birth_certificate_photo_url: "",
    current_class: "",
    date_of_birth: "",
    father_first_name: "",
    father_last_name: "",
    first_name: "",
    home_town: "",
    image_of_child_url: "",
    language_at_home: "",
    last_name: "",
    local_govt_area: "",
    mother_first_name: "",
    mother_last_name: "",
    sex: "",
    student_key: ""
}