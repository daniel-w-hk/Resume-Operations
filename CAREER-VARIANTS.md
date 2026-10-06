# 求职版本

三个版本保留原项目结构，只改变求职定位、仓库路径和 CV 下载链接。

| 方向 | 仓库 | 网站 |
| --- | --- | --- |
| 供应链 | Resume-Supply-Chain | https://daniel-w-hk.github.io/Resume-Supply-Chain/ |
| 运营 | Resume-Operations | https://daniel-w-hk.github.io/Resume-Operations/ |
| 商业分析 | Resume-Business-Analytics | https://daniel-w-hk.github.io/Resume-Business-Analytics/ |

每个项目的 `site-variant.json` 指定方向和仓库名称，Next.js 自动使用对应的部署路径。

## 内容与下载

- 英文：`content/`
- 繁体：`content_zh/`
- 简体：`content_zh-cn/`
- 首次打开默认英文，用户切换后记住选择。
- 各语言的 `cv.toml` 指向相应方向的单页 CV。
- Excel 练习项目在 `public/downloads/Excel-Salary-Analysis.xlsx`。
- XeLaTeX 源码在 `resume/generated/<方向>/`。
- 三方向共九份 CV 的本地合集在 `output/pdf/Career-CVs.zip`。

## 本地预览

原项目目录运行 `npm run dev` 后打开 http://localhost:3000/Resume/。
在其他版本目录运行同一命令，端口不变，网址末尾改为对应仓库名。
开发服务和生产构建分别使用 `.next-dev/` 与 `.next/`，避免互相覆盖缓存。

## 日常更新

在对应项目中修改、提交并推送到 `main`，GitHub Pages 会自动更新。
部署使用固定的 Ubuntu 24.04、Node.js 24，以及已迁移到 Node.js 24 的 GitHub Actions。

批量生成脚本为 `scripts/career_variants.py`；繁简转换依赖 `opencc-python-reimplemented`，
编译依赖 XeLaTeX、Helvetica Neue 以及 Heiti TC / Heiti SC 字体。
`--prepare` 转换简体材料并复制用户提供的 Excel 文件，`--pdf` 生成单页 PDF，
`--snapshots` 从原项目生成三个本地副本。独立版本开始单独修改后，直接维护其内容，
不要再次批量覆盖副本。
