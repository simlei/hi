# Development Scripts

## Overview

The project uses a modular bash script system for development and testing. The scripts are organized into reusable modules and high-level command scripts.

## Script Structure

```
scripts/
├── lib/                    # Shared modules
│   ├── common.sh          # Common functions and variables
│   ├── deps.sh            # Dependency management
│   ├── log.sh            # Logging utilities
│   └── server.sh         # Server management
├── dev.sh                # Development server control
└── test.sh              # Test runner
```

## Modules

### Common Module (`lib/common.sh`)
- Shared variables and paths
- Directory management
- npm command wrappers
- Temporary file handling

### Advanced Dependencies Module (`lib/deps_advanced.sh`)

Provides sophisticated dependency management with:

1. Version Management
   ```bash
   # Define version requirements
   declare -A MIN_VERSIONS=(
       ["node"]="18.0.0"
       ["npm"]="9.0.0"
   )
   ```

2. Local Installation Support
   - Uses `.local/` directory in project root
   - Automatically added to .gitignore
   - Maintains isolated environment

3. Functional-Style Dependency Checkers
   ```bash
   # Create a custom dependency checker
   eval "$(make_dependency_checker "tool-name" "min-version" "install-command")"
   ```

4. Smart Path Resolution
   - Checks local installation first
   - Falls back to system installation
   - Validates version requirements

5. Project Dependencies
   ```bash
   # Check all system dependencies
   check_project_deps

   # Ensure npm dependencies
   ensure_project_deps "$PROJECT_DIR"
   ```

The system provides closure-like behavior through dynamic function generation, allowing for:
- Encapsulated dependency definitions
- Reusable checker creation
- Clean error handling
- Version compatibility validation

### Logging Module (`lib/log.sh`)
- Consistent log formatting
- Status indicators
- Error reporting

### Server Module (`lib/server.sh`)
- Server lifecycle management
- URL handling
- Process cleanup
- Health checking

## Command Scripts

### Development Server (`dev.sh`)

Start and manage the development server.

```bash
# Start server on default port
./scripts/dev.sh

# Start on specific port
./scripts/dev.sh --port 3001

# Get server URL
./scripts/dev.sh --url-only
```

### Test Runner (`test.sh`)

Run automated tests.

```bash
# Run all tests
./scripts/test.sh

# Skip build test
./scripts/test.sh --skip-build

# Test with specific port
./scripts/test.sh --port 3001
```

## Testing Process

The test script performs these checks:

1. Build Test
   - Dependency verification
   - npm package installation
   - Next.js build process
   - Output validation

2. Server Test
   - Server startup
   - Health check
   - Clean shutdown

## Development Workflow

### Initial Setup

The system automatically manages dependencies:

1. System Dependencies:
   ```bash
   # dev.sh checks and validates system dependencies
   ./scripts/dev.sh
   
   # If Node.js or npm versions are incompatible:
   # "❌ node version 16.0.0 is lower than required 18.0.0"
   ```

2. Project Dependencies:
   ```bash
   # Automatically installs in node_modules if needed
   # Uses npm ci for reproducible installations
   ./scripts/dev.sh
   ```

3. Local Tools (if implemented):
   ```bash
   # Tools can be installed in .local/
   # Automatically added to .gitignore
   # Example for a custom tool:
   eval "$(make_dependency_checker "tool" "1.0.0" "curl -o .local/bin/tool ...")"
   ```

### Regular Development

1. Start Development:
   ```bash
   ./scripts/dev.sh
   ```

2. Run Tests:
   ```bash
   ./scripts/test.sh
   ```

3. Clean Up:
   The scripts handle cleanup automatically, but you can stop the server at any time with Ctrl+C.

### Adding New Dependencies

1. System Dependencies:
   ```bash
   # In deps_advanced.sh
   eval "$(make_dependency_checker "new-tool" "1.0.0")"
   ```

2. Version Requirements:
   ```bash
   # In deps_advanced.sh
   declare -A MIN_VERSIONS=(
       ["node"]="18.0.0"
       ["npm"]="9.0.0"
       ["new-tool"]="1.0.0"
   )
   ```

## Error Handling

All scripts include:
- Dependency checking
- Process cleanup
- Clear error messages
- Non-zero exit codes on failure

## Extending

To add new functionality:
1. Create module in `lib/` if reusable
2. Add functions to existing module if related
3. Create new command script if standalone
4. Update this documentation