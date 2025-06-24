# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial WishLuu application setup
- Next.js 14 with App Router
- TypeScript configuration
- ESLint and Prettier setup
- Component library with UI components
- Wish creation and management features
- Template system for wish customization
- Premium features and subscription handling
- Responsive design and modern UI
- Git Flow branching strategy
- CI/CD pipeline with GitHub Actions

### Changed

### Deprecated

### Removed

### Fixed

### Security

## [1.0.0] - 2025-01-XX

### Added

- Initial release of WishLuu
- Core wish list functionality
- User interface components
- Template system
- Premium features framework
- Responsive design
- TypeScript support
- ESLint configuration
- Git branching strategy
- CI/CD pipeline

---

## Release Process

### For each release:

1. **Create a release branch** from `develop`:

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/vX.Y.Z
   ```

2. **Update version** in `package.json`

3. **Update CHANGELOG.md** with new version section

4. **Commit changes**:

   ```bash
   git add .
   git commit -m "chore: prepare release vX.Y.Z"
   ```

5. **Push release branch** and create pull requests to `staging` and `main`

6. **After testing**, merge to `main` and tag the release

### Version Format

- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, backward compatible

### Commit Message Format

Use conventional commit format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks
