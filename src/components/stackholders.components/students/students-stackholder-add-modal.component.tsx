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
import { useTranslation } from "react-i18next";

interface StudentsStackholderAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
    type: string;
}

const StudentsStackholderAddModal = ({ type = "registered", isOpen, closeModal }: StudentsStackholderAddModalProps) => {
    const { t } = useTranslation();

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
                    message.error(t('user.error_upload_failed')).then();
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
            message.error(t('user.error_file_unacceptable')).then();
            return;
        }

        if (!(fileBeforeUpload.size / 1024 / 1024 < 2)) {
            message.error(t('user.error_big_file')).then();
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
            message.error(t('user.error_file_unacceptable')).then();
        }

        if (!(fileBeforeUpload.size / 1024 / 1024 < 2)) {
            message.error(t('user.error_big_file')).then();
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
                title={t('students.add_student')}
            />
            <Form
                name={"add_student"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
            >
                <Row gutter={[24, 0]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="first_name"
                            label={t('common.first_name')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('common.first_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="last_name"
                            label={t('common.last_name')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('common.last_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="father_first_name"
                            label={t('students.father_first_name')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('students.father_first_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="father_last_name"
                            label="Father's Last name"
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('students.father_last_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="mother_first_name"
                            label={t('students.mother_first_name')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('students.mother_first_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="mother_last_name"
                            label={t('students.mother_last_name')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('students.mother_last_name')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="home_town"
                            label={t('students.home_town')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                }
                            ]
                            }
                        >
                            <Input placeholder={t('students.home_town')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="address"
                            label={t('students.address')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}>
                            <Input placeholder={t('students.address')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="local_govt_area"
                            label={t('students.local_govt_area')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Input placeholder={t('students.local_govt_area')} />
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
                            name="date_of_birth"
                            label={t('students.date_of_birth')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <DatePicker placeholder={t('students.date_of_birth')}
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="current_class"
                            label={t('students.current_class')}
                        >
                            <Select placeholder={t('students.current_class')} allowClear showArrow mode="multiple">
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
                            label={t('students.language_at_home')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error_required")
                                },
                            ]}
                        >
                            <Input placeholder={t('students.language_at_home')} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="additional_info"
                            label={t('students.additional_info')}
                        >
                            <Input placeholder={t('students.additional_info')} />
                        </Form.Item>
                    </Col>
                    <Col xs={12}>
                        <Form.Item
                            label={t('students.image_child')}
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
                            label={t('students.birth_cert')}
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