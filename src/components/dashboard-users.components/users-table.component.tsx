import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import { Dismiss16Regular, Person16Regular } from "@ricons/fluent";
import { Button, Layout, message, Modal, PageHeader, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import { ForwardRefExoticComponent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../hooks/useWindowDimensions";
import { User } from "../../models/User";
import { removeUser } from "../../store/reducers/usersSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";
import UserAddModal from "./user-add-modal.component";
import UserEditModal from "./user-edit-modal.component";

const { confirm } = Modal;


export default function UsersTable() {

    const { t } = useTranslation();

    const thunkDispatch = useAppThunkDispatch();
    const { height } = useWindowDimensions();
    const { loading, users } = useSelector((state: RootState) => state.users);
    const { parents } = useSelector((state: RootState) => state.parents);
    const { students } = useSelector((state: RootState) => state.students);
    const [pageSize,
        setPageSize] = useState(5)

    const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
    const [editUserOpen, setEditUserOpen] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<User>()

    function _handleEdit(record: User) {
        selectUserHandler(record);
        openEditUserModal();
    }

    function _handleAddUser() {
        openAddUserModal();
    }

    const selectUserHandler = (user: User) => {
        setCurrentUser(user)
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
    const openDeleteUserModal = (user: User) => {
        confirm({
            title: 'Are you sure delete this User?',
            icon: <CloseCircleOutlined />,
            okText: t("common.yes"),
            okType: 'danger',
            cancelText: t("common.no"),
            async onOk() {
                try {

                    if (!isNil(user)) {
                        await thunkDispatch(removeUser(user.user_id))
                        setCurrentUser(undefined);
                    } else {
                        throw new Error("selected user is null");
                    }

                } catch (e) {
                    message.error("Can't remove user, please try again")
                    setCurrentUser(undefined);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }




    const columns: ColumnProps<User>[] = [
        {
            key: "id",
            title: t("common.user_id"),
            width: 2,
            ellipsis: true,
            render: (value, record) => (
                <Typography.Text ellipsis>
                    {record.user_id}
                </Typography.Text>
            ),
        },
        {
            key: "first_name",
            title: t("common.first_name"),
            dataIndex: "first_name",
            render: (value) => <Typography.Text ellipsis>
                {value}
            </Typography.Text>,
            width: 2,
            sorter: (a, b) => a.first_name?.localeCompare(b.first_name || "") || 0

        },
        {
            key: "last_name",
            title: t("common.last_name"),
            dataIndex: "last_name",
            render: (value) => <Typography.Text ellipsis>
                {value}
            </Typography.Text>,
            width: 2,
            sorter: (a, b) => a.last_name?.localeCompare(b.last_name || "") || 0
        },
        {
            key: "email",
            title: t("common.email"),
            dataIndex: "email",
            render: (value) => value,
            width: 3,
            sorter: (a, b) => a.email?.localeCompare(b.email || "") || 0
        },
        {
            key: "whatsapp_number",
            title: t("common.whatsapp_number"),
            dataIndex: "whatsapp_number",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.whatsapp_number?.localeCompare(b.whatsapp_number || "") || 0
        },
        {
            key: "other_numbers",
            title: t("common.other_numbers"),
            dataIndex: "other_numbers",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.other_numbers?.localeCompare(b.other_numbers || "") || 0
        },
        /*
                            child_key: user && user.child_key ? students.registered.concat(students.unregistered).find(student => student.student_key === user.child_key) : undefined,
                    parent_key: user && user.parent_key ? parents.find(parent => user.parent_key === parent.objectKey) : undefined
        */
        {
            key: "parent",
            title: t("parent.parent"),
            dataIndex: "parent_key",
            width: 2,
            align: "center",
            render: (value) => parents.find(parent => value === parent.objectKey)?.name,
            sorter: (a, b) => a.other_numbers?.localeCompare(b.other_numbers || "") || 0
        },
        {
            key: "child_key",
            title: t("common.child"),
            dataIndex: "child_key",
            width: 2,
            align: "center",
            render: (value) => {
                const result = students.registered.find(student => student.student_key === value)
                return result ? `${result?.first_name} ${result?.last_name}` : ""
            },
            sorter: (a, b) => a.other_numbers?.localeCompare(b.other_numbers || "") || 0
        },
        {
            key: "role",
            title: t("common.role"),
            dataIndex: "role",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.role?.localeCompare(b.role || "") || 0
        },
        {
            key: "selected_role",
            title: t("user.selected_role"),
            dataIndex: "selected_role",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.selected_role?.localeCompare(b.selected_role || "") || 0
        },
        {
            key: "actions",
            title: t("common.actions"),
            fixed: "right",
            width: 2,
            render: (value, record) => (
                <>
                    <Space>
                        <Tooltip title={"Edit User"}>
                            <Button
                                key={"edituser"}
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
                        <Tooltip title={"Remove User"}>
                            <Button
                                key={"removeuser"}
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
                        title={t("user.list_user")}
                        extra={
                            <Button onClick={() => _handleAddUser()}>Add User</Button>
                        }
                    /> <br />
                    <Table<User>
                        loading={loading}
                        className={"data-table"}
                        scroll={{
                            y: height,
                            x: 1600
                        }}
                        rowKey={(record) => record.user_id}
                        columns={columns}
                        dataSource={users}
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

                    <UserEditModal user={currentUser!} isOpen={editUserOpen} closeModal={closeEditUserModal} />
                    <UserAddModal isOpen={addUserOpen} closeModal={closeAddUserModal} />

                </Layout.Content>
            </Layout>
        </>
    );



}
