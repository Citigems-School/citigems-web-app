import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Admin } from "../../../models/Admin";
import { User } from "../../../models/User";
import { addAdmin } from "../../../store/reducers/adminsSlice";
import { removeUser } from "../../../store/reducers/usersSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface AdminStackholderAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
    defaultObject?: Admin;
    closeAddUserModal?: () => void;

}

const AdminStackholderAddModal = ({ defaultObject, isOpen, closeModal, closeAddUserModal }: AdminStackholderAddModalProps) => {

    const { users } = useSelector((state: RootState) => state.users);
    const { loading } = useSelector((state: RootState) => state.admins);
    const [isDone, setIsDone] = useState(false)
    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => {
        setIsDone(false);
        form.resetFields();
    }, [isOpen]);

    const handleCancel = () => {
        if (!isNil(defaultObject) && isDone) {
            thunkDispatch(removeUser(defaultObject.user_id))
        }
        form.resetFields();
        closeModal();
        closeAddUserModal?.();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(addAdmin(values));
        setIsDone(isDone);
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
                title={`Add admin`}
            />
            <Form
                name={"add_booking_form"}
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
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
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
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder="Name" />
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
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder="E-mail" />
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
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder="WhatsApp Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_numbers"
                            label="Other Number"
                        >
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder="Other Number" />
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
                            name="responsibilities"
                            label="Responsibilities"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input placeholder="Responsibilities" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AdminStackholderAddModal;