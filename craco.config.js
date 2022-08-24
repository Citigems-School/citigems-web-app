const CracoLessPlugin = require("craco-less");

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#C1272C",
              "@success-color": "#1AC45E",
              "@warning-color": "#FA9E14",
              "@error-color": "#FD1648",
              "@menu-dark-bg": "#8a0000",
              "@menu-dark-inline-submenu-bg": "#8a0000",
              "@layout-sider-background": "#8a0000",
              "@layout-trigger-background": "#8a0000",
              "@footer-bg-color": "#1B2C29",
              "@box-shadow-base": "0px 4px 16px -4px rgba(0,0,0,0.25)",
              "@layout-header-padding": "0 32px",
              "@card-padding-base": "16px",
              "@switch-inner-margin-max": "28px",
              "@switch-inner-margin-min": "12px",
              "@form-item-margin-bottom": "22px",
              "@table-padding-vertical": "8px",
              "@table-padding-horizontal": "16px",
              "@border-radius-base": "4px",
              "@table-border-radius-base": "6px",
              "@card-radius": "6px"
            },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
};
