import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Parent } from "../../models/Parent";
import { Student } from "../../models/Student";
import { User } from "../../models/User";
import { editUser } from "../../store/reducers/usersSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";

interface UserEditModalProps {
    user: User;
    isOpen: boolean;
    closeModal: () => void;
}

const UserEditModal = ({ user, isOpen, closeModal }: UserEditModalProps) => {

    const { loading } = useSelector((state: RootState) => state.users);
    const { parents } = useSelector((state: RootState) => state.parents);
    const { students } = useSelector((state: RootState) => state.students);

    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [user, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(editUser({
            ...user,
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
                title={`Edit user`}
            />
            <Form
                name={"add_booking_form"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={{
                    ...user,
                    parent: !isNil(user) && user.parent_key !== "" ? user.parent_key : undefined,
                    child_key: !isNil(user) && user.child_key !== "" ? (user.child_key as string).split(', ') : undefined
                }}
            >
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="first_name"
                            label="First name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="First Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="last_name"
                            label="Last name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Last Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                                {
                                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "E-mail is invalid"
                                }
                            ]}>
                            <Input placeholder="E-mail" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="whatsapp_number"
                            label="WhatsApp Number"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="WhatsApp Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_numbers"
                            label="Other Number"
                        >
                            <Input placeholder="Other Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="photo_url"
                            label="Photo URL">
                            <Input placeholder="Photo URL" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="parent_key"
                            label="Parent">
                            <Select value={!isNil(user) && form.getFieldValue('parent_key') !== "" ? form.getFieldValue('parent_key') : undefined} placeholder="Parent">
                                {
                                    parents.map(
                                        (parent: Parent) => <Option value={parent.objectKey}>
                                            {
                                                parent.name
                                            }
                                        </Option>
                                    )
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="child_key"
                            label="Child">
                            <Select allowClear showArrow mode="multiple"
                                placeholder="Child">
                                {
                                    students.registered.concat(students.unregistered).map(
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
                            name="role"
                            label="Role">
                            <Select placeholder="Role">
                                <Option key="admin">Admin</Option>
                                <Option key="parent">Parent</Option>
                                <Option key="teacher">Teacher</Option>
                                <Option key="guest">Guest</Option>
                                <Option key="Enseignant(e)">Enseignant(e)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="selected_role"
                            label="Selected Role">
                            <Select placeholder="Selected Role">
                                <Option key="admin">admin</Option>
                                <Option key="Administrator">Administrator</Option>
                                <Option key="parent">Parent</Option>
                                <Option key="teacher">Teacher</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <Form.Item
                            name="has_child_in_citigems"
                            label="Has child in citigems?"
                            valuePropName={"checked"}>
                            <Switch
                                checkedChildren={"Yes"}
                                unCheckedChildren={"No"}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <Form.Item
                            name="enrolled"
                            label="Enrolled"
                            valuePropName={"checked"}>
                            <Switch
                                checkedChildren={"Yes"}
                                unCheckedChildren={"No"}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default UserEditModal;