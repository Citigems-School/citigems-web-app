import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import { Dismiss16Regular, Person16Regular } from "@ricons/fluent";
import { Button, Layout, message, Modal, PageHeader, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import { ForwardRefExoticComponent, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Admin } from "../../../models/Admin";
import { removeAdmin } from "../../../store/reducers/adminsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";
import AdminAddModal from "./admin-stackholder-add-modal.component";
import AdminEditModal from "./admin-stackholder-edit-modal.component";

const { confirm } = Modal;


export default function AdminStackholderTable() {
    const thunkDispatch = useAppThunkDispatch();
    const { height } = useWindowDimensions();
    const { loading, admins } = useSelector((state: RootState) => state.admins);
    const [pageSize,
        setPageSize] = useState(5)

    const [addAdminOpen, setAddAdminOpen] = useState<boolean>(false);
    const [editAdminOpen, setEditAdminOpen] = useState<boolean>(false);
    const [currentAdmin, setCurrentAdmin] = useState<Admin>()

    function _handleEdit(record: Admin) {
        selectAdminHandler(record);
        openEditAdminModal();
    }

    function _handleAddAdmin() {
        openAddAdminModal();
    }

    const selectAdminHandler = (Admin: Admin) => {
        setCurrentAdmin(Admin)
    }

    const openEditAdminModal = () => {
        setEditAdminOpen(true);
    }
    const openAddAdminModal = () => {
        setAddAdminOpen(true);
    }
    const closeEditAdminModal = () => {
        setEditAdminOpen(false);
        setCurrentAdmin(undefined);
    }
    const closeAddAdminModal = () => {
        setAddAdminOpen(false);
    }
    const openDeleteAdminModal = (admin: Admin) => {
        confirm({
            title: 'Are you sure delete this Admin?',
            icon: <CloseCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {

                    if (!isNil(admin)) {
                        await thunkDispatch(removeAdmin(admin.objectKey))
                        setCurrentAdmin(undefined);
                    } else {
                        throw new Error("selected Admin is null");
                    }

                } catch (e) {
                    message.error("Can't remove Admin, please try again")
                    setCurrentAdmin(undefined);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }




    const columns: ColumnProps<Admin>[] = [
        {
            key: "id",
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
            key: "email",
            title: "Email",
            dataIndex: "email",
            render: (value) => value,
            width: 3,
            sorter: (a, b) => a.email?.localeCompare(b.email || "") || 0
        },
        {
            key: "whatsapp_number",
            title: "WhatsApp number",
            dataIndex: "whatsapp_number",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.whatsapp_number?.localeCompare(b.whatsapp_number || "") || 0
        },
        {
            key: "other_numbers",
            title: "Other number",
            dataIndex: "other_numbers",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.other_numbers?.localeCompare(b.other_numbers || "") || 0
        },
        {
            key: "responsibilities",
            title: "Role",
            dataIndex: "responsibilities",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.responsibilities?.localeCompare(b.responsibilities || "") || 0
        },
        {
            key: "actions",
            title: "Actions",
            fixed: "right",
            width: 2,
            render: (value, record) => (
                <>
                    <Space>
                        <Tooltip title={"Edit Admin"}>
                            <Button
                                key={"editAdmin"}
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
                        <Tooltip title={"Remove Admin"}>
                            <Button
                                key={"removeAdmin"}
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
                                    selectAdminHandler(record);
                                    openDeleteAdminModal(record);
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
                        title={"Admins List"}
                        extra={
                            <Button onClick={() => _handleAddAdmin()}>Add Admin</Button>
                        }
                    /> <br />
                    <Table<Admin>
                        loading={loading}
                        className={"data-table"}
                        scroll={{
                            y: height,
                            x: 1600
                        }}
                        rowKey={(record) => record.user_id}
                        columns={columns}
                        dataSource={admins}
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

                    <AdminEditModal admin={currentAdmin!} isOpen={editAdminOpen} closeModal={closeEditAdminModal} />
                    <AdminAddModal isOpen={addAdminOpen} closeModal={closeAddAdminModal} />

                </Layout.Content>
            </Layout>
        </>
    );



}
