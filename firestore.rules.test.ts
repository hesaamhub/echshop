import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import {
  computeDiscountAmount,
  isValidId,
  sanitizeOrderInput,
  sanitizeTicketInput,
} from "./src/lib/firebase/validators"

const rulesText = fs.readFileSync(path.join(process.cwd(), "firestore.rules"), "utf8")

test("firestore.rules enforces global safety net and zero-trust primitives", () => {
  assert.match(rulesText, /match \/\{document=\*\*\} \{\s*allow read, write: if false;\s*\}/)
  assert.match(rulesText, /request\.auth\.token\.email_verified == true/)
  assert.match(rulesText, /request\.auth\.token\.email == 'hesaam\.shadzhi@gmail\.com'/)
  assert.match(rulesText, /function isValidId\(id\)/)
})

test("Dirty Dozen #1 & #2: order identity spoofing and admin self-elevation are blocked in rules", () => {
  assert.match(rulesText, /incoming\(\)\.userId == request\.auth\.uid/)
  assert.match(rulesText, /match \/admins\/\{adminId\}[\s\S]*?allow create: if isAdmin\(\)/)
})

test("Dirty Dozen #3 & #4: email spoofing and shadow fields on user profile are blocked", () => {
  assert.match(rulesText, /function isVerifiedUser\(\) \{\s*return isSignedIn\(\) && request\.auth\.token\.email_verified == true;\s*\}/)
  assert.match(rulesText, /data\.keys\(\)\.hasOnly\(\['uid', 'displayName', 'plan', 'walletBalance', 'favorites', 'createdAt', 'updatedAt'\]\)/)
})

test("Dirty Dozen #5: free wallet balance injection is blocked for non-admins", () => {
  assert.match(rulesText, /incoming\(\)\.walletBalance == 0/)
  assert.match(rulesText, /affectedKeys\(\)\.hasOnly\(\['displayName', 'updatedAt'\]\)/)
  assert.match(rulesText, /affectedKeys\(\)\.hasOnly\(\['favorites', 'updatedAt'\]\)/)
})

test("Dirty Dozen #6: ID poisoning rejects >128 chars or invalid characters", () => {
  assert.equal(isValidId("a".repeat(129)), false)
  assert.equal(isValidId("bad$id"), false)
  assert.equal(isValidId("ECH-10482_ok"), true)
})

test("Dirty Dozen #7 & #8: inventory and private PII are isolated", () => {
  assert.match(rulesText, /match \/inventory\/\{itemId\}[\s\S]*?allow get: if isAdmin\(\)/)
  assert.match(rulesText, /match \/inventory\/\{itemId\}[\s\S]*?allow list: if isAdmin\(\)/)
  assert.match(rulesText, /match \/private\/\{docId\}[\s\S]*?allow list: if false;/)
})

test("Dirty Dozen #9 & #10: state shortcutting and terminal state mutation are locked", () => {
  assert.match(rulesText, /incoming\(\)\.status == 'pending'/)
  assert.match(rulesText, /existing\(\)\.status != 'closed'/)
  assert.match(rulesText, /existing\(\)\.status == 'pending'/)
})

test("Dirty Dozen #11 & #12: oversized payloads, forged timestamps, and orphan messages are blocked", () => {
  assert.throws(() =>
    sanitizeTicketInput({
      userId: "userA",
      userName: "کاربر",
      subject: "x".repeat(5000),
      department: "پشتیبانی فنی",
      priority: "زیاد",
      body: "متن",
    }),
  )
  assert.throws(() =>
    sanitizeOrderInput({
      userId: "userA",
      customerName: "کاربر",
      customerEmail: "user@example.com",
      productId: "p-1",
      productTitle: "Spotify",
      planId: "pl-1",
      planTitle: "1m",
      delivery: "upgrade",
      quantity: 99,
      amount: 1000,
      paymentMethod: "gateway",
    }),
  )
  assert.match(rulesText, /incoming\(\)\.createdAt == request\.time/)
  assert.match(rulesText, /exists\(\/databases\/\$\(database\)\/documents\/tickets\/\$\(ticketId\)\)/)
})

test("computeDiscountAmount respects active flag, limit, minOrder, and non-negative total", () => {
  assert.equal(
    computeDiscountAmount(1_000_000, {
      type: "percent",
      value: 20,
      minOrder: 200_000,
      isActive: true,
      used: 10,
      limit: 100,
    }),
    200_000,
  )
  assert.equal(
    computeDiscountAmount(100_000, {
      type: "fixed",
      value: 250_000,
      minOrder: 0,
      isActive: true,
      used: 0,
      limit: 10,
    }),
    100_000,
  )
  assert.equal(
    computeDiscountAmount(1_000_000, {
      type: "percent",
      value: 50,
      minOrder: 0,
      isActive: false,
      used: 0,
      limit: 10,
    }),
    0,
  )
})
