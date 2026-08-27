#!/usr/bin/env python3
path = '/home/z/my-project/src/components/dhikr/counter-screen.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if '</span>' in line and 'motion.span' in line and '</motion.span>' not in line:
        lines[i] = line.replace('</span>', '</motion.span>')
        print(f'Fixed line {i+1}')

with open(path, 'w') as f:
    f.writelines(lines)
print('Done')
