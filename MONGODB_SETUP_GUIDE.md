# 🚀 راهنمای کامل راه‌اندازی MongoDB برای پروژه اچ‌شاپ

## 📌 مقدمه

برای اجرای کامل پروژه، نیاز به یک **دیتابیس MongoDB** دارید. این راهنما به شما نشان می‌دهد چگونه MongoDB را راه‌اندازی کنید.

---

## 🔧 روش 1: راه‌اندازی MongoDB محلی (برای توسعه)

### مرحله 1: نصب MongoDB

#### روی ویندوز:
1. **دانلود MongoDB Community Server**
   - به آدرس [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) بروید
   - نسخه مناسب ویندوز را دانلود کنید
   - نصب کنید (تمام گزینه‌ها را به صورت پیش‌فرض انتخاب کنید)

2. **ایجاد پوشه داده‌ها**
   ```cmd
   mkdir C:\\data\\db
   ```

3. **شروع سرویس MongoDB**
   ```cmd
   "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe" --dbpath="C:\\data\\db"
   ```

4. **یا از طریق سرویس ویندوز:**
   ```cmd
   net start MongoDB
   ```

#### روی مک:
1. **نصب با Homebrew**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```

2. **شروع سرویس**
   ```bash
   brew services start mongodb-community
   ```

#### روی لینوکس (Ubuntu/Debian):
1. **نصب MongoDB**
   ```bash
   sudo apt-get install -y mongodb-org
   ```

2. **شروع سرویس**
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

---

## ☁️ روش 2: استفاده از MongoDB Atlas (برای تولید)

### مرحله 1: ایجاد حساب کاربری
1. به آدرس [https://www.mongodb.com/atlas/database](https://www.mongodb.com/atlas/database) بروید
2. ثبت‌نام کنید (رایگان)

### مرحله 2: ایجاد یک Cluster رایگان
1. روی **Build a Database** کلیک کنید
2. **Free Tier** را انتخاب کنید
3. **AWS** یا **Google Cloud** را انتخاب کنید
4. **Region** را به **Frankfurt (eu-central-1)** یا نزدیک‌ترین منطقه تغییر دهید
5. روی **Create Cluster** کلیک کنید (约 5-10 دقیقه طول می‌کشد)

### مرحله 3: ایجاد کاربر دیتابیس
1. به تب **Database Access** بروید
2. روی **Add New Database User** کلیک کنید
3. **Authentication Method**: Password
4. **Username**: `echshop`
5. **Password**: رمز قوی انتخاب کنید (مثلا `EchShop@2024!`)
6. **Database User Privileges**: Read and Write to any database
7. روی **Add User** کلیک کنید

### مرحله 4: اضافه کردن IP آدرس
1. به تب **Network Access** بروید
2. روی **Add IP Address** کلیک کنید
3. **Add Current IP Address** را انتخاب کنید
4. یا **0.0.0.0/0** را برای دسترسی از همه جا وارد کنید (برای توسعه)
5. روی **Confirm** کلیک کنید

### مرحله 5: دریافت Connection String
1. روی **Connect** کلیک کنید
2. **Connect your application** را انتخاب کنید
3. **Driver**: Node.js
4. **Version**: 4.1 or later
5. Connection String را کپی کنید (مثل: `mongodb+srv://echshop:<password>@cluster0.xxxxx.mongodb.net/`)

### مرحله 6: تنظیم در پروژه
فایل `.env.local` را ویرایش کنید:
```env
MONGODB_URI=mongodb+srv://echshop:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/echshop?retryWrites=true&w=majority
```

---

## 🧪 تست اتصال

بعد از راه‌اندازی MongoDB، اتصال را تست کنید:

```bash
# نصب ts-node اگر ندارید
npm install -g ts-node

# اجرا کردن تست
npx ts-node src/lib/db/test-connection.ts
```

### نتایج مورد انتظار:
- ✅ اتصال به MongoDB موفق بود
- ✅ دسته‌بندی ایجاد شد
- ✅ کاربر ایجاد شد
- ✅ محصول ایجاد شد
- ✅ داده‌ها خوانده شدند
- ✅ داده‌های تست پاک شدند

---

## 🔐 تنظیم متغیرهای محیطی

فایل `.env.local` را در ریشه پروژه ایجاد یا ویرایش کنید:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/echshop

# یا برای Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/echshop?retryWrites=true&w=majority

# NextAuth.js
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ **توجه:** فایل `.env.local` در `.gitignore` قرار دارد و در GitHub آپلود نمی‌شود.

---

## 🛠️ عیب‌یابی

### مشکل: اتصال برقرار نمی‌شود
**خطا:** `ECONNREFUSED`

**راه‌حل:**
1. مطمئن شوید MongoDB در حال اجرا است
2. چک کنید که پورت 27017 باز است
3. برای ویندوز: `net start MongoDB`
4. برای مک/لینوکس: `sudo systemctl status mongod`

---

### مشکل: احراز هویت شکست خورد
**خطا:** `Authentication failed`

**راه‌حل:**
1. نام کاربری و رمز را در Connection String چک کنید
2. مطمئن شوید کاربر دسترسی خواندن/نوشتن دارد

---

### مشکل: دیتابیس یافت نشد
**خطا:** `Database not found`

**راه‌حل:**
1. دیتابیس به صورت خودکار ایجاد می‌شود
2. اولین بار که اتصال برقرار شود، دیتابیس `echshop` ایجاد می‌شود

---

## 📚 منابع مفید

- [سند MongoDB](https://www.mongodb.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [MongoDB Compass (UI)](https://www.mongodb.com/products/compass)

---

## ✅ آماده‌اید!

بعد از راه‌اندازی MongoDB، می‌توانید:
1. پروژه را اجرا کنید: `npm run dev`
2. به آدرس `http://localhost:3000` بروید
3. از سیستم احراز هویت استفاده کنید

**سوالی دارید؟** با من در میان بگذارید! 😊
