export const networkStore = {
  logs: [] as any,
  autoClearNetworkLength: 301,
  pauseNetwork: false,

  push(entry: any) {
    this.logs.push(entry)
    if (this.logs.length > this.autoClearNetworkLength) {
      this.logs.splice(0, this.logs.length - this.autoClearNetworkLength)
    }
  },

  clear() {
    this.logs.length = 0
  }
}
