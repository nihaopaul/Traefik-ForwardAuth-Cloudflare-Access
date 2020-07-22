const jws = require("jws");
const axios = require("axios");
const { DOMAIN, CERT_URL, AUD } = require('./config')

class Validate {
  constructor() {
    this.certificates = this.fetchCertificates();
  }

  async fetchCertificates() {
    return await axios
      .get(CERT_URL)
      .then(({ data }) => {
        return data;
      })
      .catch(({ errno }) => {
        switch (errno) {
          case "ENOTFOUND":
            console.log("Address incorrect:", CERT_URL);
            break;
          default:
            console.log("err", errno);
        }
      });
  }

  async decode(jwt) {
    let { header, payload, signature } = (await jws.decode(jwt)) || {};
    if (!header || !payload || !signature) throw Error("Invalid Token");
    return { header, payload, signature };
  }

  async verify({ jwt, algorithm, certificateid }) {
    let certificate = await this.getCertificate(certificateid);
    return await jws.verify(jwt, algorithm, certificate);
  }

  async validateAUD(aud) {
    let isValid = aud.find((item) => AUD.includes(item)) ? true : false;
    if (!isValid) throw Error("No AUD match");
    return true;
  }

  async getCertificate(certificateid) {
    let { public_cert } = await this.certificates;
    if (public_cert.kid != certificateid) throw Error("Certificate not found");
    return public_cert.cert;
  }

  async test(jwt) {
    try {
      let { header, payload } = await this.decode(jwt);
      let { aud } = JSON.parse(payload);

      await this.validateAUD(aud);

      return await this.verify({
        jwt,
        algorithm: header.alg,
        certificateid: header.kid,
      });
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = new Validate();
