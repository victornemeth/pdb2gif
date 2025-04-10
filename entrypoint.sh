#!/bin/bash
set -e

# Check if any .pdb files exist
if [ -z "$(ls /data/pdbs/*.pdb 2>/dev/null)" ]; then
  echo "❌ No .pdb files found in /data/pdbs"
  exit 1
fi

echo "📦 Found PDBs:"
ls /data/pdbs/*.pdb

# Loop over each .pdb file
for file in /data/pdbs/*.pdb; do
  name=$(basename "$file")
  echo "🔄 Rendering $name..."
  node render.js "$name"
done

echo "✅ All proteins rendered to /data/output"
