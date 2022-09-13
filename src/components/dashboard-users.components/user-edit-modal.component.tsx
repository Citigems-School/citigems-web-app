import { PlusOutlined } from "@ant-design/icons";
import { Col, Form, Input, message, Modal, PageHeader, Row, Select, Switch, Upload, UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import { RcFile } from "antd/lib/upload";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
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
                    message.error("Upload failed").then();
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
            message.error("File isn't acceptable").then();
            return;
        }

        if (!(fileBeforeUpload.size / 1024 / 1024 < 2)) {
            message.error("File is too big").then();
            return;
        }
        setFiles([fileBeforeUpload]);

        return false;
    }


    return (
        <Modal visible={isOpen} width={700}
            confirmLoading={loading || loadingFile}
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
                                <Option key="Administrator">Administrator</Option>
                                <Option key="parent">Parent</Option>
                                <Option key="teacher">Teacher</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24}>
                        <Form.Item
                            label="User's Photo"
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
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                }
                            </Upload>
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

