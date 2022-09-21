import { Col, Row, Select } from "antd";
import { SelectHandler } from "rc-select/lib/Select";
import React, { ForwardRefExoticComponent, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LocalLanguage16Regular,
} from "@ricons/fluent";
import Icon from "@ant-design/icons";
const languages = [
  {
    id: "en",
    locale: "en",
    name: "English"
  },
  {
    id: "fr",
    locale: "fr",
    name: "Français"
  }
]

function ChangeLanguageDropdown() {
  const { i18n } = useTranslation();

  const handleLanguageSelect = (value: string) => {
    i18n.changeLanguage(value).then();
  }

  const currentLang = () => {
    if (i18n.language.indexOf('fr') >= 0) {
      return 'fr'
    } else if (i18n.language.indexOf('en') >= 0) {
      return 'en'
    } else {
      return languages.find((l) => l.locale === i18n.language)?.name || "en"
    }
  }

  return (
    <Row align={"middle"}>
      <Col>
        <Icon
          className={"i20"}
          component={
            LocalLanguage16Regular as ForwardRefExoticComponent<any>
          }
        />
      </Col>
      <Col>
        <Select
          style={{ width: 100 }}
          bordered={false}
          value={currentLang()}
          onSelect={handleLanguageSelect}>
          {languages.map((language: any) => (
            <Select.Option key={language.id} value={language.id}>
              {language.name}
            </Select.Option>
          ))}
        </Select>
      </Col>
    </Row>
  );
}

export default ChangeLanguageDropdown;
