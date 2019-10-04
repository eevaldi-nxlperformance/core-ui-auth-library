export const environmment = {
  defaults: {
    tenantConfig: {
      tenant: 'nxlseed.onmicrosoft.com',
      b2cURL: 'https://login.microsoftonline.com/tfp/',
      clientID: 'f6a0bc85-cdd2-4425-a5eb-bd24698c2c26',
      signInUpPolicy: 'B2C_1_signupsignin1',
      signUpPolicy: 'B2C_1_signupsignin1',
      passwordResetPolicy: 'B2C_1_PwdReset_1',
      redirectUri: 'http://localhost:4200',
      b2cScopes: [
        'https://nxlseed.onmicrosoft.com/test/demo.read',
        'https://nxlseed.onmicrosoft.com/test/demo.write',
        'https://nxlseed.onmicrosoft.com/test/user_impersonation'
      ],
      passwordResetErrorCode: 'AADB2C90118'
    }
  },
  production: false
};
