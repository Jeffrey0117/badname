# BadName

A code obfuscation tool that transforms variable names in JavaScript/TypeScript files into intentionally "bad" names for testing, obfuscation, or educational purposes.

## Features

- 🔄 Transforms JavaScript and TypeScript variable names
- 🎯 Multiple naming modes available
- 📁 Supports glob patterns for batch processing
- ⚡ Fast AST-based transformation using Babel
- 🛡️ Preserves essential identifiers (React hooks, module system, etc.)
- 📦 CLI tool for easy integration

## Installation

### Global Installation

```bash
npm install -g badname
```

### Local Installation

```bash
npm install badname
```

### Development Setup

If you want to contribute or modify the tool:

```bash
# Clone the repository
git clone <your-repo-url>
cd badname

# Install dependencies
npm install

# Link for global usage during development
npm link
```

## Usage

### Basic Usage

Transform all JavaScript/TypeScript files in a directory:

```bash
badname ./src
```

### Advanced Usage

```bash
# Specify custom include pattern
badname ./src --include "**/*.{js,ts,jsx,tsx}"

# Use different naming mode
badname ./src --mode finalHell

# Use meme-inspired variable names
badname ./src --mode memeLord

# Transform specific files
badname ./src/components --include "**/*.tsx"
```

### Command Line Options

| Option                | Description                                | Default                         |
| --------------------- | ------------------------------------------ | ------------------------------- |
| `<target>`            | Path or glob pattern of files to transform | Required                        |
| `--mode <mode>`       | Naming mode to use                         | `newOldHell`                    |
| `--include <pattern>` | Glob pattern for file inclusion            | `**/*.{js,ts,jsx,tsx,css,html}` |

### Available Modes

#### `newOldHell` (Default)

Transforms variables using a pool of generic names:

- `new`, `old`, `temp`, `data`, `final`, `ok`, `test`, `foo`, `bar`, etc.

#### `finalHell`

Another naming scheme for different obfuscation patterns.

#### `memeLord`

Transforms variables using modern internet slang and meme-inspired names:

- `sus`, `bruh`, `yeet`, `based`, `cringe`, `simp`, `pog`, `uwu`, `vibe`, `lit`, `bussin`, etc.

## Examples

### Before Transformation

```javascript
function calculateTotalPrice(items, taxRate) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const tax = subtotal * taxRate;
  return subtotal + tax;
}
```

### After Transformation

#### Default mode (`newOldHell`):

```javascript
function calculateTotalPrice(final, ok) {
  const test = final.reduce((temp, data) => temp + data.price, 0);
  const foo = test * ok;
  return test + foo;
}
```

#### memeLord mode:

```javascript
function calculateTotalPrice(sus, bruh) {
  const yeet = sus.reduce((based, cringe) => based + cringe.price, 0);
  const simp = yeet * bruh;
  return yeet + simp;
}
```

## What Gets Transformed

✅ **Transformed:**

- Local variables
- Function parameters
- Function names (local scope)
- Class names (local scope)
- Shorthand object properties

❌ **Preserved:**

- Object property keys (non-shorthand)
- Member expression properties (`obj.property`)
- Import/export specifiers
- Essential identifiers (`React`, `useState`, `require`, etc.)
- Labels in labeled statements

## API Usage

You can also use BadName programmatically:

```javascript
import { runBadName } from "badname/src/core/index.js";

await runBadName("./src", {
  mode: "newOldHell",
  include: "**/*.{js,ts,jsx,tsx}",
});
```

## Configuration

Currently, configuration is handled through command-line options. Future versions may include configuration file support.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Link for testing
npm link

# Test the CLI
badname ./test-files --mode newOldHell
```

## Use Cases

- **Code Obfuscation**: Make code harder to read while maintaining functionality
- **Testing**: Test how robust your code is with different variable names
- **Education**: Demonstrate the importance of meaningful variable names
- **Security**: Basic protection against casual code inspection

## Limitations

- Currently only supports JavaScript and TypeScript files
- CSS and HTML transformation are planned but not yet implemented
- Some complex syntax patterns might not be handled perfectly

## License

ISC

## Changelog

### v1.0.0

- Initial release
- JavaScript/TypeScript support
- CLI interface
- Multiple naming modes

## Support

If you encounter any issues or have questions, please:

1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Include code examples if possible

---

**Warning**: This tool modifies your source code. Always use version control and test thoroughly before using in production environments.
