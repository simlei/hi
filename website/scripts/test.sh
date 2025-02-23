#!/usr/bin/env bash

set -euo pipefail

# Import common library
source "$(dirname "${BASH_SOURCE[0]}")/lib/common.sh"

# Import test library
source "$LIB_DIR/test.sh"

# Run tests with provided arguments
run_tests "$@"