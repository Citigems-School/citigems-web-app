import { Col, Form, Input, message, Modal, PageHeader, Row, Select, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import { isNil } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, signupInit } from "store/reducers/userSlice";
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
                        message.error("Already exists an account with the given email address.")
                        break;
                    }
                    case "auth/invalid-email": {
                        message.error("The email address is not valid")
                        break;
                    }
                    case "auth/operation-not-allowed": {
                        message.error("Email/Password accounts are not enabled. Enable email/password accounts in the Firebase Console, under the Auth tab.")
                        break;
                    }
                    case "auth/weak-password": {
                        message.error("The password is not strong enough.")
                        break;
                    }
                }
            } else {
                const userData: User = { ...values, user_id: response.payload as string };
                const result = await thunkDispatch(addUser(userData));
                Modal.info({
                    title: 'Generated user password',
                    content: (
                        <div>
                            <code>{password}</code>
                            <p>Save the password in safe place</p>
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
                                        child_name: children.map(child => child.first_name + " " + child.last_name),
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


    return (
        <>
            <Modal visible={isOpen && !openSecondModal} width={700}
                confirmLoading={loading || user.loading}
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
                    name={"add_user"}
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
                                name="photo_url"
                                label="Photo URL">
                                <Input placeholder="Photo URL" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="parent_key"
                                label="Parent">
                                <Select placeholder="Parent" allowClear>
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
                                <Select value={form.getFieldValue('child_key')} placeholder="Child" allowClear showArrow mode="multiple">
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
                                label="Role"
                                rules={[
                                    {
                                        required: true,
                                        message: "This field is required"
                                    },
                                ]}>
                                <Select placeholder="Role" allowClear>
                                    <Option key="admin">Admin</Option>
                                    <Option key="parent">Parent</Option>
                                    <Option key="teacher">Teacher</Option>
                                    <Option key="guest">Guest</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="selected_role"
                                label="Selected Role">
                                <Select placeholder="Selected Role" allowClear>
                                    <Option key="Administrator">Administrator</Option>
                                    <Option key="parent">Parent</Option>
                                    <Option key="teacher">Teacher</Option>
                                </Select>
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
            <AdminStackholderAddModal defaultObject={createdNewObject as Admin} isOpen={selectedRole === "admin" && openSecondModal!} closeModal={closeSecondModal} closeAddUserModal={closeModal} />
            <ParentStackholderAddModal defaultObject={createdNewObject as Parent} isOpen={selectedRole === "parent" && openSecondModal!} closeModal={closeSecondModal} closeAddUserModal={closeModal} />
            <TeacherStackholderAddModal defaultObject={createdNewObject as Teacher} isOpen={selectedRole === "teacher" && openSecondModal!} closeModal={closeSecondModal} closeAddUserModal={closeModal} />

        </>
    );
};

export default UserAddModal;