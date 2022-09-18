import { Col, Form, Input, Modal, PageHeader, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Admin } from "../../../models/Admin";
import { User } from "../../../models/User";
import { editAdmin } from "../../../store/reducers/adminsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface AdminStackholderEditModalProps {
    admin: Admin;
    isOpen: boolean;
    closeModal: () => void;
}

const AdminStackholderEditModal = ({ admin, isOpen, closeModal }: AdminStackholderEditModalProps) => {
    const { t } = useTranslation();

    const { loading } = useSelector((state: RootState) => state.admins);
    const { users } = useSelector((state: RootState) => state.users);


    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [admin, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        await thunkDispatch(editAdmin({
            ...admin,
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
                title={t('admin.edit_admin')}
            />
            <Form
                name={"add_booking_form"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={admin}
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
                            <Select value={form.getFieldValue('user_id')} placeholder={t("common.user")} allowClear>
                                {
                                    users.map(
                                        (user: User) => <Option key={user.user_id} value={user.user_id} selected={admin && user.user_id === admin.user_id}>
                                            {`${user.first_name} ${user.last_name}`}
                                        </Option>
                                    )
                                }
                            </Select>                        </Form.Item>
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
                            name="other_numbers"
                            label={t("common.other_numbers")}
                        >
                            <Input placeholder={t("common.other_numbers")} />
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

export default AdminStackholderEditModal;