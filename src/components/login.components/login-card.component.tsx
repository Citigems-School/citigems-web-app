import { Grid, Card, Typography, Row, Button, Form, Input, message, Alert } from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../store/reducers/userSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";
import Container from "../public.components/container.component";
import { isNil } from "lodash";
import { useState } from "react";

const { ErrorBoundary } = Alert;

const LoginCard = () => {

    const { pathname } = useLocation();
    const [showError, setShowError] = useState<boolean>(false);

    const thunkDispatch = useAppThunkDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { user, loading, error, isFetched } = useSelector((state: RootState) => state.user);

    const loginHandler = () => {
        return form.validateFields().then(async () => {
            try {
                await thunkDispatch(loginAdmin({
                    email: form.getFieldValue("email"),
                    password: form.getFieldValue("password")
                }))
                form.resetFields();
                if (user && isNil(error)) {
                    navigate("/admin/dashboard/");
                    return;
                } else if ((isNil(user) || error) && pathname === "/auth/login") {
                    setShowError(true);
                    return;
                }
            }
            catch (e) {
                message.error("Authentication failed, please try again")
                console.error(e);
            };

        });
    }

    return (
        <>
            <Container>
                <Card
                    style={{ margin: screens.lg ? "0 30% 0 30%" : "0" }}
                    bodyStyle={{ padding: screens.lg ? "32px 48px" : "32px 24px" }}>
                    <Typography.Title level={2} style={{ textAlign: "center" }}>
                        Login to Admin Dashboard
                    </Typography.Title>
                    <Row style={{ padding: "15px 0" }} justify={"center"}>
                        <img width="200px" src="/images/logo/logo-fulltext.png" />
                    </Row>
                    <Form form={form}
                        layout={"vertical"}
                        requiredMark={"optional"}>
                        <Form.Item
                            label={"E-mail"}
                            rules={[
                                {
                                    required: true,
                                    message: "Error"
                                },
                                {
                                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: "Email is inavlid"
                                }
                            ]}
                            name={"email"}>
                            <Input type={"email"} />
                        </Form.Item>
                        <Form.Item
                            label={"Password"}
                            rules={[
                                {
                                    required: true,
                                    message: "Error"
                                }
                            ]}
                            name={"password"}>
                            <Input type={"password"} />
                        </Form.Item>
                        <Row justify={"center"}>
                            {showError &&
                                    <Alert
                                        message="Error Authentication"
                                        showIcon
                                        description="E-mail or password wrong, please try again"
                                        type="error"
                                        closable
                                        style={{ marginBottom: '15px' }}
                                    />
                            }
                            <Button style={{ width: '150px' }} loading={loading} type="primary" onClick={loginHandler}>
                                Login
                            </Button>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </>
    )
}

export default LoginCard;