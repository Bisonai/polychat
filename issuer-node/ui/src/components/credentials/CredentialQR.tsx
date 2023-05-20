import { Avatar, Card, Col, Grid, Image, Row, Space, Typography } from "antd";
import { QRCodeSVG } from "qrcode.react";

import { useEnvContext } from "src/contexts/Env";

export function CredentialQR({
  qrCode,
  schemaType,
  subTitle,
}: {
  qrCode: unknown;
  schemaType: string;
  subTitle: string;
}) {
  const env = useEnvContext();

  const { lg } = Grid.useBreakpoint();

  return (
    <Space align="center" direction="vertical" size="large">
      <Avatar shape="square" size={64} src={env.issuer.logo} />

      <Space
        direction="vertical"
        style={{ padding: "0 24px", textAlign: "center", width: lg ? 800 : "100%" }}
      >
        <Typography.Title level={2}>
          {env.issuer.name} wants to send you a credential
        </Typography.Title>

        <Typography.Text style={{ fontSize: 18 }} type="secondary">
          {subTitle}
        </Typography.Text>
      </Space>

      <Card bodyStyle={{ padding: 0 }} style={{ margin: "auto", width: lg ? 800 : "100%" }}>
        <Row>
          <Col
            className="full-width"
            style={{
              background:
                'url("/images/noise-bg.png"), linear-gradient(50deg, rgb(230, 45, 60) 0%, rgba(234, 45, 64, 1) 50%',
              borderRadius: 8,
              padding: 24,
            }}
          >
            <QRCodeSVG
              className="full-width"
              includeMargin
              level="H"
              style={{ height: 300 }}
              value={JSON.stringify(qrCode)}
            />
          </Col>
        </Row>

      </Card>
    </Space>
  );
}
