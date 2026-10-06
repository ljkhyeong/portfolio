"""가변 글꼴(Pretendard, Hahmlet)에서 사이트에 쓰는 글자만 남긴 woff2를 만든다.

두 글꼴 모두 SIL OFL 1.1이고 Pretendard는 "Pretendard"를 예약 글꼴 이름으로 지정한다. 서브셋은 수정본이므로
글꼴 내부 이름에서 원본 이름을 다른 이름으로 바꾸고, 저작권·상표·라이선스 고지는 그대로 둔다.

필요 패키지: fonttools==4.66.1, brotli==1.2.0
"""

import argparse
import re

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

# 저작권(0), 상표(7), 라이선스 설명(13)과 주소(14)는 OFL에 따라 원문을 유지한다.
PRESERVED_NAME_IDS = {0, 7, 13, 14}
# 화면에서 tabular-nums를 쓰므로 기본 기능에 숫자 폭 기능을 더한다.
EXTRA_FEATURES = ["tnum", "pnum", "zero", "case"]


def rename(value, family, original_names, postscript_name=False):
    # 긴 이름부터 바꿔 "Pretendard Variable"이 "Pretendard"보다 먼저 바뀌게 한다.
    # PostScript 이름(nameID 6)과 붙여 쓴 원본 이름에는 공백 없는 이름을 쓴다.
    postscript = re.sub(r"\s+", "", family)
    for name in sorted(original_names, key=len, reverse=True):
        compact = postscript_name or (" " not in name and name.endswith("Variable"))
        value = value.replace(name, postscript if compact else family)
    return value


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True)
    parser.add_argument("--text-file", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--family", required=True)
    parser.add_argument("--original-name", action="append", default=[])
    # 제목 글꼴처럼 일부 굵기만 쓰면 굵기 축을 줄여 파일을 줄인다. 예: 400:700
    parser.add_argument("--weight-range")
    args = parser.parse_args()
    original_names = args.original_name or ["Pretendard Variable", "PretendardVariable", "Pretendard"]

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

    if args.weight_range:
        low, high = (float(value) for value in args.weight_range.split(":"))
        font = instancer.instantiateVariableFont(font, {"wght": (low, high)})

    for record in font["name"].names:
        if record.nameID in PRESERVED_NAME_IDS:
            continue
        value = record.toUnicode()
        if any(name in value for name in original_names):
            record.string = rename(value, args.family, original_names, record.nameID == 6)

    font.flavor = "woff2"
    font.save(args.output)


if __name__ == "__main__":
    main()
