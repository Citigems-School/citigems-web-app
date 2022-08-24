import Icon, { CloseCircleOutlined } from "@ant-design/icons";
import { Dismiss16Regular, Person16Regular } from "@ricons/fluent";
import { Button, Layout, message, Modal, PageHeader, Space, Tooltip, Typography } from "antd";
import Table, { ColumnProps } from "antd/lib/table";
import { isNil } from "lodash";
import { ForwardRefExoticComponent, useState } from "react";
import { useSelector } from "react-redux";
import { useWindowDimensions } from "../../../hooks/useWindowDimensions";
import { Parent } from "../../../models/Parent";
import { removeParent } from "../../../store/reducers/parentsSlice";
import { RootState, useAppThunkDispatch } from "../../../store/store";
import ParentAddModal from "./parents-stackholder-add-modal.component";
import ParentEditModal from "./parents-stackholder-edit-modal.component";

const { confirm } = Modal;


export default function ParentsStackholderTable() {
    const thunkDispatch = useAppThunkDispatch();
    const { height } = useWindowDimensions();
    const { loading, parents } = useSelector((state: RootState) => state.parents);
    const [pageSize,
        setPageSize] = useState(5)

    const [addParentOpen, setAddParentOpen] = useState<boolean>(false);
    const [editParentOpen, setEditParentOpen] = useState<boolean>(false);
    const [currentParent, setCurrentParent] = useState<Parent>()

    function _handleEdit(record: Parent) {
        selectParentHandler(record);
        openEditParentModal();
    }

    function _handleAddParent() {
        openAddParentModal();
    }

    const selectParentHandler = (Parent: Parent) => {
        setCurrentParent(Parent)
    }

    const openEditParentModal = () => {
        setEditParentOpen(true);
    }
    const openAddParentModal = () => {
        setAddParentOpen(true);
    }
    const closeEditParentModal = () => {
        setEditParentOpen(false);
        setCurrentParent(undefined);
    }
    const closeAddParentModal = () => {
        setAddParentOpen(false);
    }
    const openDeleteParentModal = (parent: Parent) => {
        confirm({
            title: 'Are you sure delete this Parent?',
            icon: <CloseCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {

                    if (!isNil(parent)) {
                        await thunkDispatch(removeParent(parent.objectKey))
                        setCurrentParent(undefined);
                    } else {
                        throw new Error("selected Parent is null");
                    }

                } catch (e) {
                    message.error("Can't remove Parent, please try again")
                    setCurrentParent(undefined);
                }
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }




    const columns: ColumnProps<Parent>[] = [
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
            key: "telegram_number",
            title: "Telegram number",
            dataIndex: "telegram_number",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.telegram_number?.localeCompare(b.telegram_number || "") || 0
        },
        {
            key: "other_phone_numbers",
            title: "Other phone numbers",
            dataIndex: "other_phone_numbers",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.other_phone_numbers?.localeCompare(b.other_phone_numbers || "") || 0
        },
        {
            key: "place_of_work",
            title: "Place of work",
            dataIndex: "place_of_work",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.place_of_work?.localeCompare(b.place_of_work || "") || 0
        },
        {
            key: "profession",
            title: "Profession",
            dataIndex: "profession",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.profession?.localeCompare(b.profession || "") || 0
        },
        {
            key: "relationship",
            title: "Relationship",
            dataIndex: "relationship",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.relationship?.localeCompare(b.relationship || "") || 0
        },
        {
            key: "child_name",
            title: "Children names",
            dataIndex: "child_name",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.child_name?.localeCompare(b.child_name || "") || 0
        },
        {
            key: "number_of_children",
            title: "Number of children",
            dataIndex: "number_of_children",
            width: 2,
            align: "center",
            render: (value) => value,
            sorter: (a, b) => a.number_of_children?.localeCompare(b.number_of_children || "") || 0
        },
        {
            key: "actions",
            title: "Actions",
            fixed: "right",
            width: 2,
            render: (value, record) => (
                <>
                    <Space>
                        <Tooltip title={"Edit Parent"}>
                            <Button
                                key={"editParent"}
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
                        <Tooltip title={"Remove Parent"}>
                            <Button
                                key={"removeParent"}
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
                                    selectParentHandler(record);
                                    openDeleteParentModal(record);
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
                        title={"Parents List"}
                        extra={
                            <Button onClick={() => _handleAddParent()}>Add Parent</Button>
                        }
                    /> <br />
                    <Table<Parent>
                        loading={loading}
                        className={"data-table"}
                        scroll={{
                            y: height,
                            x: 1600
                        }}
                        rowKey={(record) => record.user_id}
                        columns={columns}
                        dataSource={parents}
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

                    <ParentEditModal parent={currentParent!} isOpen={editParentOpen} closeModal={closeEditParentModal} />
                    <ParentAddModal isOpen={addParentOpen} closeModal={closeAddParentModal} />

                </Layout.Content>
            </Layout>
        </>
    );



}
