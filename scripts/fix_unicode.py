#!/usr/bin/env python3
import re, os

emoji_map = {
    '1F54C': '🕌', '1F4D6': '📖', '1F4E1': '📡', '1F91A': '🤚',
    '1F4CA': '📊', '1F389': '🎉', '1F49C': '💛', '1F525': '🔥',
    '1F64F': '🙏', '262A': '☪️', '2705': '✅', '1F512': '🔒',
    '2B50': '⭐', '2728': '✨', '1F331': '🌱', '1F33F': '🌿',
    '1F333': '🌳', '1F384': '🎄', '1F334': '🌴', '1F3F0': '🏰',
    '2699': '⚙', 'FE0F': '',
}

base = '/home/z/my-project/src/components/dhikr'
for fname in os.listdir(base):
    if not fname.endswith('.tsx'):
        continue
    fpath = os.path.join(base, fname)
    with open(fpath, 'r') as f:
        content = f.read()
    original = content
    # Match \u{XXXX} or \uXXXX patterns in JSX text content
    content = re.sub(r'\\u\{([0-9A-Fa-f]+)\}', lambda m: emoji_map.get(m.group(1), m.group(0)), content)
    content = re.sub(r'\\u([0-9A-Fa-f]{4})', lambda m: emoji_map.get(m.group(1), m.group(0)), content)
    if content != original:
        with open(fpath, 'w') as f:
            f.write(content)
        print(f'Fixed {fname}')
print('Done')
