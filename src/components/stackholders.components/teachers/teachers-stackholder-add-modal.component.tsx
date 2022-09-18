import { Col, Form, Input, Modal, PageHeader, Row, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash";
import { Class } from "models/Class";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Teacher } from "../../../models/Teacher";
import { User } from "../../../models/User";
import { addTeacher } from "../../../store/reducers/teachersSlice";
import { removeUser } from "../../../store/reducers/usersSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface TeacherStackholderAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
    defaultObject?: Teacher;
    closeAddUserModal?: () => void;

}

const TeacherStackholderAddModal = ({ defaultObject, isOpen, closeModal, closeAddUserModal }: TeacherStackholderAddModalProps) => {
    const { t } = useTranslation();

    const { users } = useSelector((state: RootState) => state.users);
    const { loading } = useSelector((state: RootState) => state.teachers);
    const { classes } = useSelector((state: RootState) => state.classes);

    const thunkDispatch = useAppThunkDispatch();
    const [isDone, setIsDone] = useState(false)

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => { 
        form.resetFields()
     }, [isOpen]);

    const handleCancel = () => {
        if (!isNil(defaultObject) && !isDone) {
            thunkDispatch(removeUser(defaultObject.user_id))
        }
        closeModal();
        closeAddUserModal?.();
        form.resetFields();
    };

    const handleExit = () => {
        form.resetFields();
        closeModal();
        closeAddUserModal?.();
    }

    async function handleSubmit(values: any) {
        await thunkDispatch(addTeacher(values));
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
                title={t('teacher.add_teacher')}
            />
            <Form
                name={"add_teacher"}
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
                            label= {t("common.user")}
                            rules={!defaultObject ? [
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ] : undefined}>
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
                            label={t("common.name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input disabled={!isNil(defaultObject)} placeholder={t("common.name")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="phone_number"
                            label={t("teacher.phone_number")}
                            rules={!defaultObject ? [
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ] : undefined}>
                            <Input disabled={!isNil(defaultObject)} placeholder={t("teacher.phone_number")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="other_numbers"
                            label={t("common.other_numbers")}
                        >
                            <Input disabled={!isNil(defaultObject)} placeholder={t("common.other_numbers")} />
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
                            name="nationality"
                            label={t("teacher.nationality")}
                        >
                            <Input placeholder={t("teacher.nationality")} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="marital_status"
                            label={t("teacher.marital_status")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Select placeholder={t("teacher.marital_status")}>
                                <Option value="single">
                                    {t("teacher.single")}
                                </Option>
                                <Option value="married">
                                {t("teacher.married")}
                                </Option>
                                <Option value="separated">
                                {t("teacher.separated")}
                                </Option>
                                <Option value="divorced">
                                {t("teacher.divorced")}
                                </Option>
                                <Option value="widowed">
                                {t("teacher.widowed")}
                                </Option>
                            </Select>

                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="classes"
                            label={t("teacher.classes")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Select placeholder={t("teacher.classes")} allowClear showArrow mode="multiple">
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
                            label={t("teacher.salary")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Input type="number" placeholder={t("teacher.salary")} />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

export default TeacherStackholderAddModal;