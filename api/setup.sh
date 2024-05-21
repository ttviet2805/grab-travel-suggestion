#!/bin/bash

# Kiểm tra và cài đặt cURL nếu chưa có
if ! command -v curl &> /dev/null
then
    echo "cURL not installed. Installing..."
    sudo apt-get install curl -y
fi

# Kiểm tra và cài đặt Node.js nếu chưa có
if ! command -v node &> /dev/null
then
    echo "Node.js not installed. Installing..."
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install nodejs -y
fi

# Kiểm tra phiên bản Python hiện tại và cài đặt Python 3.12 nếu chưa có
PYTHON_VERSION=$(python3 --version | cut -d " " -f 2 | cut -d "." -f1-2)
if [[ "$PYTHON_VERSION" != "3.12" ]]
then
    echo "Python 3.12 not installed or not the default version. Installing Python 3.12..."
    sudo add-apt-repository ppa:deadsnakes/ppa -y
    sudo apt-get update
    sudo apt-get install python3.12 python3.12-venv python3.12-distutils python3.12-dev -y
    # Cập nhật các alias để python3 và pip3 trỏ tới Python 3.12
    sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.12 1
    sudo update-alternatives --install /usr/bin/pip3 pip3 /usr/bin/pip3.12 1
fi

# Cài đặt các gói npm cho Node.js
echo "Installing npm packages..."
npm install

# # Tạo và kích hoạt môi trường ảo Python
# echo "Setting up Python virtual environment..."
# python3 -m venv venv
# source venv/bin/activate

# Cài đặt các gói pip cho Python
echo "Installing pip packages..."
pip install -r requirements.txt

echo "Setup completed successfully!"
