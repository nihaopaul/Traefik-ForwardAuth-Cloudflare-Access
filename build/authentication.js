import jws from "jws";
import DynamicConfigManager from "./dynamic-config.js";

class Validate {
  API = null;
  timer = null;
  constructor() {
    if (!process.env.CF_DOMAIN) throw Error("Domain is required");
    this.API = `${process.env.CF_DOMAIN}/cdn-cgi/access/certs`;

    this.certificates = this.fetchCertificates();
    this.timer = setInterval(
      () => this.expireAndFetchCertificates(),
      1000 * 60 * 60 * 24 // 24 hours
    );
  }

  async expireAndFetchCertificates() {
    console.log("Certificates expired, fetching new ones");
    this.certificates = await this.fetchCertificates();
  }

  async fetchCertificates() {
    const response = await fetch(this.API);
    if (!response.ok) {
      throw new Error("Failed to fetch certificates");
    }
    return response.json().then((certificates) => {
      return certificates;
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
    let isValid = aud.find((item) => DynamicConfigManager.AUD.includes(item))
      ? true
      : false;
    if (!isValid) throw Error("No AUD match");
    return true;
  }

  async getCertificate(certificateid) {
    let { public_certs } = await this.certificates;
    const public_cert = public_certs.find((cert) => cert.kid == certificateid);

    if (!public_cert) throw Error("Certificate not found");
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

export default new Validate();
