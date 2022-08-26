export interface Class {
    class_name: string;
    assigned_teacher_app_key: string;
    student_ids: string;
}

export const classDefaultObject : Class = {
    class_name: "",
    assigned_teacher_app_key: "",
    student_ids: ""
}