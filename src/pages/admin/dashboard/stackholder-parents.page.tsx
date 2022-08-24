import { Row, Col } from "antd";
import ParentsStackholderTable from "../../../components/stackholders.components/parents/parents-stackholder-table.component";

const StackholderParentsPage = () => {
    return (
        <>
           <Row gutter={[16, 16]}>
                <Col span={24}>
                    <ParentsStackholderTable />
                </Col>
            </Row>
        </>
    )
}

export default StackholderParentsPage;