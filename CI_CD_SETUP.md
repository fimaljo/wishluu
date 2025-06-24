# CI/CD and Linting Configuration

This document describes the CI/CD pipeline and code quality tools configured for the WishLuu project.

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline is configured in `.github/workflows/ci-cd.yml` and includes:

#### Jobs:

1. **Lint and Build** - Runs on all branches and PRs
   - ESLint checking
   - TypeScript type checking
   - Prettier format checking
   - Next.js build verification

2. **Security Scan** - Runs after lint and build
   - npm audit for dependency vulnerabilities
   - Snyk security scanning (requires SNYK_TOKEN secret)

3. **Deploy to Development** - Runs on `develop` branch
   - Deploys to Vercel development environment

4. **Deploy to Staging** - Runs on `staging` branch
   - Deploys to Vercel staging environment

5. **Deploy to Production** - Runs on `main` branch
   - Deploys to Vercel production environment
   - Creates GitHub release

6. **Notify on Failure** - Runs when any job fails
   - Provides failure notifications

### Required Secrets

Set these secrets in your GitHub repository settings:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `SNYK_TOKEN` - Snyk security token (optional)

## 🛠️ Code Quality Tools

### ESLint Configuration

Located in `.eslintrc.json` with rules for:

- Next.js best practices
- React development
- TypeScript standards
- Code quality and consistency

### Prettier Configuration

Located in `.prettierrc` with settings for:

- Consistent code formatting
- Single quotes
- 80 character line width
- 2 space indentation

### Git Hooks (Husky)

#### Pre-commit Hook

- Runs `lint-staged` to format and lint staged files
- Ensures code quality before commits

#### Commit-msg Hook

- Validates commit message format
- Enforces conventional commit standards

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint with auto-fix
npm run lint:check   # Run ESLint without auto-fix
npm run type-check   # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## 🔄 Branch Strategy

The CI/CD pipeline supports the following branch strategy:

1. **Feature Branches** → `develop`
2. **develop** → `staging`
3. **staging** → `main` (production)

### Branch Protection Rules

Recommended branch protection rules for `main`, `staging`, and `develop`:

- Require status checks to pass before merging
- Require branches to be up to date before merging
- Require pull request reviews
- Restrict pushes to matching branches

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Check linting errors: `npm run lint:check`
   - Check formatting: `npm run format:check`

2. **Deployment Failures**
   - Verify Vercel secrets are set correctly
   - Check Vercel project configuration
   - Ensure build passes locally

3. **Pre-commit Hook Failures**
   - Run `npm run lint` to fix auto-fixable issues
   - Run `npm run format` to fix formatting issues
   - Check commit message format

### Local Development Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Husky hooks:

   ```bash
   npm run prepare
   ```

3. Verify setup:
   ```bash
   npm run lint:check
   npm run type-check
   npm run format:check
   ```

## 📋 Commit Message Format

Follow conventional commit format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `build`: Build system changes
- `perf`: Performance improvements

### Examples:

```
feat: add save and share functionality
fix(ui): resolve button alignment issue
docs: update README with setup instructions
style: format code with prettier
refactor: extract wish rendering logic
ci: update GitHub Actions workflow
```
