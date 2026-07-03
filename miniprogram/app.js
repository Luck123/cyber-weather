// app.js
App({
  onLaunch() {
    // 读取主题
    const theme = wx.getStorageSync('cyberWeatherTheme') || 'cyber'
    this.globalData.theme = theme
  },
  globalData: {
    theme: 'cyber',  // 'cyber' | 'ios'
    setTheme(name) {
      this.theme = name
      wx.setStorageSync('cyberWeatherTheme', name)
    }
  }
})
