import { Grid, Card, Typography, Row, Button, Form, Input, message, Alert } from "antd";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../store/reducers/userSlice";
import { RootState, useAppThunkDispatch } from "../../store/store";
import Container from "../public.components/container.component";
import { isNil } from "lodash";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const LoginCard = () => {
    const { t } = useTranslation();

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
                message.error(t('user.auth_failed'))
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
                        {t('auth.title')}
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
                                    message: t("common.error")
                                },
                                {
                                    pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                                    message: t("common.email_invalid")
                                }
                            ]}
                            name={"email"}>
                            <Input type={"email"} />
                        </Form.Item>
                        <Form.Item
                            label={t('common.password')}
                            rules={[
                                {
                                    required: true,
                                    message: t("common.error")
                                }
                            ]}
                            name={"password"}>
                            <Input type={"password"} />
                        </Form.Item>
                        <Row justify={"center"}>
                            {showError &&
                                <Alert
                                    message={t('auth.auth_error')}
                                    showIcon
                                    description={t('auth.auth_error_body')}
                                    type="error"
                                    closable
                                    style={{ marginBottom: '15px' }}
                                />
                            }
                            <Button style={{ width: '150px' }} loading={loading} type="primary" onClick={loginHandler}>
                                {t('auth.login')}
                            </Button>
                        </Row>
                    </Form>
                </Card>
            </Container>
        </>
    )
}

export default LoginCard;