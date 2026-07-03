// pages/index/index.js
const { CITY_DB, CITY_DB_MAP, searchCities } = require('../../utils/cities.js')
const { getAlmanac } = require('../../utils/lunar.js')
const { fetchWeather, wmoDesc, wmoIcon, uvLevel, aqiLevel, estimateAQI } = require('../../utils/weather.js')

const MAX_CITIES = 8
const STORAGE_KEY = 'cyberWeatherOrder'
const ADDED_KEY = 'cyberWeatherAdded'

const DEFAULT_IDS = ['beijing', 'shanghai', 'guangzhou', 'shenzhen', 'chengdu', 'hangzhou']

function fmt(n, d = 0) {
  if (n == null || isNaN(n)) return '--'
  return Number(n).toFixed(d)
}
function num(s) { return s == null ? 0 : Number(s) }

Page({
  data: {
    theme: 'cyber',  // 'cyber' | 'ios'
    statusText: '初始化中...',
    errorBanner: '',
    errorShow: false,
    now: '',
    almanac: null,
    cities: [],
    searchQuery: '',
    searchResults: [],
    showDropdown: false,
    showModal: false,
    modalCity: null,
    toast: null,
    toastTimer: null
  },

  onLoad() {
    const theme = wx.getStorageSync('cyberWeatherTheme') || 'cyber'
    this.setData({ theme })
    this.setData({ almanac: getAlmanac(new Date()) })
    this.tickClock()
    setInterval(() => this.tickClock(), 1000)
    this.loadCities()
  },

  tickClock() {
    const d = new Date()
    const pad = n => String(n).padStart(2, '0')
    const str = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    this.setData({ now: str })
  },

  loadCities() {
    // 恢复顺序
    let order = wx.getStorageSync(STORAGE_KEY)
    let added = wx.getStorageSync(ADDED_KEY) || []
    let ids
    if (order && Array.isArray(order) && order.length) {
      ids = order.filter(id => CITY_DB_MAP[id])
    } else {
      ids = [...DEFAULT_IDS]
    }
    // 把 added 附加到末尾
    added.forEach(id => {
      if (!ids.includes(id) && CITY_DB_MAP[id]) ids.push(id)
    })
    this.setData({ statusText: '正在获取数据...' })
    this.fetchAll(ids)
  },

  async fetchAll(ids) {
    const items = await Promise.all(ids.map(async id => {
      const city = CITY_DB_MAP[id]
      if (!city) return null
      try {
        const d = await fetchWeather(city.lat, city.lon)
        const cur = d.current
        const aqi = estimateAQI(cur, d.daily)
        const uv = uvLevel((d.daily.uv_index_max && d.daily.uv_index_max[0]) || 0)
        const aq = aqiLevel(aqi)
        const maxs = d.daily.temperature_2m_max || []
        const mins = d.daily.temperature_2m_min || []
        const sparkline = maxs.slice(0, 7).map((m, i) => (m + (mins[i] || m)) / 2)
        return {
          id, city, current: cur, daily: d.daily, aqi, uv, aq,
          sparkline,
          desc: wmoDesc(cur.weather_code),
          icon: wmoIcon(cur.weather_code)
        }
      } catch (e) {
        return { id, city, error: e.message }
      }
    }))
    const valid = items.filter(Boolean)
    const success = valid.filter(i => !i.error).length
    this.setData({
      cities: valid,
      statusText: success === valid.length ? `在线 · ${success} 节点` : `在线 · ${success}/${valid.length}`,
      errorBanner: success < valid.length ? `部分城市连接中断 (${valid.length - success}/${valid.length})` : '',
      errorShow: success < valid.length
    })
  },

  /* ========== 主题切换 ========== */
  toggleTheme() {
    const next = this.data.theme === 'cyber' ? 'ios' : 'cyber'
    this.setData({ theme: next })
    wx.setStorageSync('cyberWeatherTheme', next)
  },

  /* ========== 搜索 ========== */
  onSearchInput(e) {
    const q = e.detail.value.trim()
    this.setData({ searchQuery: q })
    if (!q) {
      this.setData({ searchResults: [], showDropdown: false })
      return
    }
    const results = searchCities(q).slice(0, 20)
    const addedSet = new Set(this.data.cities.map(c => c.city.id))
    const decorated = results.map(c => ({
      ...c,
      isAdded: addedSet.has(c.id),
      canAddMore: this.data.cities.length < MAX_CITIES
    }))
    this.setData({ searchResults: decorated, showDropdown: true })
  },

  onSearchClear() {
    this.setData({ searchQuery: '', searchResults: [], showDropdown: false })
  },

  onSearchFocus() {
    if (this.data.searchQuery) this.setData({ showDropdown: true })
  },

  onSearchBlur() {
    // 延迟关闭, 让 addCity click 触发
    setTimeout(() => this.setData({ showDropdown: false }), 200)
  },

  async addCity(e) {
    const id = e.currentTarget.dataset.id
    if (this.data.cities.find(c => c.city.id === id)) {
      this.showToast('该城市已添加', 'warn')
      return
    }
    if (this.data.cities.length >= MAX_CITIES) {
      this.showToast('已达 8 个城市上限, 请先移除一些城市', 'warn')
      return
    }
    const city = CITY_DB_MAP[id]
    if (!city) return
    // 乐观更新: 立即显示骨架
    const skeleton = { id, city, loading: true }
    const newCities = [...this.data.cities, skeleton]
    this.setData({
      cities: newCities,
      showDropdown: false,
      searchQuery: '',
      searchResults: []
    })
    this.saveOrder()

    try {
      const d = await fetchWeather(city.lat, city.lon)
      const cur = d.current
      const aqi = estimateAQI(cur, d.daily)
      const uv = uvLevel((d.daily.uv_index_max && d.daily.uv_index_max[0]) || 0)
      const aq = aqiLevel(aqi)
      const maxs = d.daily.temperature_2m_max || []
      const mins = d.daily.temperature_2m_min || []
      const sparkline = maxs.slice(0, 7).map((m, i) => (m + (mins[i] || m)) / 2)
      const item = {
        id, city, current: cur, daily: d.daily, aqi, uv, aq, sparkline,
        desc: wmoDesc(cur.weather_code), icon: wmoIcon(cur.weather_code)
      }
      const updated = this.data.cities.map(c => c.id === id ? item : c)
      this.setData({ cities: updated })
      this.showToast(`已添加 ${city.name}`, 'success')
    } catch (err) {
      // 回滚
      const updated = this.data.cities.filter(c => c.id !== id)
      this.setData({ cities: updated })
      this.saveOrder()
      this.showToast(`添加 ${city.name} 失败`, 'error')
    }
  },

  saveOrder() {
    const ids = this.data.cities.map(c => c.id)
    const defaultSet = new Set(DEFAULT_IDS)
    const order = ids.filter(id => defaultSet.has(id))
    const added = ids.filter(id => !defaultSet.has(id))
    wx.setStorageSync(STORAGE_KEY, order)
    wx.setStorageSync(ADDED_KEY, added)
  },

  /* ========== 移除 ========== */
  removeCity(e) {
    const id = e.currentTarget.dataset.id
    const city = CITY_DB_MAP[id]
    if (!city) return
    wx.showModal({
      title: '移除城市',
      content: `确定移除 ${city.name}?`,
      success: (res) => {
        if (res.confirm) {
          const updated = this.data.cities.filter(c => c.id !== id)
          this.setData({ cities: updated })
          this.saveOrder()
          this.showToast(`已移除 ${city.name}`, 'success')
        }
      }
    })
  },

  /* ========== 详情模态框 ========== */
  openCityModal(e) {
    const id = e.currentTarget.dataset.id
    const city = this.data.cities.find(c => c.id === id)
    if (!city) return
    const data = {
      ...city,
      daily: (city.daily && city.daily.time) ? city.daily.time.map((t, i) => ({
        date: t,
        max: city.daily.temperature_2m_max[i],
        min: city.daily.temperature_2m_min[i],
        code: city.daily.weather_code[i],
        pop: city.daily.precipitation_probability_max[i]
      })).slice(0, 7) : []
    }
    this.setData({ showModal: true, modalCity: data })
  },

  closeModal() {
    this.setData({ showModal: false, modalCity: null })
  },

  modalRemove() {
    const id = this.data.modalCity.id
    this.closeModal()
    setTimeout(() => this.removeCity({ currentTarget: { dataset: { id } } }), 200)
  },

  stopProp() {},

  /* ========== 重置 / 刷新 ========== */
  resetOrder() {
    wx.showModal({
      title: '重置排序',
      content: '将恢复默认 6 个城市, 继续?',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync(STORAGE_KEY)
          wx.removeStorageSync(ADDED_KEY)
          this.loadCities()
          this.showToast('已恢复默认', 'success')
        }
      }
    })
  },

  refresh() {
    this.loadCities()
    this.showToast('正在刷新...', 'info')
  },

  /* ========== Toast ========== */
  showToast(msg, type = 'info') {
    if (this.data.toastTimer) clearTimeout(this.data.toastTimer)
    this.setData({ toast: { msg, type } })
    this.data.toastTimer = setTimeout(() => {
      this.setData({ toast: null })
    }, 2400)
  }
})
