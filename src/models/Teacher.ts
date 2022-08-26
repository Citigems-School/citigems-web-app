export interface Teacher {
    objectKey:string;
    classes: string;
    marital_status: string;
    name: string;
    nationality: string;
    other_numbers: string;
    phone_number: string;
    salary: string;
    sex: string;
    user_id: string;
}

export const teacherDefaultObject:Teacher = {
    objectKey: "",
    classes: "",
    marital_status: "",
    name: "",
    nationality: "",
    other_numbers: "",
    phone_number: "",
    salary: "",
    sex: "",
    user_id: ""
}