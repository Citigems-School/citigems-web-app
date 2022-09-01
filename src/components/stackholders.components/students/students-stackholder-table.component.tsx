import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import { Dismiss16Regular, Person16Regular, Save16Regular } from "@ricons/fluent";
import { Button, Checkbox, Layout, message, Modal, PageHeader, Space, Tooltip, Typography } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox/Checkbox";
import Table, { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import { ForwardRefExoticComponent, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Student } from "../../../models/Student";
import { addStudent, removeStudent } from "../../../store/reducers/studentsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";
import StudentAddModal from "./students-stackholder-add-modal.component";
import StudentEditModal from "./students-stackholder-edit-modal.component";

const { confirm } = Modal;


export default function StudentsStackholderTable() {
    const thunkDispatch = useAppThunkDispatch();
    const { height } = useWindowDimensions();
    const { loading, students } = useSelector((state: RootState) => state.students);
    const [pageSize,
        setPageSize] = useState(5)

    const [addStudentOpen, setAddStudentOpen] = useState<boolean>(false);
    const [editStudentOpen, setEditStudentOpen] = useState<boolean>(false);
    const [currentStudent, setCurrentStudent] = useState<Student>()
    const [isRegistered, setIsRegistered] = useState<boolean>(true);

    function _handleEdit(record: Student) {
        selectStudentHandler(record);
        openEditStudentModal();
    }

    function _handleAddStudent() {
        openAddStudentModal();
    }

    const selectStudentHandler = (Student: Student) => {
        setCurrentStudent(Student)
    }

    const openEditStudentModal = () => {
        setEditStudentOpen(true);
    }
    const openAddStudentModal = () => {
        setAddStudentOpen(true);
    }
    const closeEditStudentModal = () => {
        setEditStudentOpen(false);
        setCurrentStudent(undefined);
    }
    const closeAddStudentModal = () => {
        setAddStudentOpen(false);
    }
    const openRegisterUnregisteredStudentModal = (student: Student) => {
        confirm({
            title: 'Are you sure you want register this student?',
            okText: 'Yes',
            cancelText: 'No',
            async onOk() {
                try {

                    if (!isNil(student)) {
                        await thunkDispatch(removeStudent({
                            studentId: student.student_key,
                            type: (isRegistered) ? "registered" : "unregistered"
                        }))
                        await thunkDispatch(addStudent(
                            {
                                type: "registered",
                                student
                            }
                        ))
                        setCurrentStudent(undefined);
                    } else {
                        throw new Error("selected Student is null");
                    }

                } catch (e) {
                    message.error("Can't remove Student, please try again")
                    setCurrentStudent(undefined);
                }
            }
        })
    }
    const openDeleteStudentModal = (student: Student) => {
        confirm({
            title: 'Are you sure delete this Student?',
            icon: <CloseCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {

                    if (!isNil(student)) {
                        await thunkDispatch(removeStudent({
                            studentId: student.student_key,
                            type: (isRegistered) ? "registered" : "unregistered"
                        }))
                        setCurrentStudent(undefined);
                    } else {
                        throw new Error("selected Student is null");
                    }

                } catch (e) {
                    message.error("Can't remove Student, please try again")
                    setCurrentStudent(undefined);
                }
            }
        });
    }




    const columns: ColumnProps<Student>[] = [
        {
            key: "id",
            title: "Student id",
            width: 3,
            ellipsis: true,
            render: (value, record) => (
                <Typography.Text ellipsis>
                    {record.student_key}
                </Typography.Text>
            ),
        },
        {
            key: "first_name",
            title: "First name",
            dataIndex: "first_name",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.first_name?.localeCompare(b.first_name || "") || 0
        },
        {
            key: "last_name",
            title: "Last name",
            dataIndex: "last_name",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.last_name?.localeCompare(b.last_name || "") || 0
        },
        {
            key: "father_first_name",
            title: "Father's First name",
            dataIndex: "father_first_name",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.father_first_name?.localeCompare(b.father_first_name || "") || 0
        },
        {
            key: "father_last_name",
            title: "Father's Last name",
            dataIndex: "father_last_name",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.father_last_name?.localeCompare(b.father_last_name || "") || 0
        },
        {
            key: "mother_first_name",
            title: "Mother's First name",
            dataIndex: "mother_first_name",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.mother_first_name?.localeCompare(b.mother_first_name || "") || 0
        },
        {
            key: "mother_last_name",
            title: "Mother's Last name",
            dataIndex: "mother_last_name",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.mother_last_name?.localeCompare(b.mother_last_name || "") || 0
        },
        {
            key: "home_town",
            title: "Home Town",
            dataIndex: "home_town",
            render: (value) => value,
            width: 3,
            sorter: (a, b) => a.home_town?.localeCompare(b.home_town || "") || 0
        },
        {
            key: "address",
            title: "Address",
            dataIndex: "address",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.address?.localeCompare(b.address || "") || 0
        },
        {
            key: "local_govt_area",
            title: "Local Govt Area",
            dataIndex: "local_govt_area",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.local_govt_area?.localeCompare(b.local_govt_area || "") || 0
        },
        {
            key: "sex",
            title: "Sex",
            dataIndex: "sex",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.sex?.localeCompare(b.sex || "") || 0
        },
        {
            key: "date_of_birth",
            title: "Date of Birth",
            dataIndex: "date_of_birth",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.date_of_birth?.localeCompare(b.date_of_birth || "") || 0
        },
        {
            key: "current_class",
            title: "Current Class",
            dataIndex: "current_class",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.current_class?.localeCompare(b.current_class || "") || 0
        },
        {
            key: "language_at_home",
            title: "Language at home",
            dataIndex: "language_at_home",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.language_at_home?.localeCompare(b.language_at_home || "") || 0
        },
        {
            key: "birth_certificate_photo_url",
            title: "Birth Certificate",
            dataIndex: "birth_certificate_photo_url",
            width: 3,
            align: "center",
            render: (value) => <a target="_blank" href={value}> view certificate</a>,
            sorter: (a, b) => a.birth_certificate_photo_url?.localeCompare(b.birth_certificate_photo_url || "") || 0
        },
        {
            key: "additional_info",
            title: "Additional Informations",
            dataIndex: "additional_info",
            width: 3,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.additional_info?.localeCompare(b.additional_info || "") || 0
        },
        {
            key: "actions",
            title: "Actions",
            fixed: "right",
            width: 3,
            render: (value, record) => (
                <>
                    <Space>
                        {
                            !isRegistered && <Tooltip title={"Register Student"}>
                                <Button
                                    key={"registerStudent"}
                                    size={"small"}
                                    icon={
                                        <Icon
                                            className={"i20"}
                                            component={Save16Regular as ForwardRefExoticComponent<any>}
                                        />
                                    }
                                    type={"text"}
                                    onClick={() => openRegisterUnregisteredStudentModal(record)}
                                />
                            </Tooltip>
                        }

                        <Tooltip title={"Edit Student"}>
                            <Button
                                key={"editStudent"}
                                size={"small"}
                                icon={
                                    <Icon
                                        className={"i20"}
                                        component={Person16Regular as ForwardRefExoticComponent<any>}
                                    />
                                }
                                type={"text"}
                                onClick={() => _handleEdit(record)}
                            />
                        </Tooltip>
                        <Tooltip title={"Remove Student"}>
                            <Button
                                key={"removeStudent"}
                                size={"small"}
                                icon={
                                    <Icon
                                        className={"i20"}
                                        component={Dismiss16Regular as ForwardRefExoticComponent<any>}
                                    />
                                }
                                danger
                                type={"text"}
                                onClick={() => {
                                    selectStudentHandler(record);
                                    openDeleteStudentModal(record);
                                }}
                            />
                        </Tooltip>
                    </Space>
                </>
            ),
            align: "center"
        }
    ];


    const onChangeIsRegistered = (e: CheckboxChangeEvent) => {
        setIsRegistered(!e.target.checked);
    };


    return (
        <>
            <Layout className={"content"}>
                <Layout.Content style={{ padding: 24, overflow: "auto" }}>
                    <PageHeader
                        style={{ padding: "0" }}
                        title={"Students List"}
                        extra={[
                            <Checkbox onChange={onChangeIsRegistered} checked={!isRegistered}>
                                Show Unregistered Students
                            </Checkbox>,
                            <Button onClick={() => _handleAddStudent()}>Add Student</Button>
                        ]}
                    /> <br />
                    <Table<Student>
                        loading={loading}
                        className={"data-table"}
                        scroll={{
                            y: height,
                            x: 3500
                        }}
                        rowKey={(record) => record.student_key}
                        columns={columns}
                        dataSource={isRegistered ? students.registered : students.unregistered}
                        pagination={{
                            pageSize,
                            pageSizeOptions: [5, 10, 15, 20],
                            showSizeChanger: true,
                            size: "default",
                            position: ["bottomCenter"],
                            onChange: (page, pageSize) => {
                                setPageSize(pageSize);
                            }
                        }}
                    />

                    <StudentEditModal type={isRegistered ? "registered" : "unregistered"} student={currentStudent!} isOpen={editStudentOpen} closeModal={closeEditStudentModal} />
                    <StudentAddModal type={isRegistered ? "registered" : "unregistered"} isOpen={addStudentOpen} closeModal={closeAddStudentModal} />

                </Layout.Content>
            </Layout>
        </>
    );



}
