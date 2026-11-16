# Security Specification & Payload TDD (`firestore.rules`)

## 1. Data Invariants

1. **Public Catalog Integrity**: `categories`, `products`, `posts`, and `site_settings` are readable by storefront visitors, but mutations (`create`, `update`, `delete`) require a verified admin (`isAdmin()`).
2. **Inventory Credential Isolation**: `inventory/{itemId}` holds raw account credentials and gift codes. Non-admins are strictly forbidden from reading, listing, creating, updating, or deleting any inventory document.
3. **PII Split Collection Isolation**: User PII (`email`, `phone`, `nationalId`) lives under `/users/{userId}/private/profile` and is readable/writable only by `request.auth.uid == userId` (with verified email) or `isAdmin()`.
4. **Privilege Escalation Prevention**: Users cannot create or mutate `/admins/{adminId}`, cannot set `walletBalance > 0` or arbitrary `plan` values on profile creation, and cannot modify `walletBalance` directly except via valid top-up/purchase rules or admin updates.
5. **Order Ownership & State Integrity**: A signed-in user can only create an order for `request.resource.data.userId == request.auth.uid` with `status == 'pending'` (or `'paid'` only when paying from wallet in future server-checked flow; for client rules, initial status must be `'pending'` and `deliveryCredentialsText` cannot be self-assigned by non-admin). Only admins can transition orders to `'delivered'`, `'refunded'`, or attach `deliveryCredentialsText`.
6. **Ticket & Subcollection Master Gate**: A user can only read/create tickets where `userId == request.auth.uid`. Messages under `/tickets/{ticketId}/messages/{messageId}` check the parent ticket via `get(/databases/$(database)/documents/tickets/$(ticketId))` to ensure `senderId == request.auth.uid` and either ticket ownership or `isAdmin()`.
7. **Strict Keys, Lengths, and Server Timestamps**: Every document write passes `isValidId(id)` regex (`^[a-zA-Z0-9_-]+$`), required/allowed `keys().hasAll(...)` + `keys().hasOnly(...)`, string `.size()` bounds matching `firebase-blueprint.json`, and `request.time` server timestamp equality.
8. **Secure List Queries**: `allow list` on `orders`, `tickets`, `product_requests`, `contact_messages`, `inventory`, `discounts`, and `users` enforces ownership (`resource.data.userId == request.auth.uid`) or `isAdmin()` without `get()`/`exists()` inside `allow list` where avoidable (admin list uses `isAdmin()`).

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Identity Spoofing on Order**: Unprivileged user A (`uid: "userA"`) attempts `create` on `/orders/ord_1` with `userId: "userB"`. Expected: `PERMISSION_DENIED`.
2. **Self-Assigned Admin Role**: Unprivileged user A attempts `create` on `/admins/userA` with `{ uid: "userA", email: "usera@example.com", role: "superadmin" }`. Expected: `PERMISSION_DENIED`.
3. **Email Spoofing Attack**: User with `email: "hesaam.shadzhi@gmail.com"` and `email_verified: false` attempts admin `write` on `/products/p-1`. Expected: `PERMISSION_DENIED`.
4. **Shadow Field Injection on User Profile**: User A attempts `create` on `/users/userA` including ghost field `isAdmin: true` or `role: "admin"`. Expected: `PERMISSION_DENIED`.
5. **Free Wallet Balance Injection**: User A attempts `create` on `/users/userA` with `walletBalance: 99999999` or updates `walletBalance` from `0` to `5000000`. Expected: `PERMISSION_DENIED`.
6. **ID Poisoning (Resource Exhaustion)**: User attempts `create` on `/orders/<1500-char-id>` or `/orders/bad$id`. Expected: `PERMISSION_DENIED`.
7. **Inventory Credential Snooping**: Signed-in non-admin user attempts `get` or `list` on `/inventory` to steal unsold account passwords. Expected: `PERMISSION_DENIED`.
8. **PII Blanket Read**: Signed-in non-admin user A attempts `get` on `/users/userB/private/profile`. Expected: `PERMISSION_DENIED`.
9. **State Shortcutting on Order**: User A attempts `create` on `/orders/ord_2` with `status: "delivered"` or `update` to `status: "delivered"` with fake credentials. Expected: `PERMISSION_DENIED`.
10. **Terminal State Mutation**: User A attempts `update` on a `closed` ticket `/tickets/tk_1` or `delivered` order `/orders/ord_1`. Expected: `PERMISSION_DENIED`.
11. **Value Poisoning / Oversized String**: User A attempts `create` on `/tickets/tk_1` with `subject` of 5000 characters (exceeding `maxLength: 160`) or `priority: "INVALID"`. Expected: `PERMISSION_DENIED`.
12. **Timestamp Forgery / Orphaned Subcollection**: User A attempts `create` on `/tickets/nonexistent_ticket/messages/msg_1` or sends a client-forged `createdAt` not matching `request.time`. Expected: `PERMISSION_DENIED`.

## 3. Test Runner

Verified via `firestore.rules.test.ts` (`npx --yes tsx --test firestore.rules.test.ts`) and `npx eslint firestore.rules`.
