import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { Class } from "models/Class";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Teacher } from "../../../models/Teacher";
import { User } from "../../../models/User";
import { editTeacher } from "../../../store/reducers/teachersSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface TeacherStackholderEditModalProps {
    teacher: Teacher;
    isOpen: boolean;
    closeModal: () => void;
}

const TeacherStackholderEditModal = ({ teacher, isOpen, closeModal }: TeacherStackholderEditModalProps) => {

    const { loading } = useSelector((state: RootState) => state.admins);
    const { users } = useSelector((state: RootState) => state.users);
    const { classes } = useSelector((state: RootState) => state.classes);
    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [teacher, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(editTeacher({
            ...teacher,
            ...values
        }));
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
                title={`Edit Teacher`}
            />
            <Form
                name={"edit_teacher"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={{
                    ...teacher,
                    classes: teacher && teacher.classes.split(', ').join(',').split(',')
                }}
            >
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="user_id"
                            label="User Id"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Select placeholder="User">
                                {
                                    users.map(
                                        (user: User) => <Option value={user.user_id}>
                                            {
                                                user.first_name + " " + user.last_name
                                            }
                                        </Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="phone_number"
                            label="Phone Number"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]}>
                            <Input placeholder="Phone Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_numbers"
                            label="Other Numbers"
                        >
                            <Input placeholder="Other Numbers" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="sex"
                            label="Sex"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Select placeholder="Sex">
                                <Option key="male">Male</Option>
                                <Option key="female">Female</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="nationality"
                            label="Nationality"
                        >
                            <Input placeholder="Nationality" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="marital_status"
                            label="Marital Status"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Select placeholder="Marital Status">
                                <Option value="single">
                                    Single
                                </Option>
                                <Option value="married">
                                    Married
                                </Option>
                                <Option value="separated">
                                    Separated
                                </Option>
                                <Option value="divorced">
                                    Divorced
                                </Option>
                                <Option value="widowed">
                                    Widowed
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="classes"
                            label="Classes"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Select placeholder="Classes" allowClear showArrow mode="multiple">
                                {
                                    classes.map(
                                        (classObj: Class) => <Option value={classObj.class_name}>
                                            {
                                                classObj.class_name
                                            }
                                        </Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="salary"
                            label="Salary"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input type="number" placeholder="Salary" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default TeacherStackholderEditModal;