# 赛博天气 / Cyber Weather

> 赛博朋克 + iOS 双风格天气应用，集成农历黄历、3D 城市搜索、模态框详情、拖拽排序与主题切换
> 体验链接：https://luck123.github.io/cyber-weather/

一个零依赖的单文件 HTML 应用（`cyber-weather.html`），通过浏览器 Geolocation + Open-Meteo 免费 API 实时获取数据。

## ✨ 核心功能

| 模块 | 特性 |
|---|---|
| **城市卡片** | 6 城市默认 / 最多 8 张 / 拖拽排序 / 悬停光效 / 7 日 sparkline + 湿度环形 |
| **城市搜索** | 382 城数据库（中 305 + 全球 77），支持中英文 / 别名（NYC / SF / 沪） |
| **详情模态框** | 点击卡片展开，含 6 项基础信息 + 7 日预报 + 移除按钮 |
| **农历黄历** | 纯 JS 农历算法（1900-2100），干支纪年 / 节气 / 宜忌 / 12 生肖运势 |
| **主题切换** | 赛博朋克 ↔ iOS UI 实时切换，偏好持久化到 localStorage |
| **数据可视化** | HUD 风格 4 指标网格（湿度/风速/AQI/UV） |

## 🖼️ 截图

启动后默认展示国内 6 城（北京/上海/广州/深圳/成都/杭州），点击右下角圆形按钮在两种风格间切换。

## 🚀 快速使用

### 方式 1：直接打开
```bash
# 双击打开 cyber-weather.html 即可
```

### 方式 2：本地服务器
```bash
cd 项目目录
python -m http.server 8088
# 浏览器访问 http://localhost:8088/cyber-weather.html
```

## 🎨 风格对比

### 赛博朋克（默认）
- 霓虹色（青 #00f0ff + 品红 #ff00aa）
- 切角边框 / 扫描线 / 透视网格
- HUD 字体（Orbitron）
- 浮动光晕动画

### iOS UI
- SF Pro 系统字体 / 圆角 16px
- 0.5px 细边 / 0.04 阴影
- 蓝紫渐变（#007AFF + #5856D6）
- backdrop-filter 毛玻璃

## 🗂️ 项目结构

```
2026-07-02-16-46-41/
├── cyber-weather.html      # 主文件 (单文件, 180KB, 零外部依赖)
├── weather-dashboard.html  # 早期版本 (磨砂玻璃风格)
├── README.md               # 本文件
└── .gitignore
```

## 🛠️ 技术栈

- **HTML / CSS / JavaScript** - 纯原生，无任何外部库
- **Open-Meteo API** - 免费天气数据（无需 API Key）
- **CSS** - backdrop-filter / clip-path / CSS Grid / 自定义属性
- **Canvas** - 折线图（位于 `weather-dashboard.html`）
- **LocalStorage** - 用户偏好 + 城市顺序持久化

## 🌐 浏览器兼容

- Chrome 90+ / Edge 90+
- Firefox 88+
- Safari 14+（部分 `backdrop-filter` 需 `-webkit-` 前缀）

## 📊 数据来源

- 天气数据：[Open-Meteo](https://open-meteo.com/) - 免费、无需 Key
- 城市坐标：内置静态数据库，382 城经纬度
- 农历算法：纯 JS 实现（基于农历 1900-2100 年编码表）

## 🔒 隐私

- 位置数据：仅用于自动定位最近城市，不上传服务器
- localStorage：仅存储城市顺序和主题偏好
- 天气 API：每次请求仅含城市经纬度

## 📝 License

MIT
