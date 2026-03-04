#!/bin/bash

# ==========================================
# Frontend Deployment Script
# ==========================================

# 1. Server Configuration
PEM_FILE="../samyak-frontend.pem"
EC2_USER="ubuntu"
EC2_IP="100.31.149.193" # Update this if your EC2 IP ever changes!

echo "======================================================"
echo "🚀 Starting SamyakSetu Frontend Deployment..."
echo "======================================================"

echo "📦 1. Packing local files into ZIP..."
# Clean up old zip if it exists
rm -f samyak-frontend.zip
# Zip the code, but exclude heavy/unnecessary folders
zip -r samyak-frontend.zip . -x "node_modules/*" -x ".git/*" -x "dist/*" > /dev/null

echo "📤 2. Uploading ZIP securely to EC2 ($EC2_IP)..."
scp -o StrictHostKeyChecking=no -i "$PEM_FILE" samyak-frontend.zip $EC2_USER@$EC2_IP:~

echo "🛠️  3. Executing Build & Deploy on EC2 Server..."
# Connect to the server via SSH and feed it the following commands automatically
ssh -o StrictHostKeyChecking=no -i "$PEM_FILE" $EC2_USER@$EC2_IP << 'EOF'

    echo "   -> 🔄 Unzipping new code..."
    unzip -o samyak-frontend.zip -d SamyakSetu-Frontend- > /dev/null
    cd SamyakSetu-Frontend-
    
    echo "   -> 📥 Loading Node.js & NPM..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    echo "   -> 📦 Installing NPM Dependencies..."
    npm install > /dev/null 2>&1
    
    echo "   -> 🏗️ Building Production React App..."
    npm run build
    
    echo "   -> 🌐 Publishing static files to Nginx..."
    sudo rm -rf /var/www/html/*
    sudo cp -r dist/* /var/www/html/
    
    echo "   -> 🔄 Restarting Nginx Server..."
    sudo systemctl restart nginx
    
EOF

echo "======================================================"
echo "🎉 DEPLOYMENT 100% COMPLETE! "
echo "🌍 Check it out live: http://$EC2_IP"
echo "======================================================"
