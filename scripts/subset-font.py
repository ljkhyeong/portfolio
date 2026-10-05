"""Pretendard 가변 글꼴에서 사이트에 쓰는 글자만 남긴 woff2를 만든다.

Pretendard는 SIL OFL 1.1이며 "Pretendard"를 예약 글꼴 이름으로 지정한다. 서브셋은 수정본이므로
글꼴 내부 이름에서 Pretendard를 다른 이름으로 바꾸고, 저작권·상표·라이선스 고지는 그대로 둔다.

필요 패키지: fonttools==4.66.1, brotli==1.2.0
"""

import argparse
import re

from fontTools import subset
from fontTools.ttLib import TTFont

# 저작권(0), 상표(7), 라이선스 설명(13)과 주소(14)는 OFL에 따라 원문을 유지한다.
PRESERVED_NAME_IDS = {0, 7, 13, 14}
# 화면에서 tabular-nums를 쓰므로 기본 기능에 숫자 폭 기능을 더한다.
EXTRA_FEATURES = ["tnum", "pnum", "zero", "case"]


def rename(value, family):
    postscript = re.sub(r"\s+", "", family)
    return (
        value.replace("Pretendard Variable", family)
        .replace("PretendardVariable", postscript)
        .replace("Pretendard", family)
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--text-file", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--family", required=True)
    args = parser.parse_args()

    with open(args.text_file, encoding="utf-8") as text_file:
        text = text_file.read()

    font = TTFont(args.source)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = subset.Options().layout_features + EXTRA_FEATURES
    options.hinting = False
    options.notdef_outline = True
    options.name_IDs = ["*"]
    options.name_languages = ["*"]

    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)

    for record in font["name"].names:
        if record.nameID in PRESERVED_NAME_IDS:
            continue
        value = record.toUnicode()
        if "Pretendard" in value:
            record.string = rename(value, args.family)

    font.flavor = "woff2"
    font.save(args.output)


if __name__ == "__main__":
    main()
