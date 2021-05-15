export const SECURITY_MODE_STANDALONE = 'cookie'
export const SECURITY_MODE_JWT = 'jwt'

const baseUrl = process.env.BASE_URL || '/'

let securityMode = SECURITY_MODE_STANDALONE
let browserUrl = process.env.NEXT_PUBLIC_KRATOS_BROWSER_URL || ''
let publicUrl = process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL || ''
switch ((process.env.SECURITY_MODE || '').toLowerCase()) {
  case 'jwt':
  case 'oathkeeper':
    securityMode = SECURITY_MODE_JWT
    break
  case 'cookie':
  case 'standalone':
  default:
    securityMode = SECURITY_MODE_STANDALONE
}

export default {
  kratos: {
    browser: browserUrl.replace(/\/+$/, ''),
    public: publicUrl.replace(/\/+$/, ''),
  },
  baseUrl,
  jwksUrl: process.env.JWKS_URL || '/',
  projectName: process.env.PROJECT_NAME || 'SecureApp',

  securityMode,
  SECURITY_MODE_JWT,
  SECURITY_MODE_STANDALONE,
}