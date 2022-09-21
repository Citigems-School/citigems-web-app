import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Class } from "../../models/Class";
import { Student } from "../../models/Student";
import { Teacher } from "../../models/Teacher";
import { addClass, editClass } from "../../store/reducers/classesSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";

interface ClassAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const ClassAddModal = ({ isOpen, closeModal }: ClassAddModalProps) => {

    const {t} = useTranslation();

    const { loading } = useSelector((state: RootState) => state.classes);
    const { students } = useSelector((state: RootState) => state.students);
    const { teachers } = useSelector((state: RootState) => state.teachers);
    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [isOpen]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(addClass(values));
        handleCancel();
    }

    return (
        <Modal visible={isOpen} width={700}
        cancelText={t("common.cancel")}
            confirmLoading={loading}
            onOk={async () => {
                form.submit();
            }}
            onCancel={handleCancel}
            centered>
            <PageHeader
                style={{ padding: "0" }}
                title={t('classes.add_class')}
            />
            <Form
                name={"add_booking_form"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
            >
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item name={"class_name"} label={t("classes.class_name")}>
                            <Input placeholder={t("classes.class_name")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="student_ids"
                            label={t("classes.students")}>
                            <Select placeholder={t("classes.students")} mode="multiple" allowClear>
                                {
                                    students.registered.map(
                                        (student: Student) => <Option value={student.student_key}>
                                            {
                                                student.first_name + " " + student.last_name
                                            }
                                        </Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="assigned_teacher_app_key"
                            label={t("classes.teacher")}>
                            <Select placeholder={t("classes.teacher")} allowClear>
                                {
                                    teachers.map(
                                        (teacher: Teacher) => <Option value={teacher.objectKey}>
                                            {
                                                teacher.name
                                            }
                                        </Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default ClassAddModal;