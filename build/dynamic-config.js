class DynamicConfigManager {
  API = "";
  apps = [];
  token = "";
  timer = null;

  constructor() {
    if (!process.env.CF_ORG) throw Error("Account ID is required");
    if (!process.env.CF_TOKEN) throw Error("Token is required");
    const accountId = process.env.CF_ORG;
    this.token = process.env.CF_TOKEN;
    this.API = `https://api.cloudflare.com/client/v4/accounts/${accountId}/access/apps`;

    this.fetchApps();
    this.timer = setInterval(() => this.refreshApps(), 1000 * 60 * 60); // 1 hour
  }

  async refreshApps() {
    console.log("apps expired, fetching new ones");
    this.fetchApps();
  }

  get AUD() {
    return this.apps.map(({ aud }) => aud);
  }

  async fetchApps() {
    const queryParams = new URLSearchParams({
      match: "any",
      ui_apps: true,
    });

    const apps = await fetch(`${this.API}?${queryParams}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    })
      .then((res) => res.json())
      .then(({ result }) => result)
      .catch((err) => console.log(err));

    // something went wrong, lets not update apps
    if (apps && apps.length) {
      this.apps = apps;
    }
  }
}
// should only have one instance running
export default new DynamicConfigManager();
