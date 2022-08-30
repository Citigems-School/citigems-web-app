import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { Student } from "models/Student";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Parent } from "../../../models/Parent";
import { User } from "../../../models/User";
import { editParent } from "../../../store/reducers/parentsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface ParentStackholderEditModalProps {
    parent: Parent;
    isOpen: boolean;
    closeModal: () => void;
}

const ParentStackholderEditModal = ({ parent, isOpen, closeModal }: ParentStackholderEditModalProps) => {

    const { users } = useSelector((state: RootState) => state.users);
    const { loading } = useSelector((state: RootState) => state.admins);
    const { students } = useSelector((state: RootState) => state.students);

    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [parent, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(editParent({
            ...parent,
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
                title={`Edit Parent`}
            />
            <Form
                name={"edit_parent"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={parent}
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
                            name="telegram_number"
                            label="Telegram Number"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Telegram Number" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_phone_numbers"
                            label="Other Number"

                        >
                            <Input placeholder="Other Number" />
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
                            <Input placeholder="Relationship" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="child_name"
                            label="Children names"
                        >
                            <Select placeholder="Child" allowClear showArrow mode="multiple">
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

export default ParentStackholderEditModal;