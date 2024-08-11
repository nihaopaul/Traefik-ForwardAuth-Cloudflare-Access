class AUDmanager {
  timer = null;
  aud = [];
  constructor() {
    this.aud = this.fetchAUD();
    this.timer = setInterval(
      () => this.expireAndFetchAUD(),
      1000 * 60 * 60 * 24
    );
  }
}
