import { Col, Row } from "antd";
import AdminStackholderTable from "../../../components/stackholders.components/admins/admin-stackholder-table.component";

const StackholderAdminPage = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <AdminStackholderTable />
                </Col>
            </Row>

        </>
    )
}
export default StackholderAdminPage;