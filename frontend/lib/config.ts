export const SECURITY_MODE_STANDALONE = 'cookie'
export const SECURITY_MODE_JWT = 'jwt'

const baseUrl = process.env.BASE_URL || '/'

let publicUrl = process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL || ''

export default {
  kratos: {
    public: publicUrl.replace(/\/+$/, ''),
  },
  baseUrl,
}