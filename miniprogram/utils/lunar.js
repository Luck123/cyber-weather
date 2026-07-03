// utils/lunar.js
// 农历/干支/节气/宜忌/生肖算法 (1900-2100)

const LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x055c0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06b20,0x1a6c4,0x0aae0,
  0x0a2e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a2d0,0x0d150,0x0f252,
  0x0d520
];

const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const ZODIAC = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const LUNAR_MONTH = ['正','二','三','四','五','六','七','八','九','十','冬','腊'];
const LUNAR_DAY = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'
];
const SOLAR_TERMS = [
  { n: '小寒', m: 1, d: 5 }, { n: '大寒', m: 1, d: 20 },
  { n: '立春', m: 2, d: 4 }, { n: '雨水', m: 2, d: 19 },
  { n: '惊蛰', m: 3, d: 5 }, { n: '春分', m: 3, d: 20 },
  { n: '清明', m: 4, d: 4 }, { n: '谷雨', m: 4, d: 19 },
  { n: '立夏', m: 5, d: 5 }, { n: '小满', m: 5, d: 20 },
  { n: '芒种', m: 6, d: 5 }, { n: '夏至', m: 6, d: 21 },
  { n: '小暑', m: 7, d: 7 }, { n: '大暑', m: 7, d: 22 },
  { n: '立秋', m: 8, d: 7 }, { n: '处暑', m: 8, d: 23 },
  { n: '白露', m: 9, d: 7 }, { n: '秋分', m: 9, d: 22 },
  { n: '寒露', m: 10, d: 8 }, { n: '霜降', m: 10, d: 23 },
  { n: '立冬', m: 11, d: 7 }, { n: '小雪', m: 11, d: 22 },
  { n: '大雪', m: 12, d: 7 }, { n: '冬至', m: 12, d: 21 }
];
const WUXING = ['金','木','水','火','土'];
const YI_POOL = ['祭祀','出行','动土','上梁','嫁娶','入宅','修造','安门','开市','交易','纳财','理发','沐浴','扫舍','教牛马','习艺','求医','治病','破屋','坏垣','分居','入殓','移柩','启攒','安葬','立碑','造庙','祈福','斋醮','酬神'];
const JI_POOL = ['嫁娶','开市','安葬','动土','破土','入宅','移徙','出火','理发','作灶','造船','掘井','栽种','牧养','祈福','求嗣','上梁','筑堤','放水','开仓','出货','纳采','问名','订盟','纳婿'];

function lunarYearDays(y) {
  let sum = 348;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    if ((LUNAR_INFO[y - 1900] & i) !== 0) sum++;
  }
  return sum + leapDays(y);
}
function leapMonth(y) { return LUNAR_INFO[y - 1900] & 0xf; }
function leapDays(y) {
  if (leapMonth(y)) return (LUNAR_INFO[y - 1900] & 0x10000) ? 30 : 29;
  return 0;
}
function monthDays(y, m) {
  return (LUNAR_INFO[y - 1900] & (0x10000 >> m)) ? 30 : 29;
}

function solarToLunar(date) {
  const baseDate = new Date(1900, 0, 31);
  const offset = Math.floor((date - baseDate) / 86400000);
  // 找到农历年
  let year = 1900, temp = 0;
  for (; year < 2050 && temp + lunarYearDays(year) <= offset; year++) {
    temp += lunarYearDays(year);
  }
  const leap = leapMonth(year);
  let isLeap = false;
  // 找到农历月
  let month = 1;
  for (let m = 1; m < 13; m++) {
    let days;
    if (leap > 0 && m === leap + 1 && !isLeap) {
      // 闰月
      days = leapDays(year);
      isLeap = true;
      m--; // 保持 m 位置不变, 下次循环还是同一个 m
    } else {
      days = monthDays(year, m);
    }
    if (temp + days > offset) {
      // 找到了
      month = m + (isLeap && m === leap ? 0 : 0);
      break;
    }
    temp += days;
    if (isLeap && m === leap) isLeap = false;
    month = m + 1;
  }
  const day = offset - temp + 1;
  return { year, month, day, isLeap };
}

function getGanzhiYear(lunarYear) {
  const stemIdx = (lunarYear - 1900 + 6) % 10;
  const branchIdx = (lunarYear - 1900) % 12;
  return HEAVENLY_STEMS[stemIdx] + EARTHLY_BRANCHES[branchIdx];
}
function getZodiac(lunarYear) {
  return ZODIAC[(lunarYear - 1900) % 12];
}

function getCurrentSolarTerm(date) {
  const m = date.getMonth() + 1, d = date.getDate();
  const year = date.getFullYear();
  const allTerms = [];
  for (let i = 0; i < SOLAR_TERMS.length; i++) {
    allTerms.push({ ...SOLAR_TERMS[i], date: new Date(year, SOLAR_TERMS[i].m - 1, SOLAR_TERMS[i].d) });
  }
  allTerms.unshift({ ...SOLAR_TERMS[23], date: new Date(year - 1, 11, 21) });

  // 精确匹配
  for (let i = 0; i < allTerms.length; i++) {
    if (allTerms[i].m === m && allTerms[i].d === d) {
      const nextIdx = (i + 1) % allTerms.length;
      const next = allTerms[nextIdx];
      const nextYearDate = nextIdx === 0 ? new Date(year + 1, next.m - 1, next.d) : next.date;
      return { term: allTerms[i], next: { ...next, date: nextYearDate }, daysSince: 0, daysToNext: Math.ceil((nextYearDate - date) / 86400000), isExact: true };
    }
  }
  for (let i = 0; i < allTerms.length - 1; i++) {
    if (allTerms[i].date <= date && allTerms[i + 1].date > date) {
      const daysToNext = Math.ceil((allTerms[i + 1].date - date) / 86400000);
      const daysSince = Math.floor((date - allTerms[i].date) / 86400000);
      return { term: allTerms[i], next: allTerms[i + 1], daysSince, daysToNext };
    }
  }
  return { term: allTerms[0] };
}

function seededPick(arr, seed, n) {
  const result = [];
  const used = new Set();
  let s = seed;
  while (result.length < n && used.size < arr.length) {
    s = (s * 9301 + 49297) % 233280;
    const idx = Math.floor((s / 233280) * arr.length);
    if (!used.has(idx)) { used.add(idx); result.push(arr[idx]); }
  }
  return result;
}
function daySeed(date) {
  return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
}
function getYiJi(date) {
  const seed = daySeed(date);
  return {
    yi: seededPick(YI_POOL, seed, 6),
    ji: seededPick(JI_POOL, seed + 999, 5)
  };
}
function getWuxing(date) {
  return WUXING[daySeed(date) % 5];
}
function getChongsha(date) {
  const branches = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const dayBranchIdx = (Math.floor((date - new Date(1900, 0, 31)) / 86400000) - 11 + 1200) % 12;
  const oppositeIdx = (dayBranchIdx + 6) % 12;
  const oppositeZodiac = ZODIAC[oppositeIdx];
  const shaDirs = ['北','南','东','西','中','北','南','东','西','中','北','南'];
  return { chong: `冲${oppositeZodiac}`, sha: `煞${shaDirs[dayBranchIdx]}` };
}
function getShengxiaoFortune(date) {
  const seed = daySeed(date);
  const fortunes = ['大吉','吉','中','小吉','凶'];
  return ZODIAC.map((name, i) => ({
    name,
    fortune: fortunes[Math.floor(((seed * (i + 1) * 9301 + 49297) % 233280) / 233280 * fortunes.length)]
  }));
}

function getAlmanac(date = new Date()) {
  const lunar = solarToLunar(date);
  const ganzhi = getGanzhiYear(lunar.year);
  const zodiac = getZodiac(lunar.year);
  const term = getCurrentSolarTerm(date);
  const yiji = getYiJi(date);
  const wuxing = getWuxing(date);
  const chongsha = getChongsha(date);
  const shengxiao = getShengxiaoFortune(date);
  const monthName = (lunar.isLeap ? '闰' : '') + LUNAR_MONTH[lunar.month - 1] + '月';
  const dayName = LUNAR_DAY[lunar.day - 1];
  return {
    ganzhi,
    zodiac,
    monthName,
    dayName,
    lunarMonth: lunar.month,
    lunarDay: lunar.day,
    termName: term.term.n,
    daysToNext: term.daysToNext || 0,
    yi: yiji.yi,
    ji: yiji.ji,
    wuxing,
    chong: chongsha.chong,
    sha: chongsha.sha,
    shengxiao
  };
}

module.exports = {
  solarToLunar,
  getGanzhiYear,
  getZodiac,
  getCurrentSolarTerm,
  getYiJi,
  getWuxing,
  getChongsha,
  getShengxiaoFortune,
  getAlmanac
}
