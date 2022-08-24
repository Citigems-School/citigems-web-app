import { Row, Col } from "antd"
import ClassesTable from "../../../components/classes.components/classes-table.component"

const ClassesPage = () => {
    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <ClassesTable />
                </Col>
            </Row>

        </>
    )
}

export default ClassesPage;