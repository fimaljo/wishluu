# WishLuu Branching Strategy

## Overview

This document outlines the branching strategy for the WishLuu application, following Git Flow principles adapted for modern development practices.

## Branch Structure

### Main Branches

#### `main` (Production)

- **Purpose**: Contains production-ready code
- **Protection**: Direct commits are disabled
- **Updates**: Only via pull requests from `staging` or `hotfix/*` branches
- **Deployment**: Automatically deploys to production environment

#### `develop` (Development)

- **Purpose**: Integration branch for all features
- **Protection**: Direct commits are disabled
- **Updates**: Only via pull requests from `feature/*` branches
- **Deployment**: Deploys to development environment

#### `staging` (Pre-production)

- **Purpose**: Pre-production testing and QA
- **Protection**: Direct commits are disabled
- **Updates**: Only via pull requests from `develop` or `release/*` branches
- **Deployment**: Deploys to staging environment

### Supporting Branches

#### `feature/*` (Feature Development)

- **Naming**: `feature/feature-name` (e.g., `feature/user-authentication`)
- **Source**: Always branch from `develop`
- **Target**: Always merge back to `develop`
- **Lifecycle**: Delete after merge
- **Example**: `feature/premium-subscription`

#### `release/*` (Release Preparation)

- **Naming**: `release/version-number` (e.g., `release/v1.2.0`)
- **Source**: Always branch from `develop`
- **Target**: Merge to both `staging` and `main`
- **Purpose**: Final testing, bug fixes, and version preparation
- **Lifecycle**: Delete after merge to `main`

#### `hotfix/*` (Emergency Fixes)

- **Naming**: `hotfix/issue-description` (e.g., `hotfix/security-patch`)
- **Source**: Always branch from `main`
- **Target**: Merge to `main`, `develop`, and `staging`
- **Purpose**: Critical production fixes
- **Lifecycle**: Delete after merge

## Workflow

### Feature Development

1. Create feature branch from `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. Develop and commit your changes

   ```bash
   git add .
   git commit -m "feat: add user authentication"
   ```

3. Push feature branch and create pull request

   ```bash
   git push -u origin feature/your-feature-name
   ```

4. Create pull request to `develop` on GitHub

### Release Process

1. Create release branch from `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.2.0
   ```

2. Make release-specific changes (version bump, changelog)

   ```bash
   # Update version in package.json
   # Update CHANGELOG.md
   git add .
   git commit -m "chore: prepare release v1.2.0"
   ```

3. Push release branch and create pull requests

   ```bash
   git push -u origin release/v1.2.0
   ```

4. Create pull request to `staging` for testing
5. After testing, create pull request to `main` for production

### Hotfix Process

1. Create hotfix branch from `main`

   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/critical-bug-fix
   ```

2. Fix the issue and commit

   ```bash
   git add .
   git commit -m "fix: resolve critical security vulnerability"
   ```

3. Push hotfix branch and create pull requests

   ```bash
   git push -u origin hotfix/critical-bug-fix
   ```

4. Create pull requests to `main`, `develop`, and `staging`

## Branch Protection Rules

### Main Branches Protection

- **main**: Require pull request reviews, status checks, and branch up to date
- **develop**: Require pull request reviews and status checks
- **staging**: Require pull request reviews and status checks

### Branch Naming Conventions

- Feature branches: `feature/descriptive-name`
- Release branches: `release/vX.Y.Z`
- Hotfix branches: `hotfix/issue-description`

## Version Management

### Semantic Versioning

- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backward compatible
- **Patch** (0.0.X): Bug fixes, backward compatible

### Version Tags

- Tag releases on `main` branch
- Use annotated tags with release notes
- Example: `git tag -a v1.2.0 -m "Release version 1.2.0"`

## Deployment Strategy

### Environments

- **Development**: Deploys from `develop` branch
- **Staging**: Deploys from `staging` branch
- **Production**: Deploys from `main` branch

### CI/CD Pipeline

- Automated testing on all branches
- Automated deployment to development and staging
- Manual approval required for production deployment

## Best Practices

1. **Keep branches short-lived**: Feature branches should be merged within a few days
2. **Regular integration**: Merge `develop` into feature branches regularly
3. **Clear commit messages**: Use conventional commit format
4. **Code review**: All changes require pull request review
5. **Testing**: Ensure all tests pass before merging

## Commands Reference

### Creating Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/feature-name
```

### Creating Release Branch

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0
```

### Creating Hotfix Branch

```bash
git checkout main
git pull origin main
git checkout -b hotfix/issue-description
```

### Merging and Cleanup

```bash
# After merging feature branch
git checkout develop
git pull origin develop
git branch -d feature/feature-name
git push origin --delete feature/feature-name
```
