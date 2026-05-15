# Security Specification for Siri-Dhanya Hub

## 1. Data Invariants
- A user can only read and write their own profile document.
- Profile documents must contain a first name and last name.
- Timestamps must be validated using `request.time`.
- Email/Phone must be valid strings.

## 2. The "Dirty Dozen" Payloads (Selection)
1.  **Identity Spoofing**: Attempt to write to `/users/abc` while authenticated as `xyz`.
2.  **Shadow Fields**: Attempt to add `isAdmin: true` to user profile.
3.  **Type Mismatch**: Send `firstName: 123` (integer).
4.  **Size Attack**: Send `firstName` with 1MB of text.
5.  **Timestamp Fraud**: Send `createdAt: "2000-01-01"`.
6.  **Unauthenticated Write**: Write to users count while logged out.
7.  **Blanket Read**: Query all users without a filter.
8.  **ID Poisoning**: Use a 2KB string as `userId`.
9.  **Email Overwrite**: Change email after creation without verification.
10. **State Skipping**: (Not applicable yet, no complex states).
11. **Malicious ID characters**: Use `userId` with special characters to break paths.
12. **Quota Exhaustion**: Rapidly create many documents (limited by rules).

## 3. Test Runner (Draft)
A `firestore.rules.test.ts` would verify that `PERMISSION_DENIED` is returned for the above.
