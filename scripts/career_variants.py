"""Prepare three career websites and language-specific XeLaTeX CVs.

Use the same master content for each copy; change only the positioning and URLs.
Dependency for translation: pip install opencc-python-reimplemented.
"""

import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tmp/translation-tools"))
from opencc import OpenCC

CONVERTER = OpenCC("t2s")
TRACKS = {
    "general": ("Resume", "Supply Chain · Operations · Business Analytics", "供應鏈 · 營運 · 商業分析", "供应链 · 运营 · 商业分析"),
    "supply-chain": ("Resume-Supply-Chain", "Supply Chain", "供應鏈", "供应链"),
    "operations": ("Resume-Operations", "Operations", "營運", "运营"),
    "business-analytics": ("Resume-Business-Analytics", "Business Analytics", "商業分析", "商业分析"),
}


def simplified(text):
    text = CONVERTER.convert(text)
    # Translate usage as well as characters for readers in mainland China.
    terms = {
        "营运": "运营", "履历": "简历", "电邮": "邮箱", "联络": "联系",
        "活页簿": "工作簿", "工作类型": "工作类型", "薪酬": "薪资",
        "枢纽分析表": "数据透视表", "动态阵列": "动态数组", "资料验证": "数据验证",
        "数据清理": "数据清洗", "仪表板": "仪表盘", "数码": "数字",
        "软件": "软件", "程式码": "代码", "程式": "程序", "演算法": "算法",
        "学士课程": "本科", "理学硕士生": "理学硕士研究生", "学士": "学士",
        "准则": "标准", "情境": "场景", "情景": "场景", "入学": "入学",
        "服务逾": "服务超过", "逾": "超过", "长者": "老年人", "残障人士": "残疾人",
        "招新": "招新", "实作": "实践", "进修": "学习", "资料表": "数据表",
        "资讯系统": "信息系统", "近期": "近期", "网页": "网页",
        "建构": "构建", "交付": "交付", "选单": "菜单", "剪贴簿": "剪贴板",
        "地点": "地点", "主題": "主题", "技能与学习": "技能与学习",
        "结构化解难": "结构化解决问题", "支援": "支持", "外展": "联络",
        "资讯": "信息", "筹办": "组织", "人手重配": "人员重新配置",
        "透过": "通过", "视觉化": "可视化", "起讫点": "起终点",
        "最佳回应": "最优响应", "连结": "连接", "实务训练": "实践训练",
        "互动": "交互", "亦曾": "也曾", "亦学习": "还学习",
        "我现于": "我目前在", "修读": "攻读",
    }
    for old, new in terms.items():
        text = text.replace(old, new)
    return text


def prepare():
    destination = ROOT / "content_zh-cn"
    destination.mkdir(exist_ok=True)
    for source in (ROOT / "content_zh").iterdir():
        if source.suffix in {".toml", ".md", ".bib"}:
            translated = simplified(source.read_text())
            if source.name == "cv.toml":
                translated = translated.replace("Mingkang-Wang-CV-zh.pdf", "Mingkang-Wang-CV-zh-cn.pdf")
            (destination / source.name).write_text(translated)
    downloads = ROOT / "public/downloads"
    downloads.mkdir(exist_ok=True)
    shutil.copy2("/Users/wmk/Desktop/1_EXCEL.xlsx", downloads / "Excel-Salary-Analysis.xlsx")


def focus_content(text, track, locale):
    if track == "general":
        return text
    repository, english, traditional, simple = TRACKS[track]
    if locale == "en":
        text = text.replace("Supply Chain, Operations & Analytics", english)
        text = text.replace("Supply Chain · Operations · Analytics", english)
        text = text.replace("supply chain, operations and analytics.", english.lower() + ".")
        text = text.replace("supply chain, operations and business analytics in Hong Kong", english.lower() + " in Hong Kong")
        text = text.replace("supply chain, operations or business analytics", english.lower())
        text = text.replace("# Supply chain, systems and operations.", f"# {english} with a systems perspective.")
    elif locale == "zh":
        text = text.replace("供應鏈、營運與分析", traditional)
        text = text.replace("供應鏈 · 營運 · 數據分析", traditional)
        text = text.replace("聚焦供應鏈、營運與數據分析", "聚焦" + traditional)
        text = text.replace("供應鏈、商業分析及營運**相關職業", traditional + "**相關職業")
        text = text.replace("現尋求香港供應鏈、營運或商業分析職位", "現尋求香港" + traditional + "職位")
        text = text.replace("六門與供應鏈、營運及數據分析相關的高分課程。", "精選高分課程及應用實作。")
    else:
        text = text.replace("供应链、运营与分析", simple)
        text = text.replace("供应链 · 运营 · 数据分析", simple)
        text = text.replace("聚焦供应链、运营与数据分析", "聚焦" + simple)
        text = text.replace("供应链、商业分析及运营**相关职业", simple + "**相关职业")
        text = text.replace("现寻求香港供应链、运营或商业分析职位", "现寻求香港" + simple + "职位")
        text = text.replace("六门与供应链、运营及数据分析相关的高分课程。", "精选高分课程及应用实践。")
    text = text.replace("/Resume/", f"/{repository}/")
    return text


def build_pdfs():
    source = (ROOT / "resume/Mingkang-Wang-CV.tex").read_text()
    preamble, body = source.split(r"\begin{document}", 1)
    body = body.rsplit(r"\end{document}", 1)[0]
    english, chinese = body.split(r"\newpage", 1)
    bodies = {"en": english, "zh": chinese, "zh-cn": simplified(chinese)}
    tasks = []
    for track, (repository, en, zh, cn) in TRACKS.items():
        for locale, original in bodies.items():
            content = original
            if track != "general":
                if locale == "en":
                    content = content.replace("Supply Chain | Operations | Analytics", en)
                    content = content.replace("supply chain, operations or business analytics", en.lower())
                elif locale == "zh":
                    content = content.replace("供應鏈｜營運｜數據分析", zh)
                    content = content.replace("香港供應鏈、營運或商業分析職位", "香港" + zh + "職位")
                else:
                    content = content.replace("供应链｜运营｜数据分析", cn)
                    content = content.replace("香港供应链、运营或商业分析职位", "香港" + cn + "职位")
            # The full address remains visible and clickable in every single-page CV.
            content = content.replace("daniel-w-hk.github.io/Resume", f"daniel-w-hk.github.io/{repository}")
            content = re.sub(
                r"(Hong Kong|香港)( \\quad \| \\quad \\href\{https://daniel-w-hk\.github\.io/[^\n]+)",
                lambda m: r"{\fontsize{7.4}{9}\selectfont " + m.group(0) + "}", content,
            )
            if locale == "en":
                content = content.replace(r"\skillrow{Languages}", r"\skillrow{Excel}{XLOOKUP, dynamic arrays, conditional statistics and interactive charts}" + "\n" + r"\skillrow{Languages}")
            elif locale == "zh":
                content = content.replace(r"\skillrow{語言}", r"\skillrow{Excel}{XLOOKUP、動態陣列、條件統計及互動圖表}" + "\n" + r"\skillrow{語言}")
            else:
                content = content.replace(r"\skillrow{语言}", r"\skillrow{Excel}{XLOOKUP、动态数组、条件统计及交互图表}" + "\n" + r"\skillrow{语言}")
            header = preamble.replace("Heiti TC", "Heiti SC") if locale == "zh-cn" else preamble
            header = header.replace("pdfsubject={Supply Chain, Operations and Analytics}", "pdfsubject={" + (en if track != "general" else "Supply Chain, Operations and Analytics") + "}")
            filename = f"Mingkang-Wang-CV-{locale}"
            source_dir = ROOT / "resume/generated" / track
            source_dir.mkdir(parents=True, exist_ok=True)
            tex = source_dir / (filename + ".tex")
            tex.write_text(header + r"\begin{document}" + content + r"\end{document}" + "\n")
            build = ROOT / "tmp/pdfs/career-variants" / track / locale
            build.mkdir(parents=True, exist_ok=True)
            tasks.append((track, locale, tex, build))

    def compile_one(task):
        track, locale, tex, build = task
        command = ["/Library/TeX/texbin/xelatex", "-interaction=nonstopmode", "-halt-on-error", f"-output-directory={build}", str(tex)]
        for _ in range(2):
            result = subprocess.run(command, cwd=ROOT, capture_output=True, text=True)
            if result.returncode:
                raise RuntimeError(result.stdout[-4000:])
        from pypdf import PdfReader
        pdf = build / (tex.stem + ".pdf")
        reader = PdfReader(pdf)
        if len(reader.pages) != 1:
            raise RuntimeError(f"{track}/{locale}: expected 1 page, got {len(reader.pages)}")
        text = reader.pages[0].extract_text() or ""
        if TRACKS[track][0] not in text:
            raise RuntimeError(f"Missing website address: {track}/{locale}")
        for parent in [ROOT / "output/pdf" / track, ROOT / "public/downloads" / track]:
            parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(pdf, parent / pdf.name)
        print(f"{track}/{locale}: one-page CV compiled", flush=True)
    with ThreadPoolExecutor(max_workers=3) as executor:
        list(executor.map(compile_one, tasks))
    with zipfile.ZipFile(ROOT / "output/pdf/Career-CVs.zip", "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for track in TRACKS:
            if track != "general":
                for pdf in (ROOT / "output/pdf" / track).glob("*.pdf"):
                    archive.write(pdf, f"{track}/{pdf.name}")


def snapshots():
    files = subprocess.check_output(["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"], cwd=ROOT).decode().split("\0")
    for track, (repository, *_labels) in TRACKS.items():
        if track == "general":
            continue
        target = ROOT / "variants" / repository
        if not target.exists():
            subprocess.run(["git", "clone", "--no-hardlinks", str(ROOT), str(target)], check=True)
        for name in set(files):
            if not name or name.startswith(("output/", "tmp/", "variants/")):
                continue
            path = ROOT / name
            if not path.is_file():
                continue
            destination = target / name
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, destination)
        (target / "site-variant.json").write_text(json.dumps({"track": track, "repository": repository}, indent=2) + "\n")
        for locale, directory in [("en", "content"), ("zh", "content_zh"), ("zh-cn", "content_zh-cn")]:
            for path in (target / directory).iterdir():
                if path.suffix in {".md", ".toml"}:
                    text = focus_content(path.read_text(), track, locale)
                    if path.name == "cv.toml":
                        text = text.replace("/downloads/general/", f"/downloads/{track}/")
                    path.write_text(text)
        print(f"Prepared {target}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--prepare", action="store_true")
    parser.add_argument("--pdf", action="store_true")
    parser.add_argument("--snapshots", action="store_true")
    args = parser.parse_args()
    if args.prepare:
        prepare()
    if args.pdf:
        build_pdfs()
    if args.snapshots:
        snapshots()
