#!/bin/bash

# WishLuu Git Flow Helper Script
# Usage: ./scripts/git-flow.sh [command] [options]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository"
        exit 1
    fi
}

# Function to check if working directory is clean
check_clean_working_dir() {
    if ! git diff-index --quiet HEAD --; then
        print_error "Working directory is not clean. Please commit or stash your changes."
        exit 1
    fi
}

# Function to create a feature branch
create_feature() {
    if [ -z "$1" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 feature <feature-name>"
        exit 1
    fi
    
    local feature_name="$1"
    local branch_name="feature/$feature_name"
    
    print_info "Creating feature branch: $branch_name"
    
    check_git_repo
    check_clean_working_dir
    
    # Switch to develop and pull latest changes
    git checkout develop
    git pull origin develop
    
    # Create and switch to feature branch
    git checkout -b "$branch_name"
    
    print_success "Feature branch '$branch_name' created successfully"
    print_info "You can now start developing your feature"
}

# Function to finish a feature branch
finish_feature() {
    if [ -z "$1" ]; then
        print_error "Feature name is required"
        echo "Usage: $0 finish-feature <feature-name>"
        exit 1
    fi
    
    local feature_name="$1"
    local branch_name="feature/$feature_name"
    
    print_info "Finishing feature branch: $branch_name"
    
    check_git_repo
    
    # Check if we're on the feature branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$branch_name" ]; then
        print_error "You must be on the feature branch '$branch_name'"
        exit 1
    fi
    
    # Switch to develop and pull latest changes
    git checkout develop
    git pull origin develop
    
    # Merge feature branch
    git merge "$branch_name" --no-ff -m "feat: merge $feature_name"
    
    # Delete local feature branch
    git branch -d "$branch_name"
    
    # Delete remote feature branch
    git push origin --delete "$branch_name" 2>/dev/null || print_warning "Remote branch '$branch_name' not found or already deleted"
    
    print_success "Feature '$feature_name' finished and merged to develop"
}

# Function to create a release branch
create_release() {
    if [ -z "$1" ]; then
        print_error "Release version is required"
        echo "Usage: $0 release <version>"
        exit 1
    fi
    
    local version="$1"
    local branch_name="release/v$version"
    
    print_info "Creating release branch: $branch_name"
    
    check_git_repo
    check_clean_working_dir
    
    # Switch to develop and pull latest changes
    git checkout develop
    git pull origin develop
    
    # Create and switch to release branch
    git checkout -b "$branch_name"
    
    print_success "Release branch '$branch_name' created successfully"
    print_info "Make release-specific changes (version bump, changelog) and commit them"
}

# Function to finish a release branch
finish_release() {
    if [ -z "$1" ]; then
        print_error "Release version is required"
        echo "Usage: $0 finish-release <version>"
        exit 1
    fi
    
    local version="$1"
    local branch_name="release/v$version"
    
    print_info "Finishing release branch: $branch_name"
    
    check_git_repo
    
    # Check if we're on the release branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$branch_name" ]; then
        print_error "You must be on the release branch '$branch_name'"
        exit 1
    fi
    
    # Switch to main and pull latest changes
    git checkout main
    git pull origin main
    
    # Merge release branch
    git merge "$branch_name" --no-ff -m "release: v$version"
    
    # Tag the release
    git tag -a "v$version" -m "Release version $version"
    
    # Switch to develop and merge release
    git checkout develop
    git pull origin develop
    git merge "$branch_name" --no-ff -m "release: merge v$version to develop"
    
    # Delete local release branch
    git branch -d "$branch_name"
    
    # Delete remote release branch
    git push origin --delete "$branch_name" 2>/dev/null || print_warning "Remote branch '$branch_name' not found or already deleted"
    
    # Push changes and tags
    git push origin develop
    git push origin main
    git push origin "v$version"
    
    print_success "Release v$version finished and merged to main and develop"
}

# Function to create a hotfix branch
create_hotfix() {
    if [ -z "$1" ]; then
        print_error "Hotfix description is required"
        echo "Usage: $0 hotfix <description>"
        exit 1
    fi
    
    local description="$1"
    local branch_name="hotfix/$description"
    
    print_info "Creating hotfix branch: $branch_name"
    
    check_git_repo
    check_clean_working_dir
    
    # Switch to main and pull latest changes
    git checkout main
    git pull origin main
    
    # Create and switch to hotfix branch
    git checkout -b "$branch_name"
    
    print_success "Hotfix branch '$branch_name' created successfully"
    print_info "Fix the critical issue and commit your changes"
}

# Function to finish a hotfix branch
finish_hotfix() {
    if [ -z "$1" ]; then
        print_error "Hotfix description is required"
        echo "Usage: $0 finish-hotfix <description>"
        exit 1
    fi
    
    local description="$1"
    local branch_name="hotfix/$description"
    
    print_info "Finishing hotfix branch: $branch_name"
    
    check_git_repo
    
    # Check if we're on the hotfix branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$branch_name" ]; then
        print_error "You must be on the hotfix branch '$branch_name'"
        exit 1
    fi
    
    # Switch to main and pull latest changes
    git checkout main
    git pull origin main
    
    # Merge hotfix branch
    git merge "$branch_name" --no-ff -m "hotfix: $description"
    
    # Tag the hotfix
    local hotfix_version=$(date +"%Y%m%d-%H%M%S")
    git tag -a "hotfix-$hotfix_version" -m "Hotfix: $description"
    
    # Switch to develop and merge hotfix
    git checkout develop
    git pull origin develop
    git merge "$branch_name" --no-ff -m "hotfix: merge $description to develop"
    
    # Delete local hotfix branch
    git branch -d "$branch_name"
    
    # Delete remote hotfix branch
    git push origin --delete "$branch_name" 2>/dev/null || print_warning "Remote branch '$branch_name' not found or already deleted"
    
    # Push changes and tags
    git push origin develop
    git push origin main
    git push origin "hotfix-$hotfix_version"
    
    print_success "Hotfix '$description' finished and merged to main and develop"
}

# Function to show help
show_help() {
    echo "WishLuu Git Flow Helper Script"
    echo ""
    echo "Usage: $0 [command] [options]"
    echo ""
    echo "Commands:"
    echo "  feature <name>           Create a new feature branch"
    echo "  finish-feature <name>    Finish and merge a feature branch"
    echo "  release <version>        Create a new release branch"
    echo "  finish-release <version> Finish and merge a release branch"
    echo "  hotfix <description>     Create a new hotfix branch"
    echo "  finish-hotfix <desc>     Finish and merge a hotfix branch"
    echo "  help                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 feature user-authentication"
    echo "  $0 finish-feature user-authentication"
    echo "  $0 release 1.2.0"
    echo "  $0 finish-release 1.2.0"
    echo "  $0 hotfix security-patch"
    echo "  $0 finish-hotfix security-patch"
}

# Main script logic
case "$1" in
    "feature")
        create_feature "$2"
        ;;
    "finish-feature")
        finish_feature "$2"
        ;;
    "release")
        create_release "$2"
        ;;
    "finish-release")
        finish_release "$2"
        ;;
    "hotfix")
        create_hotfix "$2"
        ;;
    "finish-hotfix")
        finish_hotfix "$2"
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 