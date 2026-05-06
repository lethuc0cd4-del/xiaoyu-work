from html.parser import HTMLParser
from pathlib import Path


class LinkAndAssetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.assets = []
        self.links = []
        self.has_title = False
        self.has_description = False

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == "title":
            self.has_title = True
        if tag == "meta" and data.get("name") == "description" and data.get("content"):
            self.has_description = True
        if tag == "link" and data.get("href") and not data["href"].startswith("http"):
            self.assets.append(data["href"])
        if tag == "script" and data.get("src"):
            self.assets.append(data["src"])
        if tag == "a" and data.get("href"):
            self.links.append(data["href"])


root = Path(__file__).resolve().parents[1]
html_path = root / "index.html"
parser = LinkAndAssetParser()
parser.feed(html_path.read_text(encoding="utf-8"))

missing = [asset for asset in parser.assets if not (root / asset).exists()]
if missing:
    raise SystemExit(f"Missing referenced assets: {missing}")
if not parser.has_title or not parser.has_description:
    raise SystemExit("index.html must include a title and meta description")

required_sections = {"#solutions", "#platform", "#about", "#contact"}
missing_sections = [section for section in required_sections if f'id="{section[1:]}"' not in html_path.read_text(encoding="utf-8")]
if missing_sections:
    raise SystemExit(f"Missing sections: {missing_sections}")

print("HTML structure and local asset references look good.")
