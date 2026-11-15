#!/bin/bash

# اسکریپت راه‌اندازی خودکار MongoDB برای پروژه اچ‌شاپ
# استفاده: chmod +x scripts/setup-mongodb.sh && ./scripts/setup-mongodb.sh

echo "🚀 شروع راه‌اندازی MongoDB برای پروژه اچ‌شاپ..."
echo ""

# چک کردن سیستم عامل
OS="$(uname -s)"
case "$OS" in
    Linux*)     OS=Linux;;
    Darwin*)    OS=Mac;;
    CYGWIN*)    OS=Cygwin;;
    MINGW*)     OS=MinGw;;
    *)          OS="Unknown: $OS"
esac

echo "📋 سیستم عامل تشخیص داده شده: $OS"
echo ""

# نصب MongoDB بر اساس سیستم عامل
if [ "$OS" = "Linux" ]; then
    echo "🔧 نصب MongoDB روی لینوکس..."
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    sudo systemctl start mongod
    sudo systemctl enable mongod
    echo "✅ MongoDB نصب و شروع شد"
    
elif [ "$OS" = "Mac" ]; then
    echo "🔧 نصب MongoDB روی مک..."
    if ! command -v brew &> /dev/null; then
        echo "❌ Homebrew نصب نیست. لطفاً اول Homebrew نصب کنید:"
        echo "   /bin/bash -c \"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
    brew tap mongodb/brew
    brew install mongodb-community
    brew services start mongodb-community
    echo "✅ MongoDB نصب و شروع شد"
    
else
    echo "⚠️  سیستم عامل شناسایی نشد یا ویندوز است"
    echo "برای ویندوز، لطفاً MongoDB را به صورت دستی نصب کنید:"
    echo "1. از https://www.mongodb.com/try/download/community دانلود کنید"
    echo "2. نصب کنید"
    echo "3. سرویس را شروع کنید: net start MongoDB"
    exit 1
fi

echo ""
echo "📁 ایجاد پوشه داده‌ها..."
mkdir -p ~/data/db

# چک کردن اتصال
 echo "🔍 چک کردن اتصال به MongoDB..."
sleep 3

if command -v mongo &> /dev/null; then
    if mongo --eval "db.runCommand({ping: 1})" &> /dev/null; then
        echo "✅ اتصال به MongoDB موفق بود!"
    else
        echo "❌ اتصال به MongoDB شکست خورد"
        echo "لطفاً MongoDB را به صورت دستی شروع کنید:"
        if [ "$OS" = "Mac" ]; then
            echo "   brew services start mongodb-community"
        else
            echo "   sudo systemctl start mongod"
        fi
        exit 1
    fi
else
    echo "⚠️  دستور mongo یافت نشد. از MongoDB Compass برای چک کردن استفاده کنید"
fi

echo ""
echo "🎉 راه‌اندازی MongoDB کامل شد!"
echo ""
echo "برای شروع پروژه:"
echo "1. فایل .env.local را ایجاد کنید:"
echo "   MONGODB_URI=mongodb://localhost:27017/echshop"
echo ""
echo "2. پروژه را اجرا کنید:"
echo "   npm run dev"
echo ""
echo "3. اتصال را تست کنید:"
echo "   npx ts-node src/lib/db/test-connection.ts"
