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

### Dependencies Module (`lib/deps.sh`)
- System dependency checking
- npm package management
- Installation verification

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