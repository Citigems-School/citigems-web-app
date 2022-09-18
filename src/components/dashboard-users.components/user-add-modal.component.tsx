import { PlusOutlined } from "@ant-design/icons/lib/icons";
import { Col, Form, Input, message, Modal, PageHeader, Row, Select, Switch, UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import Upload, { RcFile } from "antd/lib/upload";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, signupInit } from "store/reducers/userSlice";
import { app } from "utils/firebase";
import { generatePassword } from "utils/functions";
import { Admin } from "../../models/Admin";
import { Parent } from "../../models/Parent";
import { Student } from "../../models/Student";
import { Teacher } from "../../models/Teacher";
import { User } from "../../models/User";
import { addUser } from "../../store/reducers/usersSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";
import AdminStackholderAddModal from "../stackholders.components/admins/admin-stackholder-add-modal.component";
import ParentStackholderAddModal from "../stackholders.components/parents/parents-stackholder-add-modal.component";
import TeacherStackholderAddModal from "../stackholders.components/teachers/teachers-stackholder-add-modal.component";

interface UserAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const UserAddModal = ({ isOpen, closeModal }: UserAddModalProps) => {

    const user = useSelector((state: RootState) => state.user);
    const { loading } = useSelector((state: RootState) => state.users);
    const { parents } = useSelector((state: RootState) => state.parents);
    const { students } = useSelector((state: RootState) => state.students);

    const [openSecondModal, setOpenSecondModal] = useState<boolean>();
    const [selectedRole, setSelectedRole] = useState<string>();
    const [createdNewObject, setCreatedNewObject] = useState<Parent | Student | Admin | Teacher | undefined>();
    const [file, setFile] = useState<UploadFile>();
    const [loadingFile, setLoadingFile] = useState(false);

    const { t } = useTranslation();


    function closeSecondModal() {
        setOpenSecondModal(false);
    }

    const thunkDispatch = useAppThunkDispatch();
    const dispatch = useDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => {
        form.resetFields();
        dispatch(signupInit());
    }, [isOpen]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {

        const password = generatePassword()
        thunkDispatch(registerUser({
            email: values.email,
            password
        })).then(async response => {
            const payload: any = response.payload
            if (payload && payload.code) {
                switch (payload.code) {
                    case "auth/email-already-in-use": {
                        message.error(t("user.error_email_already_in_use"))
                        break;
                    }
                    case "auth/invalid-email": {
                        message.error(t("user.error_invalid_email"))
                        break;
                    }
                    case "auth/operation-not-allowed": {
                        message.error(t("user.operation_not_allowed"))
                        break;
                    }
                    case "auth/weak-password": {
                        message.error(t("user.error_weak_password"))
                        break;
                    }
                }
            } else {
                const photo_url = await handleUpload(response.payload as string, file!);
                delete values.user_photo;
                const userData: User = { ...values, user_id: response.payload as string, photo_url: photo_url };
                const result = await thunkDispatch(addUser(userData));
                Modal.info({
                    title: t('generated_password_title'),
                    content: (
                        <div>
                            <code>{password}</code>
                            <p>{t('user.generated_password_body')}</p>
                        </div>
                    ),
                    onOk() {
                        if (
                            (
                                !isNil(userData.parent_key) &&
                                userData.parent_key !== "" &&
                                userData.role === "parent"
                            )) {
                            handleCancel();

                        } else {
                            switch (userData.role) {
                                case "admin": {
                                    const newAdmin: Admin = {
                                        objectKey: "",
                                        email: userData.email,
                                        name: userData.first_name + " " + userData.last_name,
                                        other_numbers: userData.other_numbers,
                                        responsibilities: "",
                                        sex: "",
                                        user_id: (result.payload as any).response.user_id,
                                        whatsapp_number: userData.whatsapp_number
                                    };
                                    setCreatedNewObject(newAdmin);
                                    break;
                                };
                                case "parent": {
                                    let children: Student[] = [];
                                    const listStudents = students.registered;
                                    if (!isNil(userData.child_key) && userData.child_key !== "" && typeof userData.child_key === "string") {
                                        ((userData.child_key as string).split(', ')).forEach(child => {
                                            children.push(listStudents.find((s: Student) => s.student_key === child)!);
                                        });
                                    }
                                    const newParent: Parent = {
                                        objectKey: "",
                                        child_name: children.map(child => child.student_key),
                                        email: userData.email,
                                        name: userData.first_name + " " + userData.last_name,
                                        number_of_children: children.length.toString(),
                                        other_phone_numbers: userData.other_numbers,
                                        place_of_work: "",
                                        profession: "",
                                        relationship: "",
                                        telegram_number: "",
                                        user_id: (result.payload as any).response.user_id,
                                        whatsapp_number: userData.whatsapp_number
                                    };
                                    setCreatedNewObject(newParent);
                                    break;
                                };
                                case "teacher": {

                                    const newTeacher: Teacher = {
                                        objectKey: "",
                                        classes: "",
                                        marital_status: "",
                                        name: userData.first_name + " " + userData.last_name,
                                        nationality: "",
                                        other_numbers: userData.other_numbers,
                                        phone_number: userData.whatsapp_number,
                                        salary: "",
                                        sex: "",
                                        user_id: (result.payload as any).response.user_id,
                                    }
                                    setCreatedNewObject(newTeacher);
                                    break;
                                }
                                default: {
                                    setCreatedNewObject(undefined);
                                    break;
                                }
                            }
                            dispatch(signupInit());
                            setSelectedRole(userData.role);
                            setOpenSecondModal(true);
                            form.resetFields();
                        }
                    },
                });
            }

        }).catch((error) => {
            console.error(error);
        })
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
        setFile(fileBeforeUpload);

        return false;
    }


    return (
        <>
            <Modal visible={isOpen && !openSecondModal} width={700}
                confirmLoading={loading || user.loading || loadingFile}
                onOk={async () => {
                    form.submit();
                }}
                onCancel={handleCancel}
                centered>
                <PageHeader
                    style={{ padding: "0" }}
                    title={t(`user.add_user`)}
                />
                <Form
                    name="add_user"
                    layout={"vertical"}
                    onFinish={handleSubmit}
                    form={form}
                    size={"large"}
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
                                <Input placeholder={t("common.first_name")} />
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
                                <Select placeholder={t("parent.parent")} allowClear>
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
                                <Select value={form.getFieldValue('child_key')} placeholder={t("common.child")} allowClear showArrow mode="multiple">
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
                                    maxCount={1}
                                    accept="image/png,image/jpg"
                                    onRemove={() => {
                                        setFile(undefined);
                                    }}

                                >
                                    {file ? null :
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
                        <Col xs={12}>
                            <Form.Item
                                name="photo_url"
                            >
                                <Input type="hidden" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            <AdminStackholderAddModal defaultObject={createdNewObject as Admin} isOpen={selectedRole === "admin" && openSecondModal!} closeModal={closeSecondModal} closeAddUserModal={closeModal} />
            <ParentStackholderAddModal defaultObject={createdNewObject as Parent} isOpen={selectedRole === "parent" && openSecondModal!} closeModal={closeSecondModal} closeAddUserModal={closeModal} />
            <TeacherStackholderAddModal defaultObject={createdNewObject as Teacher} isOpen={selectedRole === "teacher" && openSecondModal!} closeModal={closeSecondModal} closeAddUserModal={closeModal} />

        </>
    );
};

export default UserAddModal;