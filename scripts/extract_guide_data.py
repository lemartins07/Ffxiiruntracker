"""Extract guide data from the FFXII walkthrough PDF and emit a typed dataset.

Usage:
    python scripts/extract_guide_data.py \
        --pdf "Final Fantasy XII - Guide and Walkthrough - PlayStation 2 - By Red_Scarlet - GameFAQs.pdf" \
        --output src/data/guideBlocks.ts

The script depends on ``PyPDF2`` which can be installed with ``pip install PyPDF2``.
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple

from PyPDF2 import PdfReader

PDF_FOOTER_PATTERN = re.compile(r"\d{2}/\d{2}/\d{4}, \d{2}:?\d{0,2}")
FILE_URI_PATTERN = re.compile(r"file:///[^\n]+")
NON_ASCII_SPACES = re.compile(r"\s+")
BILINGUAL_PATTERN = re.compile(r"([^(),]+?)\s*\(([^)]+)\)")
BLOCK_PATTERN = re.compile(r"\n\| (wt\d{2}[a-z]) \|")


@dataclass
class BilingualText:
    jp: Optional[str]
    en: Optional[str]

    def as_dict(self) -> Dict[str, Optional[str]]:
        return {"jp": self.jp, "en": self.en}

    def tokens(self) -> Iterable[str]:
        for value in (self.jp, self.en):
            if not value:
                continue
            yield value
            for token in re.split(r"[\s,]+", value):
                if token:
                    yield token


@dataclass
class GuideBlock:
    search_code: str
    content_type: str
    name: BilingualText
    area: Optional[BilingualText]
    raw_text: str
    tokens: List[str]

    def to_dict(self) -> Dict[str, object]:
        return {
            "searchCode": self.search_code,
            "contentType": self.content_type,
            "name": self.name.as_dict(),
            "area": self.area.as_dict() if self.area else None,
            "rawText": self.raw_text,
            "tokens": self.tokens,
        }


def normalize_whitespace(value: str) -> str:
    return NON_ASCII_SPACES.sub(" ", value).strip()


def normalize_japanese(value: str) -> str:
    if re.search(r"[\u3040-\u30ff\u4e00-\u9fff]", value):
        return value.replace(" ", "")
    return value


def parse_bilingual(text: str) -> BilingualText:
    text = text.strip()
    if not text:
        return BilingualText(None, None)

    matches = BILINGUAL_PATTERN.findall(text)
    if matches:
        jp_values: List[str] = []
        en_values: List[str] = []
        for jp_raw, en_raw in matches:
            jp_clean = normalize_japanese(normalize_whitespace(jp_raw))
            en_clean = normalize_whitespace(en_raw)
            if jp_clean:
                jp_values.append(jp_clean)
            if en_clean:
                en_values.append(en_clean)
        leftover = BILINGUAL_PATTERN.sub("", text)
        leftover = normalize_whitespace(leftover.strip(" ,")) if leftover else ""
        if leftover:
            en_values.append(leftover)
        return BilingualText(
            ", ".join(jp_values) if jp_values else None,
            ", ".join(en_values) if en_values else None,
        )

    clean = normalize_whitespace(text)
    return BilingualText(None, clean if clean else None)


def clean_text(text: str) -> str:
    text = PDF_FOOTER_PATTERN.sub("", text)
    text = FILE_URI_PATTERN.sub("", text)
    text = text.replace(
        "Final Fantasy XII - Guide and Walkthrough - PlayStation 2 - By Red_Scarlet - GameFAQs",
        "",
    )
    return text


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    pages = [page.extract_text() for page in reader.pages]
    text = "\n".join(filter(None, pages))
    return clean_text(text)


def parse_toc(text: str) -> Dict[str, str]:
    start = text.find("| wt01a")
    end = text.find("Hello!", start)
    if start == -1 or end == -1:
        return {}

    toc_text = text[start:end]
    entries: Dict[str, str] = {}
    current_number: Optional[str] = None
    current_code: Optional[str] = None
    current_content: List[str] = []

    def flush_current() -> None:
        nonlocal current_code, current_content
        if current_code is not None:
            content = normalize_whitespace(" ".join(current_content).strip())
            entries[current_code] = content
        current_content = []

    for raw_line in toc_text.splitlines():
        if not raw_line.strip().startswith("|"):
            continue
        parts = raw_line.split("|")
        if len(parts) < 3:
            continue
        key = parts[1].strip()
        value = parts[2].strip()
        if not key and current_code:
            current_content.append(value)
            continue
        if key.startswith("wt") and len(key) == 5:
            flush_current()
            current_number = key[2:4]
            current_code = f"wt{current_number}{key[4]}"
            current_content = [value]
        elif key and current_number:
            flush_current()
            letter = key.strip()
            current_code = f"wt{current_number}{letter}"
            current_content = [value]
        else:
            continue
    flush_current()
    return entries


def extract_blocks(text: str) -> Dict[str, str]:
    text_with_prefix = "\n" + text
    matches = list(BLOCK_PATTERN.finditer(text_with_prefix))
    blocks: Dict[str, str] = {}
    for index, match in enumerate(matches):
        code = match.group(1)
        start = match.start() + 1
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text_with_prefix)
        block_text = text_with_prefix[start:end].strip()
        if not block_text:
            continue
        if len(block_text) > len(blocks.get(code, "")):
            blocks[code] = block_text
    return blocks


def determine_type_and_name(code: str, block_text: str, toc_entry: Optional[str]) -> Tuple[str, str]:
    lines = block_text.splitlines()
    header_line = lines[0] if lines else ""
    header_parts = [part.strip() for part in header_line.split("|") if part.strip()]
    header_content = header_parts[1] if len(header_parts) > 1 else ""
    toc = toc_entry or header_content
    normalized = toc.lower() if toc else ""

    if normalized.startswith("mark:"):
        name_text = toc.split(":", 1)[1].strip() if ":" in toc else ""
        return "mark", name_text
    if normalized.startswith("loot alert:"):
        name_text = toc.split(":", 1)[1].strip() if ":" in toc else ""
        return "loot-alert", name_text
    if normalized.startswith("loot alert"):
        return "loot-alert", ""

    for line in lines[:5]:
        lower = line.lower()
        if "mark:" in lower:
            return "mark", line.split(":", 1)[1].strip()
        if "loot alert" in lower:
            part = line.split(":", 1)[1].strip() if ":" in line else ""
            return "loot-alert", part

    return "section", toc.strip()


def base_area(code: str, toc_map: Dict[str, str]) -> Optional[BilingualText]:
    base_code = f"wt{code[2:4]}a"
    entry = toc_map.get(base_code)
    if not entry:
        return None
    bilingual = parse_bilingual(entry)
    if not bilingual.jp and not bilingual.en:
        return None
    return bilingual


def collect_tokens(code: str, content_type: str, name: BilingualText, area: Optional[BilingualText]) -> List[str]:
    token_set = {code.lower(), content_type}
    for token in name.tokens():
        token_set.add(token)
    if area:
        for token in area.tokens():
            token_set.add(token)
    return sorted(token_set)


def build_blocks(pdf_path: Path) -> List[GuideBlock]:
    text = extract_text(pdf_path)
    toc_map = parse_toc(text)
    blocks = extract_blocks(text)

    guide_blocks: List[GuideBlock] = []
    for code in sorted(blocks, key=lambda value: (int(value[2:4]), value[4])):
        block_text = blocks[code]
        toc_entry = toc_map.get(code)
        content_type, name_text = determine_type_and_name(code, block_text, toc_entry)
        name = parse_bilingual(name_text)
        area_info = None if code.endswith("a") else base_area(code, toc_map)
        tokens = collect_tokens(code, content_type, name, area_info)
        guide_blocks.append(
            GuideBlock(
                search_code=code,
                content_type=content_type,
                name=name,
                area=area_info,
                raw_text=block_text,
                tokens=tokens,
            )
        )
    return guide_blocks


def write_typescript(output_path: Path, guide_blocks: List[GuideBlock]) -> None:
    data = [block.to_dict() for block in guide_blocks]
    json_payload = json.dumps(data, ensure_ascii=False, indent=2)
    schema = """import { z } from 'zod';

const bilingualTextSchema = z
  .object({
    jp: z.string().min(1).nullable(),
    en: z.string().min(1).nullable(),
  })
  .refine((value) => value.jp !== null || value.en !== null, {
    message: 'At least one translation is required',
  });

const guideBlockSchema = z.object({
  searchCode: z.string(),
  contentType: z.enum(['section', 'mark', 'loot-alert']),
  name: bilingualTextSchema,
  area: bilingualTextSchema.nullable(),
  rawText: z.string(),
  tokens: z.array(z.string()),
});

const guideBlockArraySchema = z.array(guideBlockSchema);

const rawGuideBlocks = %s as const;

const guideBlocks = guideBlockArraySchema.parse(rawGuideBlocks);

export type GuideBlock = z.infer<typeof guideBlockSchema>;

export { guideBlockSchema, guideBlockArraySchema };
export default guideBlocks;
""" % json_payload

    output_path.write_text(schema, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract wtXX blocks into structured data")
    parser.add_argument("--pdf", type=Path, required=True, help="Path to the walkthrough PDF")
    parser.add_argument("--output", type=Path, required=True, help="Destination TypeScript file")
    args = parser.parse_args()

    guide_blocks = build_blocks(args.pdf)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    write_typescript(args.output, guide_blocks)
    print(f"Wrote {len(guide_blocks)} guide blocks to {args.output}")


if __name__ == "__main__":
    main()
