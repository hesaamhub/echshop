import dbConnect from "./connect";

async function testConnection() {
  try {
    await dbConnect();
    console.log("✅ اتصال به MongoDB موفق بود!");
    process.exit(0);
  } catch (error) {
    console.error("❌ خطا در اتصال به MongoDB:", error);
    process.exit(1);
  }
}

testConnection();
