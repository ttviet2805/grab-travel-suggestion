# Kiểm tra và cài đặt Node.js nếu chưa có
if (-Not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js not installed. Installing..."
    # Cài đặt Node.js, sử dụng Chocolatey làm package manager
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    choco install nodejs -y
}

# Kiểm tra và cài đặt Python 3.12 nếu chưa có
if (-Not (Get-Command python3 -ErrorAction SilentlyContinue)) {
    Write-Host "Python 3.12 not installed. Installing..."
    choco install python --version 3.12 -y
}

# Cài đặt các gói npm cho Node.js
Write-Host "Installing npm packages..."
npm install

# Tạo và kích hoạt môi trường ảo Python
Write-Host "Setting up Python virtual environment..."
python -m venv venv
./venv/Scripts/Activate.ps1

# Cài đặt các gói pip cho Python
Write-Host "Installing pip packages..."
pip install -r requirements.txt

Write-Host "Setup completed successfully!"
