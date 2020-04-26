const jws = require('jws')
const axios = require('axios')

const DOMAIN = 'https://nihaopaul.cloudflareaccess.com'
const CERT_URL = `${DOMAIN}/cdn-cgi/access/certs`
const AUD = [
  '006fb25724bb43a85ba83fa0b6c0c5958e640b626be78d87dd0b8787a07d2f00',
  'a4bef775641c84a21da521341689c62f384aa6fb8e4a1dcc2ffffd3439daa83d'
]

class Validate {
  
  constructor() {
    this.certificates = this.fetchCertificates()
  }

  async fetchCertificates() {
    return await axios.get(CERT_URL)
    .then(({ data }) => {
      return data
    })
    .catch(({errno}) => {
      switch (errno) {
        case 'ENOTFOUND':
          console.log('Address incorrect:', CERT_URL)
          break;
        default:
          console.log("err", errno)
      }
      
    })
  }

  async decode(jwt) {
    let { header, payload, signature } = await jws.decode(jwt) || {}
    if (!header || !payload || !signature) throw Error("Invalid Token")
    return { header, payload, signature }
  }

  async verify({ jwt, algorithm, certificateid }) {
    let certificate = await this.getCertificate(certificateid)
    return await jws.verify(jwt, algorithm, certificate)
  }

  async validateAUD(aud) {
    let isValid = aud.find(item => AUD.includes(item)) ? true : false;
    if (!isValid) throw Error('No AUD match')
    return true
  }

  async getCertificate(certificateid) {
    let { public_cert } = await this.certificates
    if (public_cert.kid != certificateid) throw Error("Certificate not found")
    return public_cert.cert
  }

  async test(jwt) {

    try {
      let { header, payload, signature } = await this.decode(jwt)
      let { exp, iat, nbf, aud, email, iss, type, identity_nonce, sub } = JSON.parse(payload)

      await this.validateAUD(aud)
      
      return await this.verify({ 
        jwt, 
        algorithm: header.alg, 
        certificateid: header.kid
      })

    } catch (error) {
      console.log(error)
      return false
    }

  }
}

module.exports = new Validate()