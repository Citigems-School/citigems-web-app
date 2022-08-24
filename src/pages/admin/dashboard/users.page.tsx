import { Col, Row, Typography } from "antd";
import UsersTable from "../../../components/dashboard-users.components/users-table.component";

const UsersPage = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <UsersTable />
                </Col>
            </Row>
        </>

    )
}
export default UsersPage;