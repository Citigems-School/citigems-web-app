import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Parent } from "../../../models/Parent";
import { Student } from "../../../models/Student";
import { User } from "../../../models/User";
import { addParent } from "../../../store/reducers/parentsSlice";
import { removeUser } from "../../../store/reducers/usersSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface ParentStackholderAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
    defaultObject?: Parent;
    closeAddUserModal?: () => void;

}

const ParentStackholderAddModal = ({ defaultObject, isOpen, closeModal, closeAddUserModal }: ParentStackholderAddModalProps) => {

    const { loading } = useSelector((state: RootState) => state.parents);
    const { users } = useSelector((state: RootState) => state.users);
    const { students } = useSelector((state: RootState) => state.students);

    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [isOpen]);

    const handleCancel = () => {
        if (!isNil(defaultObject)) {
            thunkDispatch(removeUser(defaultObject.user_id))
        }
        form.resetFields();
        closeModal();
        closeAddUserModal?.();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(addParent({
            newParent: values,
            students: students.registered.concat(students.unregistered)
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
                title={`Add Parent`}
            />
            <Form
                name={"add_parent"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={defaultObject}
            >
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="user_id"
                            label="User"
                            rules={!defaultObject ? [
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ] : undefined}>
                            <Select placeholder="User" disabled={!isNil(defaultObject)}>
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
                            <Input disabled={!isNil(defaultObject)} placeholder="Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={!defaultObject ? [


                                {
                                    required: true,
                                    message: "This field is required"
                                },
                                {
                                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "E-mail is invalid"
                                }
                            ] : undefined}>
                            <Input disabled={!isNil(defaultObject)} placeholder="E-mail" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="whatsapp_number"
                            label="WhatsApp Number"
                            rules={!defaultObject ? [
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ] : undefined}>
                            <Input disabled={!isNil(defaultObject)} placeholder="WhatsApp Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="telegram_number"
                            label="Telegram Number"
                        >
                            <Input placeholder="Telegram Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_phone_numbers"
                            label="Other Number"
                        >
                            <Input disabled={!isNil(defaultObject)} placeholder="Other Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="place_of_work"
                            label="Place of work"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input placeholder="Place of work" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="profession"
                            label="Profession"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input placeholder="Profession" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="relationship"
                            label="Relationship"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Select placeholder="Relationship">
                                <Option>
                                    Single
                                </Option>
                                <Option>
                                    Married
                                </Option>
                                <Option>
                                    Separated
                                </Option>
                                <Option>
                                    Divorced
                                </Option>
                                <Option>
                                    Widowed
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="child_name"
                            label="Children names"

                        >
                            <Select disabled={!isNil(defaultObject)} placeholder="Child" allowClear showArrow mode="multiple">
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
                </Row>
            </Form>
        </Modal>
    );
};

export default ParentStackholderAddModal;