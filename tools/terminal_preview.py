from pathlib import Path

root = Path(__file__).resolve().parents[1]
preview = """╭──────────────── 鹜洲智能医护官网 · 终端预览 ────────────────╮
│ npm run start                                                │
│   → Serving HTTP on 0.0.0.0 port 4173                        │
│                                                              │
│ Google Chrome / Chromium                                     │
│   → http://127.0.0.1:4173/index.html                         │
│                                                              │
│ 页面首屏                                                     │
│   鹜洲智能医护 · Wuzhou Intelligent Care                     │
│   让医护服务进入「智能协同」时代                             │
│   [探索方案] [了解鹜洲]                                      │
│                                                              │
│ 核心板块                                                     │
│   01 智慧病区协同        02 AI 医护数据平台                  │
│   03 远程健康管理        04 医护后勤一体化                   │
│                                                              │
│ 预览产物                                                     │
│   previews/google-home.png                                   │
╰──────────────────────────────────────────────────────────────╯
"""
output = root / "previews" / "terminal-preview.txt"
output.parent.mkdir(exist_ok=True)
output.write_text(preview, encoding="utf-8")
print(preview)
print(f"Saved terminal preview to {output.relative_to(root)}")
