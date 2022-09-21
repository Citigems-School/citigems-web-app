import { PlusOutlined } from "@ant-design/icons";
import { Col, DatePicker, Form, Input, message, Modal, PageHeader, Row, Select, Switch, Upload, UploadFile } from "antd";
import { useForm } from "antd/es/form/Form";
import { RcFile } from "antd/lib/upload";
import { ref } from "firebase/storage";
import { getStorage, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Class } from "models/Class";
import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { app } from "utils/firebase";
import { Student } from "../../../models/Student";
import { editStudent, getStudents, removeBirthCert } from "../../../store/reducers/studentsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from "react-i18next";


interface StudentStackholderEditModalProps {
    student: Student;
    isOpen: boolean;
    closeModal: () => void;
    type: string
}

const StudentStackholderEditModal = ({ type = "registered", student, isOpen, closeModal }: StudentStackholderEditModalProps) => {
    const { t } = useTranslation();

    const { classes } = useSelector((state: RootState) => state.classes);
    const { loading } = useSelector((state: RootState) => state.students);
    const thunkDispatch = useAppThunkDispatch();
    const [loadingFile, setLoadingFile] = useState(false);
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [childImage, setChildImage] =  useState<UploadFile[]>([]);
    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => {
        if (student && student.birth_certificate_photo_url) {
            setFiles([{
                uid: "file",
                name: "Certificate of birth",
                status: "done",
                url: student.birth_certificate_photo_url,
                type: "image/png"
            }])
        }
        if (student && student.birth_certificate_photo_url) {
            setFiles([{
                uid: "file",
                name: "Child's Photos",
                status: "done",
                url: student.birth_certificate_photo_url,
                type: "image/png"
            }])
        }
        form.resetFields();
    }, [student, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {

        const birth_certificate = await handleUpload('birth_certificates', student, files[0]);
        const students_profile_images = await handleUpload('students_profile_images', student, childImage[0]);
        
        delete values.birth_cert;
        delete values.image_child;
        
        await thunkDispatch(editStudent(
            {
                student: {
                    ...student,
                    ...values,
                    birth_cert: undefined,
                    date_of_birth: moment(values.date_of_birth).format("DD/MM/YYYY"),
                    current_class: typeof values.current_class === "string" ? values.current_class : values.current_class.join(', '),
                    image_of_child_url: students_profile_images,
                    birth_certificate_photo_url: birth_certificate,
                },
                type
            }
        ));
        handleCancel();
        await thunkDispatch(getStudents());
    }


    function handleUpload(pathURI: string, studentObj: Student, uploadFile: UploadFile) {
        if (uploadFile) {
            setLoadingFile(true);
            const path = `/${pathURI}/${studentObj.student_key}/${uploadFile.name}`;
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
        setFiles([fileBeforeUpload]);

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
        setChildImage([fileBeforeUpload]);

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
                title={t('students.edit_student')}
            />
            <Form
                name={"edit_parent"}
                layout={"vertical"}
                onFinish={handleSubmit}
                form={form}
                size={"large"}
                initialValues={{
                    ...student,
                    date_of_birth: student && moment(student.date_of_birth,'DD/MM/YYYY'),
                    current_class: student && student.current_class.split(', '),

                }}
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
                            ]}>
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
                            <Input placeholder={t("common.sex")} />
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
                            <DatePicker
                                placeholder={t('students.date_of_birth')}
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
                                fileList={childImage}
                                onRemove={() => {
                                    setChildImage([]);
                                }}
                            >
                                {childImage[0] ? null :
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
        </Modal>
    );
};

export default StudentStackholderEditModal;