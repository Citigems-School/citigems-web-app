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


interface StudentStackholderEditModalProps {
    student: Student;
    isOpen: boolean;
    closeModal: () => void;
    type: string
}

const StudentStackholderEditModal = ({ type = "registered", student, isOpen, closeModal }: StudentStackholderEditModalProps) => {

    const { classes } = useSelector((state: RootState) => state.classes);
    const { loading } = useSelector((state: RootState) => state.students);
    const thunkDispatch = useAppThunkDispatch();
    const [loadingFile, setLoadingFile] = useState(false);
    const [files, setFiles] = useState<UploadFile[]>([]);

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
        form.resetFields();
    }, [student, form]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {

        handleUpload();
        await thunkDispatch(editStudent(
            {
                student: {
                    ...student,
                    ...values,
                    birth_cert: undefined,
                    date_of_birth: moment(values.date_of_birth).format("DD/MM/YYYY"),
                    current_class: typeof values.current_class === "string" ? values.current_class : values.current_class.join(', ')
                },
                type
            }
        ));
        handleCancel();
        await thunkDispatch(getStudents());
    }


    function handleUpload() {
        if (files.length > 0 && files[0]) {
            setLoadingFile(true);
            const path = `${uuidv4()}`;
            const storage = getStorage(app);
            const fileRef = ref(storage, path);

            const uploadTask = uploadBytesResumable(fileRef, files[0] as RcFile);

            uploadTask.on(
                "state_changed",
                () => { },
                () => {
                    message.error("Upload failed").then();
                    setLoadingFile(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        form.setFieldsValue({
                            birth_certificate_photo_url: downloadURL
                        });
                        message.success("Upload success").then();
                        setLoadingFile(false);
                    });

                }
            );
        }
    }

    function beforeUpload(
        file: RcFile
    ) {
        const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJpgOrPng) {
            message.error("File isn't acceptable").then();
        }

        if (!(file.size / 1024 / 1024 < 2)) {
            message.error("File is too big").then();
        }
        setFiles([file]);

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
                title={`Edit Student`}
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
                            ]}>
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
                            <Input placeholder="Sex" />
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
                            <DatePicker
                                placeholder="Date of birth"
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
                    <Col xs={24}>
                        <Form.Item
                            label="Birth Certificate Photo"
                            style={{ marginBottom: 8 }}
                            name={"birth_cert"}
                            valuePropName={"file_list"}>
                            <Upload
                                name="image"
                                listType="picture-card"
                                beforeUpload={(file) => beforeUpload(file)}
                                fileList={files}
                                showUploadList={true}
                                maxCount={1}
                                accept="image/png,image/jpg"
                                onRemove={async (file) => {
                                    await thunkDispatch(
                                        removeBirthCert(
                                            {
                                                student,
                                                type: type,
                                                url: student.birth_certificate_photo_url!
                                            }
                                        )
                                    );
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
                    <Col xs={24}>
                        <Form.Item
                            name="birth_certificate_photo_url"
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