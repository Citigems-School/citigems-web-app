import { Col, Row, Typography } from "antd";
import StaticCards from "../../../components/dashboard.components/static-cards.component";

const IndexDashboardPage = () => {

    return <>
        <Row gutter={[14, 14]}>
            <Col span={24}>
                <Typography.Text style={{ fontSize: 25 }}>
                    Welcome Admin!
                </Typography.Text>
            </Col>
            <Col span={24}>
                <StaticCards />
            </Col>           
        </Row>
    </>
}

export default IndexDashboardPage;