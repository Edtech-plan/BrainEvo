#!/bin/bash
# Installation script for pre-commit hooks

echo "Installing pre-commit hooks..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "pre-commit is not installed. Installing..."

    # Check if pip is available
    if command -v pip3 &> /dev/null; then
        pip3 install pre-commit
    elif command -v pip &> /dev/null; then
        pip install pre-commit
    else
        echo "Error: pip is not installed. Please install Python and pip first."
        echo "Visit: https://pre-commit.com/#installation"
        exit 1
    fi
fi

# Install the git hook scripts
pre-commit install

echo "Pre-commit hooks installed successfully!"
echo ""
echo "To test the hooks, run: pre-commit run --all-files"
