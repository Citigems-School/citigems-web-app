import { Row, Col } from "antd";
import StudentsStackholderTable from "../../../components/stackholders.components/students/students-stackholder-table.component";

const StackholderStudentsPage = () => {
    return (
        <>
         <Row gutter={[16, 16]}>
                <Col span={24}>
                    <StudentsStackholderTable />
                </Col>
            </Row>
        </>
    )
}
export default StackholderStudentsPage;