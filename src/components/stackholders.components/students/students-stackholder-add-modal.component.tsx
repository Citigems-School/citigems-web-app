import { Col, DatePicker, Form, Input, message, Modal, PageHeader, Row, Select, Switch, UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import Upload, { RcFile } from "antd/lib/upload";
import { Class } from "models/Class";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { addStudent, editStudent } from "../../../store/reducers/studentsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from "firebase/storage";
import { PlusOutlined } from "@ant-design/icons";
import { app } from "utils/firebase";

interface StudentsStackholderAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
    type: string;
}

const StudentsStackholderAddModal = ({ type = "registered", isOpen, closeModal }: StudentsStackholderAddModalProps) => {

    const { loading } = useSelector((state: RootState) => state.admins);
    const { classes } = useSelector((state: RootState) => state.classes);

    const thunkDispatch = useAppThunkDispatch();
    const [loadingFile, setLoadingFile] = useState(false);
    const [file, setFile] = useState<UploadFile>();
    const [childImage, setChildImage] = useState<UploadFile>();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [isOpen]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {

        delete values.birth_cert;
        delete values.image_child;

        const result: any = await thunkDispatch(addStudent({
            student: {
                ...values,
                date_of_birth: moment(values.date_of_birth).format("DD/MM/YYYY"),
                current_class: values.current_class.join(', ')
            },
            type: type
        }));

        const birth_certificate = await handleUpload('birth_certificates', result, file!);
        const students_profile_images = await handleUpload('students_profile_images', result, childImage!);

        await thunkDispatch(editStudent({
            student: {
                student_key: result.payload.response.student_key,
                ...result.payload.response,
                date_of_birth: result.payload.response.date_of_birth,
                current_class: result.payload.response.current_class,
                image_of_child_url: students_profile_images,
                birth_certificate_photo_url: birth_certificate,
            },
            type: type
        }));

        setLoadingFile(false);
        handleCancel();

    }


    function handleUpload(pathURI: string, studentObj: any, uploadFile: UploadFile) {
        if (uploadFile) {
            setLoadingFile(true);
            const path = `/${pathURI}/${studentObj.payload.response.student_key}/${uploadFile.name}`;
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
        setFile(fileBeforeUpload);

        return false;
    }

    function beforeUploadChildImage(
        fileBeforeUpload: RcFile
    ) {
        const isJpgOrPng = fileBeforeUpload.type === "image/jpeg" || fileBeforeUpload.type === "image/png";
        if (!isJpgOrPng) {
            message.error("File isn't acceptable").then();
        }

        if (!(fileBeforeUpload.size / 1024 / 1024 < 2)) {
            message.error("File is too big").then();
        }
        setChildImage(fileBeforeUpload);

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
                title={`Add Student`}
            />
            <Form
                name={"add_parent"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
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
                            <Input placeholder="First name" />
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
                            <Input placeholder="Last name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="father_first_name"
                            label="Father's First name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Father's First name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="father_last_name"
                            label="Father's Last name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Father's Last name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="mother_first_name"
                            label="Mother's First name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Mother's First name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="mother_last_name"
                            label="Mother's Last name"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Mother's Last name" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="home_town"
                            label="Home town"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                }
                            ]
                            }
                        >
                            <Input placeholder="Home Town" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="address"
                            label="Address"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}>
                            <Input placeholder="Address" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="local_govt_area"
                            label="Local Govt Area"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input placeholder="Local Govt Area" />
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
                            name="date_of_birth"
                            label="Date of Birth"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <DatePicker placeholder="Date of birth"
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="current_class"
                            label="Current Class"
                        >
                            <Select placeholder="Current Class" allowClear showArrow mode="multiple">
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
                            name="language_at_home"
                            label="Language at home"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input placeholder="Language at home" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="additional_info"
                            label="Additional Informations"
                        >
                            <Input placeholder="Additional Informations" />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            label="Child's Image"
                            style={{ marginBottom: 8 }}
                            name={"image_child"}>
                            <Upload
                                id="imageChild"
                                name="imageChild"
                                listType="picture-card"
                                beforeUpload={(fileToUpload) => beforeUploadChildImage(fileToUpload)}
                                showUploadList={true}
                                maxCount={1}
                                accept="image/png,image/jpg"
                                onRemove={() => {
                                    setChildImage(undefined);
                                }}
                            >
                                {file ? null :
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                }
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            label="Birth Certificate Photo"
                            style={{ marginBottom: 8 }}
                            name={"birth_cert"}>
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
                                {childImage ? null :
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                }
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            name="birth_certificate_photo_url"
                        >
                            <Input type="hidden" />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            name="image_of_child_url"
                        >
                            <Input type="hidden" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal >
    );
};

export default StudentsStackholderAddModal;