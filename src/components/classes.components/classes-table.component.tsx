import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import { Dismiss16Regular, Edit16Regular } from "@ricons/fluent";
import { Button, Layout, message, Modal, PageHeader, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import { ForwardRefExoticComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { Class } from "../../models/Class";
import { removeClass } from "../../store/reducers/classesSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";
import ClassAddModal from "./classes-add-modal.component";
import ClassEditModal from "./classes-edit-modal.component";

const { confirm } = Modal;


export default function ClassesTable() {
    const thunkDispatch = useAppThunkDispatch();
    const { height } = useWindowDimensions();
    const { teachers } = useSelector((state: RootState) => state.teachers);
    const { students } = useSelector((state: RootState) => state.students);
    const { loading, classes } = useSelector((state: RootState) => state.classes);

    const [pageSize,
        setPageSize] = useState(20)

    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
    const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<Class>()


    const {t} = useTranslation();

    function displayStudents(value: String) {
        try {
            const listIds = value.split(', ')
            let listStudents: string[] = [];
            listIds.forEach(
                id => {
                    const filteredStudent = students.registered.find(
                        student => student.student_key === id
                    )
                    if (!isNil(filteredStudent))
                        listStudents.push(filteredStudent?.first_name + " " + filteredStudent?.last_name)
                }
            )
            return listStudents.join(', ')
        } catch (e) {
            return ""
        }
    }

    function _handleEdit(record: Class) {
        selectUserHandler(record);
        openEditUserModal();
    }

    function _handleAddUser() {
        openAddUserModal();
    }

    const selectUserHandler = (classObject: Class) => {
        setCurrentUser(classObject)
    }

    const openEditUserModal = () => {
        setEditUserOpen(true);
    }
    const openAddUserModal = () => {
        setAddUserOpen(true);
    }
    const closeEditUserModal = () => {
        setEditUserOpen(false);
        setCurrentUser(undefined);
    }
    const closeAddUserModal = () => {
        setAddUserOpen(false);
    }
    const openDeleteUserModal = (classObject: Class) => {
        confirm({
            title: t("classes.delete_title"),
            icon: <CloseCircleOutlined />,
            okText: t('common.yes'),
            okType: 'danger',
            cancelText: t('common.no'),
            async onOk() {
                try {

                    if (!isNil(classObject)) {
                        await thunkDispatch(removeClass(classObject.class_name))
                        setCurrentUser(undefined);
                    } else {
                        throw new Error("selected class is null");
                    }

                } catch (e) {
                    message.error(t("classes.cant_remove_class_error"))
                    setCurrentUser(undefined);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }




    const columns: ColumnProps<Class>[] = [
        {
            key: "class",
            title: t("classes.class_name"),
            width: 2,
            ellipsis: true,
            render: (value, record) => (
                <Typography.Text ellipsis>
                    {record.class_name}
                </Typography.Text>
            ),
        },
        {
            key: "assigned_teacher_app_key",
            title: t("classes.teacher_name"),
            dataIndex: "assigned_teacher_app_key",
            render: (value) => <Typography.Text ellipsis>
                {
                    teachers.find(teacher => teacher.user_id === value)?.name
                }
            </Typography.Text>,
            width: 2
        },
        {
            key: "student_ids",
            title: t("classes.student"),
            dataIndex: "student_ids",
            render: (value) => <Typography.Text ellipsis>
                {displayStudents(value)}
            </Typography.Text>,
            width: 2
        },
        {
            key: "actions",
            title: t("common.actions"),
            fixed: "right",
            width: 2,
            render: (value, record) => (
                <>
                    <Space>
                        <Tooltip title={t("classes.edit")}>
                            <Button
                                key={"editclass"}
                                size={"small"}
                                icon={
                                    <Icon
                                        className={"i20"}
                                        component={Edit16Regular as ForwardRefExoticComponent<any>}
                                    />
                                }
                                type={"text"}
                                onClick={() => _handleEdit(record)}
                            />
                        </Tooltip>
                        <Tooltip title={t("classes.remove_class")}>
                            <Button
                                key={"removeclass"}
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
                                    selectUserHandler(record);
                                    openDeleteUserModal(record);
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
                        title={t("classes.class_list")}
                        extra={
                            <Button onClick={() => _handleAddUser()}>{t('classes.add_class')}</Button>
                        }
                    /> <br />
                    <Table<Class>
                        loading={loading}
                        className={"data-table"}
                        scroll={{
                            y: height,
                            x: 1000
                        }}
                        rowKey={(record) => record.class_name}
                        columns={columns}
                        dataSource={classes}
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

                    <ClassEditModal classObject={currentUser!} isOpen={editUserOpen} closeModal={closeEditUserModal} />
                    <ClassAddModal isOpen={addUserOpen} closeModal={closeAddUserModal} />

                </Layout.Content>
            </Layout>
        </>
    );



}
