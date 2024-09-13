#!/bin/bash

# Parse options
NEWFILE=false
INPUT_FILE=""
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --newfile) NEWFILE=true ;;
        -h|--help) echo "Usage: $0 [--newfile] <input_file>"; exit 0 ;;
        *) INPUT_FILE="$1" ;;
    esac
    shift
done

# Check if the input file is specified
if [[ -z "$INPUT_FILE" ]]; then
    echo "Usage: $0 [--newfile] <input_file>"
    exit 1
fi

# Set file names
BASENAME=$(basename "$INPUT_FILE" .json)
BACKUP_FILE="${BASENAME}_old.json"
NEWFILE_FLAG="${BASENAME}_new.json"

# Backup handling
if $NEWFILE; then
    if [[ -f "$NEWFILE_FLAG" ]]; then
        echo "Warning: ${NEWFILE_FLAG} already exists. Stopping."
        exit 1
    fi
else
    if [[ -f "$BACKUP_FILE" ]]; then
        echo "Warning: ${BACKUP_FILE} already exists. Stopping."
        exit 1
    fi
    cp "$INPUT_FILE" "$BACKUP_FILE"
fi

# Run jq script to sort the JSON
SORTED=$(jq -f sort.jq "$INPUT_FILE")

if $NEWFILE; then
    echo "$SORTED" > "$NEWFILE_FLAG"
else
    echo "$SORTED" > "$INPUT_FILE"
fi

echo "Sorting completed."
