import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
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
            confirmLoading={loading}
            onOk={async () => {
                form.submit();
            }}
            onCancel={handleCancel}
            centered>
            <PageHeader
                style={{ padding: "0" }}
                title={`Add Class`}
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
                        <Form.Item name="class_name" label="Class name">
                            <Input placeholder="Class name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="student_ids"
                            label="Students">
                            <Select placeholder="Students" mode="multiple" allowClear>
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
                            label="Teacher">
                            <Select placeholder="Teacher" allowClear>
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