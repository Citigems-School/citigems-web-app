import { Col, DatePicker, Form, Input, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { Class } from "models/Class";
import moment from "moment";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { addStudent } from "../../../store/reducers/studentsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";


interface StudentsStackholderAddModalProps {
    isOpen: boolean;
    closeModal: () => void;
    type: string;
}

const StudentsStackholderAddModal = ({ type = "registered", isOpen, closeModal }: StudentsStackholderAddModalProps) => {

    const { loading } = useSelector((state: RootState) => state.admins);
    const { classes } = useSelector((state: RootState) => state.classes);

    const thunkDispatch = useAppThunkDispatch();

    const [form] = useForm();
    const { Option } = Select;

    useEffect(() => form.resetFields(), [isOpen]);

    const handleCancel = () => {
        form.resetFields();
        closeModal();
    };

    async function handleSubmit(values: any) {
        console.log(values)
        await thunkDispatch(addStudent({
            student: {
                ...values,
                date_of_birth: moment(values.date_of_birth).format("DD/MM/YYYY"),
                current_class: values.current_class.join(', ')
            },
            type: type
        }));
        //handleCancel();
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
                title={`Add user`}
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
                            name="birth_certificate_photo_url"
                            label="Birth Certificate Photo URL"
                            rules={[
                                {
                                    required: true,
                                    message: "This field is required"
                                },
                            ]}
                        >
                            <Input placeholder="Birth Certificate" />
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
                </Row>
            </Form>
        </Modal >
    );
};

export default StudentsStackholderAddModal;