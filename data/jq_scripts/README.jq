# JSON Sorting Script

This repository contains a pair of scripts to sort a JSON file containing a member list for the Hongo Hep-th group, according to specified sorting rules.

## Sorting Rules

1. **By `priority`** (null or undefined values are treated as `9999`)
2. **By `position.english`** in the following order:
   - Professor
   - Associate Professor
   - Assistant Professor
   - Secretary
   - PD
   - Reject positions starting with "D" or "M"(like `null` values)
   - All other positions are treated as null (lowest priority)
3. **By `join` date** (earlier dates come first; if month is null/undefined, treat as December)
4. **By `name.lastName`** alphabetically
5. **By `name.firstName`** alphabetically

## Files

- `sort.jq`: The `jq` script that performs the sorting.
- `sort.sh`: A bash script that handles the file operations and invokes the `jq` script.

## Usage

### Prerequisites

- **jq**: Ensure you have jq installed on your system. You can install it via your package manager. For example:
  ```sh
  sudo apt-get install jq  # For Debian/Ubuntu
  sudo yum install jq      # For CentOS/RHEL
  brew install jq          # For macOS
  ```
# Run the script with your JSON file

```sh
./sort.sh --newfile data.json  # To create a new sorted file named data_new.json
./sort.sh data.json            # To sort the JSON in-place and create a backup named data_old.json
```

## Options

- `--newfile`: If specified, the script will create a new file with the sorted results (default suffix `_new.json`). If the new file already exists, the script will stop with a warning.
- `<input_file>`: The input JSON file to be sorted.

## File Backup Handling

- If `--newfile` is not specified and an old backup file (`<input_file>_old.json`) already exists, the script will stop with a warning.
- If `--newfile` is specified and the target new file (`<input_file>_new.json`) already exists, the script will stop with a warning.

## Examples

```sh
# Sort and create a new file data_new.json
./sort.sh --newfile data.json

# Sort in place and create a backup file data_old.json
./sort.sh data.json
```

## Script Explanation

### jq Script (`sort.jq`)

- **Handles Position Priority**: Defines a mapping for positions and treats "D" and "M" prefixed positions as `null`.
- **Join Date Handling**: Properly converts join years and months to comparable numbers, defaulting null months to 12 (December).
- **Sorting Logic**: Utilizes `sort_by` to sort the list based on multiple criteria in the specified order.

### Bash Script (`sort.sh`)

- **File Handling**: Manages backup and new file creation based on provided options.
- **Running jq**: Invokes the `jq` script to perform the actual sorting.
