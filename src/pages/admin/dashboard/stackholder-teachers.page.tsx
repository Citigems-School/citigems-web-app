import { Row, Col } from "antd";
import TeachersStackholderTable from "../../../components/stackholders.components/teachers/teachers-stackholder-table.component";

const StackholderTeachersPage = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <TeachersStackholderTable />
                </Col>
            </Row>
        </>
    )
}
export default StackholderTeachersPage;