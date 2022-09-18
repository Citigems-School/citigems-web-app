import { Col, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    const { users } = useSelector((state: RootState) => state.users);
    const { loading } = useSelector((state: RootState) => state.admins);
    const [isDone, setIsDone] = useState(false)
    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => {
        form.resetFields();
    }, [isOpen]);

    const handleCancel = () => {
        if (!isNil(defaultObject) && !isDone) {
            thunkDispatch(removeUser(defaultObject.user_id))
        }
        form.resetFields();
        closeModal();
        closeAddUserModal?.();
    };

    const handleExit = () => {
        form.resetFields();
        closeModal();
        closeAddUserModal?.();
    }

    async function handleSubmit(values: any) {
        await thunkDispatch(addAdmin(values));
        setIsDone(true);
        handleExit();
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
                title={t('admin.add_admin')}
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
                            label={t("common.user")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Select placeholder={t("common.user")} disabled={!isNil(defaultObject)}>
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
                            label={t('common.name')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder={t('common.name')} />
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
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder={t("common.email")} />
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
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder={t("common.whatsapp_number")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_numbers"
                            label={t("common.other_numbers")}
                        >
                            <Input disabled={
                                !isNil(defaultObject)
                            } placeholder={t("common.other_numbers")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="sex"
                            label={t("common.sex")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Select placeholder={t("common.sex")}>
                                <Option key="male">{t('common.male')}</Option>
                                <Option key="female">{t('common.female')}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="responsibilities"
                            label={t("admin.responsibilities")}
                        >
                            <Input placeholder={t("admin.responsibilities")} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default AdminStackholderAddModal;