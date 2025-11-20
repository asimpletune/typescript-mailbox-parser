# Changelog

## Next

## 0.0.2 (2025-11-20)

- Improve support for quoted strings in the local portion of an email
- Export the `mailbox` function by default
- Return a discriminated union instead of a success object or array of error strings
- Automate generating the example code used in the README
- Add explicit license

## 0.0.1 (2025-09-23)

- Document how it's used and why there won't be many updates
- Write a wrapper around the mailbox parse result to create an API
- Tree shake the RFC 5322 grammar to isolate just the mailbox part