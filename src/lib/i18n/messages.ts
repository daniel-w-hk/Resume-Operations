export interface LocaleMessages {
  common: {
    all: string;
    copyToClipboard: string;
  };
  navigation: {
    openMainMenu: string;
  };
  theme: {
    system: string;
    light: string;
    dark: string;
    currentTheme: string;
    cycleTheme: string;
  };
  profile: {
    email: string;
    location: string;
    workAddress: string;
    click: string;
    googleMap: string;
    send: string;
    sendEmail: string;
    researchInterests: string;
    like: string;
    liked: string;
    thanks: string;
    coreCompetencies: string;
    viewResume: string;
    contact: string;
  };
  home: {
    about: string;
    news: string;
    selectedPublications: string;
    viewAll: string;
  };
  publications: {
    searchPlaceholder: string;
    filters: string;
    year: string;
    type: string;
    noResults: string;
    abstract: string;
    bibtex: string;
    code: string;
  };
  footer: {
    lastUpdated: string;
    builtWithPrism: string;
    evidenceAvailable: string;
  };
  resume: {
    printOrSave: string;
  };
}

const en: LocaleMessages = {
  common: {
    all: 'All',
    copyToClipboard: 'Copy to clipboard',
  },
  navigation: {
    openMainMenu: 'Open main menu',
  },
  theme: {
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    currentTheme: 'Current theme',
    cycleTheme: 'Click to cycle theme',
  },
  profile: {
    email: 'Email',
    location: 'Location',
    workAddress: 'Work Address',
    click: 'Click',
    googleMap: 'Google Map',
    send: 'Send',
    sendEmail: 'Send Email',
    researchInterests: 'Research Interests',
    like: 'Like',
    liked: 'Liked',
    thanks: 'Thanks!',
    coreCompetencies: 'Core capabilities',
    viewResume: 'View résumé',
    contact: 'Contact',
  },
  home: {
    about: 'About',
    news: 'News',
    selectedPublications: 'Selected Publications',
    viewAll: 'View All',
  },
  publications: {
    searchPlaceholder: 'Search publications...',
    filters: 'Filters',
    year: 'Year',
    type: 'Type',
    noResults: 'No publications found matching your criteria.',
    abstract: 'Abstract',
    bibtex: 'BibTeX',
    code: 'Code',
  },
  footer: {
    lastUpdated: 'Last updated',
    builtWithPrism: 'Built with PRISM',
    evidenceAvailable: 'Supporting documents are available on request.',
  },
  resume: {
    printOrSave: 'Download PDF résumé',
  },
};

const zh: LocaleMessages = {
  common: {
    all: '全部',
    copyToClipboard: '複製到剪貼簿',
  },
  navigation: {
    openMainMenu: '開啟主選單',
  },
  theme: {
    system: '跟隨系統',
    light: '淺色',
    dark: '深色',
    currentTheme: '目前主題',
    cycleTheme: '點擊切換主題',
  },
  profile: {
    email: '電郵',
    location: '地點',
    workAddress: '地址',
    click: '點擊',
    googleMap: 'Google 地圖',
    send: '傳送',
    sendEmail: '傳送電郵',
    researchInterests: '研究興趣',
    like: '讚好',
    liked: '已讚好',
    thanks: '感謝支持！',
    coreCompetencies: '核心能力',
    viewResume: '查看履歷',
    contact: '聯絡我',
  },
  home: {
    about: '個人簡介',
    news: '近況',
    selectedPublications: '精選項目',
    viewAll: '查看全部',
  },
  publications: {
    searchPlaceholder: '搜尋...',
    filters: '篩選',
    year: '年份',
    type: '類型',
    noResults: '沒有找到符合條件的內容。',
    abstract: '摘要',
    bibtex: 'BibTeX',
    code: '程式碼',
  },
  footer: {
    lastUpdated: '最近更新',
    builtWithPrism: '以 PRISM 建立',
    evidenceAvailable: '相關證明文件可按需要提供。',
  },
  resume: {
    printOrSave: '下載 PDF 履歷',
  },
};

export const messages: Record<string, LocaleMessages> = {
  en,
  zh,
  'zh-cn': {
    common: { all: '全部', copyToClipboard: '复制到剪贴板' },
    navigation: { openMainMenu: '打开菜单' },
    theme: { system: '跟随系统', light: '浅色', dark: '深色', currentTheme: '当前主题', cycleTheme: '点击切换主题' },
    profile: {
      email: '邮箱', location: '地点', workAddress: '地址', click: '点击', googleMap: 'Google 地图',
      send: '发送', sendEmail: '发送邮件', researchInterests: '研究兴趣', like: '赞', liked: '已点赞',
      thanks: '感谢支持！', coreCompetencies: '核心能力', viewResume: '查看简历', contact: '联系我',
    },
    home: { about: '个人简介', news: '近况', selectedPublications: '精选项目', viewAll: '查看全部' },
    publications: {
      searchPlaceholder: '搜索...', filters: '筛选', year: '年份', type: '类型',
      noResults: '没有找到符合条件的内容。', abstract: '摘要', bibtex: 'BibTeX', code: '代码',
    },
    footer: { lastUpdated: '最近更新', builtWithPrism: '基于 PRISM 构建', evidenceAvailable: '可按需提供相关证明材料。' },
    resume: { printOrSave: '下载 PDF 简历' },
  },
};

export function getMessages(locale: string): LocaleMessages {
  return messages[locale] || en;
}
