# Bash Scripting Style Guide

## Core Principles

1. **Location Independence**
   - NEVER rely on PWD (Present Working Directory)
   - ALWAYS use absolute paths derived from script location
   - Use `$(dirname "${BASH_SOURCE[0]}")` to get script directory
   - Export common paths in a central location

2. **DRY (Don't Repeat Yourself)**
   - Use common libraries for shared functionality
   - Source common variables from a single location
   - Reuse functions instead of duplicating code
   - Keep configuration centralized

3. **Robustness**
   - Use `set -euo pipefail` in all scripts
   - Quote all variable expansions
   - Use shellcheck for static analysis
   - Handle errors gracefully

## Path Management

```bash
# CORRECT - Get absolute path of script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# CORRECT - Reference other paths relative to script directory
source "${SCRIPT_DIR}/lib/common.sh"
WEBSITE_DIR="${SCRIPT_DIR}/.."

# INCORRECT - Relying on PWD
source ./lib/common.sh  # DON'T DO THIS
cd ../website          # DON'T DO THIS
```

## Common Library Structure

1. **Path Definitions**
   - Define in one place (e.g., common.sh)
   - Export for use in other scripts
   - Use absolute paths

2. **Shared Functions**
   - Keep in dedicated library files
   - Use clear naming conventions
   - Document parameters and return values

## Testing

1. **Location Independence**
   - Tests must pass regardless of PWD
   - Use absolute paths in test assertions
   - Avoid cd-based test setups

2. **Isolation**
   - Each test should be independent
   - Clean up after tests
   - Use temporary directories when needed

## Error Handling

```bash
# CORRECT - Handle errors with cleanup
cleanup() {
    local exit_code=$?
    # Cleanup code here
    exit $exit_code
}
trap cleanup EXIT

# CORRECT - Check commands and handle errors
if ! some_command; then
    log_error "Command failed"
    exit 1
fi
```