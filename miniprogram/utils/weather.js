// utils/weather.js
// Open-Meteo 天气 API + WMO 代码转中文

const WMO_MAP = {
  0:  { desc: '晴朗',  icon: '☀' },
  1:  { desc: '少云',  icon: '🌤' },
  2:  { desc: '多云',  icon: '⛅' },
  3:  { desc: '阴',    icon: '☁' },
  45: { desc: '雾',    icon: '🌫' },
  48: { desc: '冻雾',  icon: '🌫' },
  51: { desc: '小毛毛雨', icon: '🌦' },
  53: { desc: '毛毛雨', icon: '🌦' },
  55: { desc: '大毛毛雨', icon: '🌦' },
  56: { desc: '冻毛毛雨', icon: '🌧' },
  57: { desc: '强冻毛毛雨', icon: '🌧' },
  61: { desc: '小雨',  icon: '🌦' },
  63: { desc: '中雨',  icon: '🌧' },
  65: { desc: '大雨',  icon: '🌧' },
  66: { desc: '冻雨',  icon: '🌧' },
  67: { desc: '强冻雨', icon: '🌧' },
  71: { desc: '小雪',  icon: '🌨' },
  73: { desc: '中雪',  icon: '🌨' },
  75: { desc: '大雪',  icon: '❄' },
  77: { desc: '雪粒',  icon: '🌨' },
  80: { desc: '阵雨',  icon: '🌦' },
  81: { desc: '强阵雨', icon: '🌧' },
  82: { desc: '暴阵雨', icon: '⛈' },
  85: { desc: '阵雪',  icon: '🌨' },
  86: { desc: '强阵雪', icon: '❄' },
  95: { desc: '雷暴',  icon: '⛈' },
  96: { desc: '雷暴冰雹', icon: '⛈' },
  99: { desc: '强雷暴冰雹', icon: '⛈' }
}

function wmoDesc(code) {
  return (WMO_MAP[code] || WMO_MAP[0]).desc
}
function wmoIcon(code) {
  return (WMO_MAP[code] || WMO_MAP[0]).icon
}

function uvLevel(v) {
  if (v < 3) return { l: '弱', c: '#34C759' }
  if (v < 6) return { l: '中等', c: '#FFD60A' }
  if (v < 8) return { l: '强', c: '#FF9500' }
  if (v < 11) return { l: '很强', c: '#FF3B30' }
  return { l: '极强', c: '#AF52DE' }
}

function aqiLevel(v) {
  if (v < 50)  return { l: '优', c: '#34C759' }
  if (v < 100) return { l: '良', c: '#FFD60A' }
  if (v < 150) return { l: '中', c: '#FF9500' }
  if (v < 200) return { l: '差', c: '#FF3B30' }
  if (v < 300) return { l: '很差', c: '#AF52DE' }
  return { l: '危险', c: '#8B0000' }
}

function estimateAQI(cur, daily) {
  // Open-Meteo 不直接提供 AQI, 估测: 湿度 + 风速 + 天气码
  const hum = cur.relative_humidity_2m || 0
  const wind = cur.wind_speed_10m || 0
  const code = cur.weather_code || 0
  let aqi = 50 + (hum - 50) * 0.5
  if (code >= 45 && code <= 48) aqi += 80
  if (code >= 51 && code <= 67) aqi += 30
  if (code >= 71 && code <= 77) aqi += 20
  if (code >= 95) aqi += 40
  aqi -= wind * 1.2
  return Math.max(10, Math.min(500, Math.round(aqi)))
}

function fetchWeather(lat, lon) {
  return new Promise((resolve, reject) => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,weather_code&timezone=auto&forecast_days=7`
    wx.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data) resolve(res.data)
        else reject(new Error(`HTTP ${res.statusCode}`))
      },
      fail: (err) => reject(new Error(err.errMsg || '网络请求失败'))
    })
  })
}

module.exports = {
  WMO_MAP, wmoDesc, wmoIcon, uvLevel, aqiLevel, estimateAQI, fetchWeather
}
