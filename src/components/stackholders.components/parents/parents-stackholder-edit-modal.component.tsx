import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { Student } from "models/Student";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    const { users } = useSelector((state: RootState) => state.users);
    const { loading } = useSelector((state: RootState) => state.parents);
    const { students } = useSelector((state: RootState) => state.students);

    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => {
        form.resetFields()
    }, [parent, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(editParent({
            newParent: {
                ...parent,
                ...values
            },
            user: users.find((user: User) => user.user_id === values.user_id)!,
            students: students.registered,
        }));
        handleCancel();
    }


    return (
        <Modal visible={isOpen} width={700} cancelText={t("common.cancel")}
            confirmLoading={loading}
            onOk={async () => {
                form.submit();
            }}
            onCancel={handleCancel}
            centered>
            <PageHeader
                style={{ padding: "0" }}
                title={t('parent.edit_parent')}
            />
            <Form
                name={"edit_parent"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={{
                    ...parent,
                    child_name: parent && (parent.child_name as string).split(', ')
                }}
            >
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="user_id"
                            label={t("common.user")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Select placeholder={t("common.user")}>
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
                            label={t("common.name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t("common.name")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="email"
                            label={t("common.email")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                                {
                                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: t("common.email_invalid")
                                }
                            ]}>
                            <Input placeholder={t("common.email")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="whatsapp_number"
                            label={t("common.whatsapp_number")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t("common.whatsapp_number")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="telegram_number"
                            label={t("parent.telegram")}
                        >
                            <Input placeholder={t("parent.telegram")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_phone_numbers"
                            label={t("common.other_numbers")}

                        >
                            <Input placeholder={t("common.other_numbers")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="place_of_work"
                            label={t("parent.work_place")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Input placeholder={t("parent.work_place")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="profession"
                            label={t("parent.profession")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Input placeholder={t("parent.profession")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="relationship"
                            label={t("parent.relationship")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Select placeholder={t("parent.relationship")} allowClear>
                                <Option value="father">
                                    {t('parent.father')}
                                </Option>
                                <Option value="mother">
                                    {t('parent.mother')}
                                </Option>
                                <Option value="guardian">
                                    {t('parent.guardian')}
                                </Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="child_name"
                            label={t("parent.children_names")}
                        >
                            <Select placeholder={t("common.child")} allowClear showArrow mode="multiple">
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
                </Row>
            </Form>
        </Modal>
    );
};

export default ParentStackholderEditModal;