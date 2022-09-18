import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import StaticCards from "../../../components/dashboard.components/static-cards.component";

const IndexDashboardPage = () => {

    const {t} = useTranslation();

    return <>
        <Row gutter={[14, 14]}>
            <Col span={24}>
                <Typography.Text style={{ fontSize: 25 }}>
                    {t('dashboard.welcome')}
                </Typography.Text>
            </Col>
            <Col span={24}>
                <StaticCards />
            </Col>           
        </Row>
    </>
}

export default IndexDashboardPage;