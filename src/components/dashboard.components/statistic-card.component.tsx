import { Card, Col, Row, Statistic } from "antd";
import { ReactElement } from "react";
import classNames from "classnames";

type StatisticCardProps = {
  color: "primary" | "red" | "blue" | "orange" | "gold" | "green";
  inverted?: boolean;
  title: string;
  value: string | number;
  suffix?: string;
  prefix?: string;
  icon?: ReactElement;
  isLoading: boolean
};

function StatisticCard({
  color,
  inverted,
  title,
  value,
  suffix,
  prefix,
  icon,
  isLoading
}: StatisticCardProps) {
  return (
    <Card
      bordered={false}
      className={classNames(
        (inverted ? "inverted-" : "") + color,
        inverted ? "inverted" : ""
      )}
      bodyStyle={{ padding: "16px 24px" }}>
      <Row align={"middle"} gutter={24}>
        <Col>{icon}</Col>
        <Col>
          <Statistic
            className={"small"}
            title={title}
            value={value}
            suffix={suffix}
            prefix={prefix}
            loading={isLoading}
          />
        </Col>
      </Row>
    </Card>
  );
}

export default StatisticCard;
