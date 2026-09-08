#!/bin/bash
# Apply light/dark mode color replacements to all component files

FILES=(
  "/home/z/my-project/src/components/dhikr/home-screen.tsx"
  "/home/z/my-project/src/components/dhikr/reading-screen.tsx"
  "/home/z/my-project/src/components/dhikr/completion-screen.tsx"
  "/home/z/my-project/src/components/dhikr/counter-screen.tsx"
  "/home/z/my-project/src/components/dhikr/stats-screen.tsx"
  "/home/z/my-project/src/components/dhikr/library-screen.tsx"
  "/home/z/my-project/src/components/dhikr/bottom-nav.tsx"
  "/home/z/my-project/src/app/page.tsx"
)

for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then echo "SKIP: $f not found"; continue; fi
  echo "Processing: $f"
  
  # sed replacements - order matters!
  # 1. text-white → app-text
  sed -i "s/\btext-white\b/app-text/g" "$f"
  # 2. text-slate-300 → app-text-2
  sed -i "s/\btext-slate-300\b/app-text-2/g" "$f"
  # 3. text-slate-400 → app-text-2
  sed -i "s/\btext-slate-400\b/app-text-2/g" "$f"
  # 4. text-slate-500 → app-text-muted
  sed -i "s/\btext-slate-500\b/app-text-muted/g" "$f"
  # 5. bg-white/5 → app-surface
  sed -i 's/bg-white\/5/app-surface/g' "$f"
  # 6. bg-white/[0.03] → app-surface
  sed -i 's/bg-white\/\[0\.03\]/app-surface/g' "$f"
  # 7. bg-white/[0.02] → app-surface
  sed -i 's/bg-white\/\[0\.02\]/app-surface/g' "$f"
  # 8. hover:bg-white/10 → app-surface-h
  sed -i 's/hover:bg-white\/10/app-surface-h/g' "$f"
  # 9. hover:bg-white/8 → app-surface-h
  sed -i 's/hover:bg-white\/8/app-surface-h/g' "$f"
  # 10. hover:bg-white/5 → app-surface-h
  sed -i 's/hover:bg-white\/5/app-surface-h/g' "$f"
  # 11. border-white/10 → app-border-c
  sed -i 's/border-white\/10/app-border-c/g' "$f"
  # 12. border-white/8 → app-border-c
  sed -i 's/border-white\/8/app-border-c/g' "$f"
  # 13. border-white/5 → app-border-c
  sed -i 's/border-white\/5/app-border-c/g' "$f"
  
  echo "  Done: $f"
done

echo "All files processed!"