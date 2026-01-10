# PowerShell installation script for pre-commit hooks

Write-Host "Installing pre-commit hooks..." -ForegroundColor Green

# Check if pre-commit is installed
try {
    $null = Get-Command pre-commit -ErrorAction Stop
    Write-Host "pre-commit is already installed." -ForegroundColor Yellow
} catch {
    Write-Host "pre-commit is not installed. Installing..." -ForegroundColor Yellow

    # Check if pip is available
    try {
        $null = Get-Command pip3 -ErrorAction Stop
        pip3 install pre-commit
    } catch {
        try {
            $null = Get-Command pip -ErrorAction Stop
            pip install pre-commit
        } catch {
            Write-Host "Error: pip is not installed. Please install Python and pip first." -ForegroundColor Red
            Write-Host "Visit: https://pre-commit.com/#installation" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Install the git hook scripts
pre-commit install

Write-Host "Pre-commit hooks installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To test the hooks, run: pre-commit run --all-files" -ForegroundColor Cyan
