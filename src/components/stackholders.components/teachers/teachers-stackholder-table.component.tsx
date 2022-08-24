import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import { Dismiss16Regular, Person16Regular } from "@ricons/fluent";
import { Button, Layout, message, Modal, PageHeader, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import { ForwardRefExoticComponent, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Teacher } from "../../../models/Teacher";
import { removeTeacher } from "../../../store/reducers/teachersSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";
import TeacherAddModal from "./teachers-stackholder-add-modal.component";
import TeacherEditModal from "./teachers-stackholder-edit-modal.component";

const { confirm } = Modal;


export default function TeachersStackholderTable() {
    const thunkDispatch = useAppThunkDispatch();
    const { height } = useWindowDimensions();
    const { loading, teachers } = useSelector((state: RootState) => state.teachers);
    const [pageSize,
        setPageSize] = useState(5)

    const [addTeacherOpen, setAddTeacherOpen] = useState<boolean>(false);
    const [editTeacherOpen, setEditTeacherOpen] = useState<boolean>(false);
    const [currentTeacher, setCurrentTeacher] = useState<Teacher>()

    function _handleEdit(record: Teacher) {
        selectTeacherHandler(record);
        openEditTeacherModal();
    }

    function _handleAddTeacher() {
        openAddTeacherModal();
    }

    const selectTeacherHandler = (Teacher: Teacher) => {
        setCurrentTeacher(Teacher)
    }

    const openEditTeacherModal = () => {
        setEditTeacherOpen(true);
    }
    const openAddTeacherModal = () => {
        setAddTeacherOpen(true);
    }
    const closeEditTeacherModal = () => {
        setEditTeacherOpen(false);
        setCurrentTeacher(undefined);
    }
    const closeAddTeacherModal = () => {
        setAddTeacherOpen(false);
    }
    const openDeleteTeacherModal = (teacher: Teacher) => {
        confirm({
            title: 'Are you sure delete this Teacher?',
            icon: <CloseCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {

                    if (!isNil(teacher)) {
                        await thunkDispatch(removeTeacher(teacher.objectKey))
                        setCurrentTeacher(undefined);
                    } else {
                        throw new Error("selected Teacher is null");
                    }

                } catch (e) {
                    message.error("Can't remove Teacher, please try again")
                    setCurrentTeacher(undefined);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }




    const columns: ColumnProps<Teacher>[] = [
        {
            key: "user_id",
            title: "User id",
            width: 2,
            ellipsis: true,
            render: (value, record) => (
                <Typography.Text ellipsis>
                    {record.user_id}
                </Typography.Text>
            ),
        },
        {
            key: "name",
            title: "Name",
            dataIndex: "name",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.name?.localeCompare(b.name || "") || 0
        },
        {
            key: "phone_number",
            title: "Phone Number",
            dataIndex: "phone_number",
            align:"center",
            render: (value) => value,
            width: 3,
            sorter: (a, b) => a.phone_number?.localeCompare(b.phone_number || "") || 0
        },
        {
            key: "other_numbers",
            title: "Other numbers",
            dataIndex: "other_numbers",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.other_numbers?.localeCompare(b.other_numbers || "") || 0
        },
        {
            key: "sex",
            title: "Sex",
            dataIndex: "sex",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.sex?.localeCompare(b.sex || "") || 0
        },
        {
            key: "nationality",
            title: "Nationality",
            dataIndex: "nationality",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.nationality?.localeCompare(b.nationality || "") || 0
        },
        {
            key: "marital_status",
            title: "Marital Status",
            dataIndex: "marital_status",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.marital_status?.localeCompare(b.marital_status || "") || 0
        },
        {
            key: "classes",
            title: "Classes",
            dataIndex: "classes",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.classes?.localeCompare(b.classes || "") || 0
        },
        {
            key: "salary",
            title: "Salary",
            dataIndex: "salary",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => parseInt(a.salary) - parseInt(b.salary)
        },
        {
            key: "actions",
            title: "Actions",
            fixed: "right",
            width: 2,
            render: (value, record) => (
                <>
                    <Space>
                        <Tooltip title={"Edit Teacher"}>
                            <Button
                                key={"editTeacher"}
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
                        <Tooltip title={"Remove Teacher"}>
                            <Button
                                key={"removeTeacher"}
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
                                    selectTeacherHandler(record);
                                    openDeleteTeacherModal(record);
                                }}
                            />
                        </Tooltip>
                    </Space>
                </>
            ),
            align: "center"
        }
    ];



    return (
        <>
            <Layout className={"content"}>
                <Layout.Content style={{ padding: 24, overflow: "auto" }}>
                    <PageHeader
                        style={{ padding: "0" }}
                        title={"Teachers List"}
                        extra={
                            <Button onClick={() => _handleAddTeacher()}>Add Teacher</Button>
                        }
                    /> <br />
                    <Table<Teacher>
                        loading={loading}
                        className={"data-table"}
                        scroll={{
                            y: height,
                            x: 1600
                        }}
                        rowKey={(record) => record.user_id}
                        columns={columns}
                        dataSource={teachers}
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

                    <TeacherEditModal teacher={currentTeacher!} isOpen={editTeacherOpen} closeModal={closeEditTeacherModal} />
                    <TeacherAddModal isOpen={addTeacherOpen} closeModal={closeAddTeacherModal} />

                </Layout.Content>
            </Layout>
        </>
    );



}
