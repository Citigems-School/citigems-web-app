import { Col, Row } from "antd";
import { useSelector } from "react-redux";
import {
    UserOutlined,
} from '@ant-design/icons';
import {
    Accessibility24Regular,
    PeopleCommunity24Regular,
    Person24Regular,
    PersonAccounts24Regular

} from "@ricons/fluent";
import StatisticCard from "./statistic-card.component";
import { RootState, useAppThunkDispatch } from "../../store/store";
import { ForwardRefExoticComponent, useEffect } from "react";
import { countUsers } from "../../store/reducers/usersSlice";
import Icon from "@ant-design/icons";

const StaticCards = () => {
    const { counts, loading } = useSelector((state: RootState) => state.users);
    const thunkDispatch = useAppThunkDispatch();

    useEffect(() => {
        thunkDispatch(countUsers());
    }, [])

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} lg={6}>
                <StatisticCard color="red" title="Total Users" value={counts.total} icon={
                    <Icon
                        className="i20"
                        component={
                            Person24Regular as ForwardRefExoticComponent<any>
                        }
                    />
                } isLoading={loading} />
            </Col>
            <Col xs={24} lg={6}>
                <StatisticCard color="red" title="Total Students" value={counts.students} icon={
                    <Icon
                        className="i20"
                        component={
                            Accessibility24Regular as ForwardRefExoticComponent<any>
                        }
                    />
                } isLoading={loading} />
            </Col>
            <Col xs={24} lg={6}>
                <StatisticCard color="red" title="Total Teachers" value={counts.teachers} icon={
                    <Icon
                        className="i20"
                        component={
                            PersonAccounts24Regular as ForwardRefExoticComponent<any>
                        }
                    />
                } isLoading={loading} />
            </Col>
            <Col xs={24} lg={6}>
                <StatisticCard color="red" title="Total Parents" value={counts.parents} icon={
                    <Icon
                        className="i20"
                        component={
                            PeopleCommunity24Regular as ForwardRefExoticComponent<any>
                        }
                    />
                } isLoading={loading} />
            </Col>
        </Row>
    )
};

export default StaticCards;