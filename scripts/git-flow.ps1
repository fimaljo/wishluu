# WishLuu Git Flow Helper Script for PowerShell
# Usage: .\scripts\git-flow.ps1 [command] [options]

param(
    [Parameter(Position=0)]
    [string]$Command,
    
    [Parameter(Position=1)]
    [string]$Argument
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Function to print colored output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

# Function to check if we're in a git repository
function Test-GitRepository {
    try {
        git rev-parse --git-dir | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to check if working directory is clean
function Test-CleanWorkingDirectory {
    try {
        git diff-index --quiet HEAD -- | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

# Function to create a feature branch
function New-FeatureBranch {
    param([string]$FeatureName)
    
    if (-not $FeatureName) {
        Write-Error "Feature name is required"
        Write-Host "Usage: .\git-flow.ps1 feature <feature-name>"
        exit 1
    }
    
    $BranchName = "feature/$FeatureName"
    
    Write-Info "Creating feature branch: $BranchName"
    
    if (-not (Test-GitRepository)) {
        Write-Error "Not in a git repository"
        exit 1
    }
    
    if (-not (Test-CleanWorkingDirectory)) {
        Write-Error "Working directory is not clean. Please commit or stash your changes."
        exit 1
    }
    
    # Switch to develop and pull latest changes
    git checkout develop
    git pull origin develop
    
    # Create and switch to feature branch
    git checkout -b $BranchName
    
    Write-Success "Feature branch '$BranchName' created successfully"
    Write-Info "You can now start developing your feature"
}

# Function to finish a feature branch
function Complete-FeatureBranch {
    param([string]$FeatureName)
    
    if (-not $FeatureName) {
        Write-Error "Feature name is required"
        Write-Host "Usage: .\git-flow.ps1 finish-feature <feature-name>"
        exit 1
    }
    
    $BranchName = "feature/$FeatureName"
    
    Write-Info "Finishing feature branch: $BranchName"
    
    if (-not (Test-GitRepository)) {
        Write-Error "Not in a git repository"
        exit 1
    }
    
    # Check if we're on the feature branch
    $CurrentBranch = git branch --show-current
    if ($CurrentBranch -ne $BranchName) {
        Write-Error "You must be on the feature branch '$BranchName'"
        exit 1
    }
    
    # Switch to develop and pull latest changes
    git checkout develop
    git pull origin develop
    
    # Merge feature branch
    git merge $BranchName --no-ff -m "feat: merge $FeatureName"
    
    # Delete local feature branch
    git branch -d $BranchName
    
    # Delete remote feature branch
    try {
        git push origin --delete $BranchName
    }
    catch {
        Write-Warning "Remote branch '$BranchName' not found or already deleted"
    }
    
    Write-Success "Feature '$FeatureName' finished and merged to develop"
}

# Function to create a release branch
function New-ReleaseBranch {
    param([string]$Version)
    
    if (-not $Version) {
        Write-Error "Release version is required"
        Write-Host "Usage: .\git-flow.ps1 release <version>"
        exit 1
    }
    
    $BranchName = "release/v$Version"
    
    Write-Info "Creating release branch: $BranchName"
    
    if (-not (Test-GitRepository)) {
        Write-Error "Not in a git repository"
        exit 1
    }
    
    if (-not (Test-CleanWorkingDirectory)) {
        Write-Error "Working directory is not clean. Please commit or stash your changes."
        exit 1
    }
    
    # Switch to develop and pull latest changes
    git checkout develop
    git pull origin develop
    
    # Create and switch to release branch
    git checkout -b $BranchName
    
    Write-Success "Release branch '$BranchName' created successfully"
    Write-Info "Make release-specific changes (version bump, changelog) and commit them"
}

# Function to finish a release branch
function Complete-ReleaseBranch {
    param([string]$Version)
    
    if (-not $Version) {
        Write-Error "Release version is required"
        Write-Host "Usage: .\git-flow.ps1 finish-release <version>"
        exit 1
    }
    
    $BranchName = "release/v$Version"
    
    Write-Info "Finishing release branch: $BranchName"
    
    if (-not (Test-GitRepository)) {
        Write-Error "Not in a git repository"
        exit 1
    }
    
    # Check if we're on the release branch
    $CurrentBranch = git branch --show-current
    if ($CurrentBranch -ne $BranchName) {
        Write-Error "You must be on the release branch '$BranchName'"
        exit 1
    }
    
    # Switch to main and pull latest changes
    git checkout main
    git pull origin main
    
    # Merge release branch
    git merge $BranchName --no-ff -m "release: v$Version"
    
    # Tag the release
    git tag -a "v$Version" -m "Release version $Version"
    
    # Switch to develop and merge release
    git checkout develop
    git pull origin develop
    git merge $BranchName --no-ff -m "release: merge v$Version to develop"
    
    # Delete local release branch
    git branch -d $BranchName
    
    # Delete remote release branch
    try {
        git push origin --delete $BranchName
    }
    catch {
        Write-Warning "Remote branch '$BranchName' not found or already deleted"
    }
    
    # Push changes and tags
    git push origin develop
    git push origin main
    git push origin "v$Version"
    
    Write-Success "Release v$Version finished and merged to main and develop"
}

# Function to create a hotfix branch
function New-HotfixBranch {
    param([string]$Description)
    
    if (-not $Description) {
        Write-Error "Hotfix description is required"
        Write-Host "Usage: .\git-flow.ps1 hotfix <description>"
        exit 1
    }
    
    $BranchName = "hotfix/$Description"
    
    Write-Info "Creating hotfix branch: $BranchName"
    
    if (-not (Test-GitRepository)) {
        Write-Error "Not in a git repository"
        exit 1
    }
    
    if (-not (Test-CleanWorkingDirectory)) {
        Write-Error "Working directory is not clean. Please commit or stash your changes."
        exit 1
    }
    
    # Switch to main and pull latest changes
    git checkout main
    git pull origin main
    
    # Create and switch to hotfix branch
    git checkout -b $BranchName
    
    Write-Success "Hotfix branch '$BranchName' created successfully"
    Write-Info "Fix the critical issue and commit your changes"
}

# Function to finish a hotfix branch
function Complete-HotfixBranch {
    param([string]$Description)
    
    if (-not $Description) {
        Write-Error "Hotfix description is required"
        Write-Host "Usage: .\git-flow.ps1 finish-hotfix <description>"
        exit 1
    }
    
    $BranchName = "hotfix/$Description"
    
    Write-Info "Finishing hotfix branch: $BranchName"
    
    if (-not (Test-GitRepository)) {
        Write-Error "Not in a git repository"
        exit 1
    }
    
    # Check if we're on the hotfix branch
    $CurrentBranch = git branch --show-current
    if ($CurrentBranch -ne $BranchName) {
        Write-Error "You must be on the hotfix branch '$BranchName'"
        exit 1
    }
    
    # Switch to main and pull latest changes
    git checkout main
    git pull origin main
    
    # Merge hotfix branch
    git merge $BranchName --no-ff -m "hotfix: $Description"
    
    # Tag the hotfix
    $HotfixVersion = Get-Date -Format "yyyyMMdd-HHmmss"
    git tag -a "hotfix-$HotfixVersion" -m "Hotfix: $Description"
    
    # Switch to develop and merge hotfix
    git checkout develop
    git pull origin develop
    git merge $BranchName --no-ff -m "hotfix: merge $Description to develop"
    
    # Delete local hotfix branch
    git branch -d $BranchName
    
    # Delete remote hotfix branch
    try {
        git push origin --delete $BranchName
    }
    catch {
        Write-Warning "Remote branch '$BranchName' not found or already deleted"
    }
    
    # Push changes and tags
    git push origin develop
    git push origin main
    git push origin "hotfix-$HotfixVersion"
    
    Write-Success "Hotfix '$Description' finished and merged to main and develop"
}

# Function to show help
function Show-Help {
    Write-Host "WishLuu Git Flow Helper Script for PowerShell"
    Write-Host ""
    Write-Host "Usage: .\git-flow.ps1 [command] [options]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  feature <name>           Create a new feature branch"
    Write-Host "  finish-feature <name>    Finish and merge a feature branch"
    Write-Host "  release <version>        Create a new release branch"
    Write-Host "  finish-release <version> Finish and merge a release branch"
    Write-Host "  hotfix <description>     Create a new hotfix branch"
    Write-Host "  finish-hotfix <desc>     Finish and merge a hotfix branch"
    Write-Host "  help                     Show this help message"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\git-flow.ps1 feature user-authentication"
    Write-Host "  .\git-flow.ps1 finish-feature user-authentication"
    Write-Host "  .\git-flow.ps1 release 1.2.0"
    Write-Host "  .\git-flow.ps1 finish-release 1.2.0"
    Write-Host "  .\git-flow.ps1 hotfix security-patch"
    Write-Host "  .\git-flow.ps1 finish-hotfix security-patch"
}

# Main script logic
switch ($Command) {
    "feature" {
        New-FeatureBranch $Argument
    }
    "finish-feature" {
        Complete-FeatureBranch $Argument
    }
    "release" {
        New-ReleaseBranch $Argument
    }
    "finish-release" {
        Complete-ReleaseBranch $Argument
    }
    "hotfix" {
        New-HotfixBranch $Argument
    }
    "finish-hotfix" {
        Complete-HotfixBranch $Argument
    }
    "help" {
        Show-Help
    }
    default {
        if (-not $Command) {
            Show-Help
        }
        else {
            Write-Error "Unknown command: $Command"
            Write-Host ""
            Show-Help
            exit 1
        }
    }
} 