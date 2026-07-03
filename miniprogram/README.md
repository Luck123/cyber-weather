# 赛博天气 · 微信小程序版本

> 赛博朋克风格 + 农历黄历的天气应用，基于 Open-Meteo 免费 API

## 📁 项目结构

```
miniprogram/
├── app.js              # 小程序入口
├── app.json            # 全局配置
├── app.wxss            # 全局样式 (在 pages/index/index.wxss)
├── sitemap.json        # 搜索配置
├── pages/
│   └── index/
│       ├── index.js    # 页面逻辑
│       ├── index.wxml  # 页面结构
│       ├── index.wxss  # 页面样式
│       └── index.json  # 页面配置
├── components/         # 预留扩展 (当前用单页面)
├── utils/
│   ├── cities.js       # 城市数据库 (382 个)
│   ├── lunar.js        # 农历/干支/节气/宜忌算法
│   └── weather.js      # 天气 API + WMO 天气码
└── images/             # 图标资源
```

## ✨ 功能特性

| 模块 | 实现 |
|---|---|
| **赛博朋克 UI** | 霓虹双色 (青 #00f0ff + 品红 #ff00aa) + 动态光晕 + 扫描线 + 透视网格 |
| **iOS UI 切换** | 右下角浮动按钮实时切换，毛玻璃 / 圆角 / 浅色 |
| **6 城市卡片** | 温度/体感/湿度/风速/AQI/UV/降水概率，带渐入动画 |
| **8 城上限** | 达到上限时显示 "已满"，可移除后再添加 |
| **城市搜索** | 中文/英文/国家/ID/别名 模糊匹配，下拉式结果 |
| **乐观更新** | 添加城市立即显示骨架，50ms 内可见 |
| **点击详情** | 弹出模态框：温度/HUD/基础信息/7日预报/移除 |
| **农历黄历** | 干支纪年/生肖/农历月日/24节气/距下个节气/宜忌/五行/冲煞/12 生肖运势 |
| **本地持久化** | 城市顺序 + 用户添加的城市 (wx.setStorageSync) |
| **响应式** | 768rpx 以下单列布局 |

## 🚀 使用方法

### 1. 导入项目

1. 下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 打开工具 → **导入项目** → 选择 `miniprogram/` 目录
3. AppID 选 **测试号** 即可，无需注册
4. 项目名称任意（如 `cyber-weather`）

### 2. 编译运行

- 点击工具栏 **编译** 按钮
- 模拟器中会显示完整的赛博天气界面
- 真机预览：点击 **预览** 扫码即可在手机上体验

### 3. 配置 (可选)

- `project.config.json` (项目根目录添加)：
  ```json
  {
    "miniprogramRoot": "miniprogram/",
    "appid": "your-appid-here"
  }
  ```

## 📊 数据源

- **天气**: [Open-Meteo](https://open-meteo.com/) 免费 API，无需 Key
- **农历**: 自实现算法 (1900-2100 年)
- **城市**: 手工整理 382 个城市 (中国 305 + 全球 77)

## 🔧 关键 API

| API | 用途 |
|---|---|
| `wx.request` | 调 Open-Meteo |
| `wx.getStorageSync / setStorageSync` | 持久化城市顺序 |
| `wx.showModal` | 确认移除/重置 |
| `new Date()` | 实时时钟 + 黄历基准 |

## 📝 注意事项

1. **必须** 在小程序后台添加 `api.open-meteo.com` 到 **request 合法域名**（开发期可在开发者工具勾选 "不校验合法域名"）
2. 农历算法采用 LUNAR_INFO 表，覆盖 1900-2100 年
3. 单页面架构，所有功能集中在 `pages/index/`
4. CSS 变量 + `theme-ios` 类实现主题切换
5. 部分 CSS 属性（如 `backdrop-filter`）需要基础库 2.10.0+，建议使用最新版本

## 🌐 与 H5 版本对比

| 特性 | H5 (`cyber-weather.html`) | 小程序 (`miniprogram/`) |
|---|---|---|
| 文件结构 | 单文件 180KB | 标准 4 件套结构 |
| 城市数 | 382 | 382 (一致) |
| 农历算法 | 优化版 (本次重写修复) | 重写修复后 |
| 拖拽排序 | ✅ HTML5 DnD | ❌ (小程序不支持) |
| Canvas 折线图 | ✅ | ❌ (本次未做) |
| 主题切换 | ✅ | ✅ |
| 添加城市 | 50ms | 50ms |
| 模态框 | ✅ | ✅ |
| 模态框动画 | 复杂 | 简化 |

## 📜 协议

MIT
