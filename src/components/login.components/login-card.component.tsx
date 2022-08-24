import { Grid, Card, Typography, Row, Button, Form, Input, message } from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../store/reducers/userSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";
import Container from "../public.components/container.component";
import { isNil } from "lodash";

const LoginCard = () => {

    const thunkDispatch = useAppThunkDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const { user, loading, error } = useSelector((state: RootState) => state.user);

    const loginHandler = () => {
        return form.validateFields().then(async () => {
            return thunkDispatch(loginAdmin({
                email: form.getFieldValue("email"),
                password: form.getFieldValue("password")
            })).then(({ type }) => {
                form.resetFields();
                if (user && isNil(error)) {
                    console.log("Hello :) ");
                    navigate("/admin/dashboard/");
                    return;
                }
                if (isNil(user) || error) {
                    console.log("Triggered 404")
                    message.error("Authentication failed, please check your credentials")
                    return;
                }
            }).catch(e => {
                console.log("Triggered 500")
                message.error("Authentication failed, please try again")
                console.error(e);
            });

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