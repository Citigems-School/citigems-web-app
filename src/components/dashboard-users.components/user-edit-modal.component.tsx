import { PlusOutlined } from "@ant-design/icons";
import { Col, Form, Input, message, Modal, PageHeader, Row, Select, Switch, Upload, UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import { RcFile } from "antd/lib/upload";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { app } from "utils/firebase";
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
    const { t } = useTranslation();

    const { loading } = useSelector((state: RootState) => state.users);
    const { parents } = useSelector((state: RootState) => state.parents);
    const { students } = useSelector((state: RootState) => state.students);

    const thunkDispatch = useAppThunkDispatch();
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [loadingFile, setLoadingFile] = useState(false);

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => {

        if (user && user.photo_url) {
            setFiles([{
                uid: "file",
                name: "User's Photo",
                status: "done",
                url: user.photo_url,
                type: "image/png"
            }])
        }

        form.resetFields();
        setLoadingFile(false);

    }, [user, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        const photo_url = await handleUpload(user.user_id, files[0]);
        delete values.user_photo;

        await thunkDispatch(editUser({
            ...user,
            ...values,
            photo_url

        }));
        handleCancel();
    }

    function handleUpload(userId: string, uploadFile: UploadFile) {
        if (uploadFile) {
            setLoadingFile(true);
            const path = `/user_photos/${userId}/${uploadFile.name}`;
            const storage = getStorage(app);
            const fileRef = ref(storage, path);

            let result: string;

            const uploadTask = uploadBytesResumable(fileRef, uploadFile as RcFile);
            uploadTask.on(
                "state_changed",
                () => { },
                () => {
                    message.error(t("user.error_upload_failed")).then();
                    setLoadingFile(false);
                },
                () => {
                    return getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        result = downloadURL;
                    });
                }
            );
            return new Promise<string>((resolve, reject) => {
                const checkDownloadIsFinished = setInterval(() => {
                    if (result && result.length > 0) {
                        clearInterval(checkDownloadIsFinished);
                        resolve(result);
                    }
                }, 1000);
            });

        }
    }

    function beforeUpload(
        fileBeforeUpload: RcFile
    ) {
        const isJpgOrPng = fileBeforeUpload.type === "image/jpeg" || fileBeforeUpload.type === "image/png";
        if (!isJpgOrPng) {
            message.error(t("user.error_file_unacceptable")).then();
            return;
        }

        if (!(fileBeforeUpload.size / 1024 / 1024 < 2)) {
            message.error("user.error_big_file").then();
            return;
        }
        setFiles([fileBeforeUpload]);

        return false;
    }


    return (
        <Modal visible={isOpen} width={700} cancelText={t("common.cancel")}
            confirmLoading={loading || loadingFile}
            onOk={async () => {
                form.submit();
            }}
            onCancel={handleCancel}
            centered>
            <PageHeader
                style={{ padding: "0" }}
                title={t(`user.edit_user`)}
            />
            <Form
                name="edit_user"
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
                            label={t("common.first_name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder="First Name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="last_name"
                            label={t("common.last_name")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t("common.last_name")} />
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
                            name="parent_key"
                            label={t("parent.parent")}>
                            <Select value={!isNil(user) && form.getFieldValue('parent_key') !== "" ? form.getFieldValue('parent_key') : undefined} placeholder={t("parent.parent")}>
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
                            label={t("common.child")}>
                            <Select allowClear showArrow mode="multiple"
                                placeholder={t("common.child")}>
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
                            name="role"
                            label={t("common.role")}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Select placeholder={t("common.role")} allowClear>
                                <Option key="admin">{t("common.role_admin")}</Option>
                                <Option key="parent">{t("common.role_parent")}</Option>
                                <Option key="teacher">{t("common.role_teacher")}</Option>
                                <Option key="guest">{t("common.role_guest")}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="selected_role"
                            label={t("user.selected_role")}>
                            <Select placeholder={t("user.selected_role")} allowClear>
                                <Option key="Administrator">{t("user.selected_role_admin")}</Option>
                                <Option key="parent">{t("user.selected_role_parent")}</Option>
                                <Option key="teacher">{t("user.selected_role_teacher")}</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label={t("user.user_photo")}
                            style={{ marginBottom: 8, marginTop: 8 }}
                            name={"user_photo"}>
                            <Upload
                                id="image"
                                name="image"
                                listType="picture-card"
                                beforeUpload={(fileToUpload) => beforeUpload(fileToUpload)}
                                showUploadList={true}
                                fileList={files}
                                maxCount={1}
                                accept="image/png,image/jpg"
                                onRemove={() => {
                                    setFiles([]);
                                }}

                            >
                                {files[0] ? null :
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>
                                            {t('common.upload')}
                                        </div>
                                    </div>
                                }
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={12} md={4} lg={4}>
                        <Form.Item
                            name="has_child_in_citigems"
                            label={t("user.has_child_in_citigems")}
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
                            label={t("user.enrolled")}
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

