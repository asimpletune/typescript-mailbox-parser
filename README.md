# typescript-mailbox-parser

Parse an email address (i.e. [mailbox](https://www.rfc-editor.org/rfc/rfc5322#section-3.4)) into it main parts: display name, local portion, domain.

Also:

* it has 0 dependencies
* is 100% based off [the spec](https://www.rfc-editor.org/rfc/rfc5322#section-3.4)
* is compatible in browser or node (maybe Deno too?)
* Preserves case sensitivity

⚠️ THIS LIBRARY IS NOT ABANDONED ⚠️

While there _may_ be few commits or little activity, the code from this project is almost entirely derived from the email [rfc](https://www.rfc-editor.org/rfc/rfc5322#section-3.4) spec, and it therefore benefits from all the very mature work that has gone into those efforts.

Examples:

```ts
import { mailbox } from 'typescript-mailbox-parser'

// {
//   "ok": true,
//   "local": "bob",
//   "domain": "example.com",
//   "addr": "bob@example.com"
// }
console.log(mailbox('<bob@example.com>'))

// {
//   "ok": true,
//   "name": "Bob Hope",
//   "local": "bob",
//   "domain": "example.com",
//   "addr": "bob@example.com"
// }
console.log(mailbox('Bob Hope <bob@example.com>'))

// {
//   "ok": true,
//   "name": "Bob Hope",
//   "local": "bob",
//   "domain": "example.com",
//   "addr": "bob@example.com"
// }
console.log(mailbox('"Bob Hope" <bob@example.com>'))

// {
//   "ok": true,
//   "name": "Bruce \"The Boss\" Springsteen",
//   "local": "bruce",
//   "domain": "example.com",
//   "addr": "bruce@example.com"
// }
console.log(mailbox('Bruce "The Boss" Springsteen <bruce@example.com>'))

// {
//   "ok": true,
//   "local": "bob",
//   "domain": "example",
//   "addr": "bob@example"
// }
console.log(mailbox('bob@example'))

// {
//   "ok": true,
//   "local": "BOB",
//   "domain": "example",
//   "addr": "BOB@example"
// }
console.log(mailbox('BOB@example'))

// {
//   "ok": true,
//   "local": "bob",
//   "domain": "EXAMPLE",
//   "addr": "bob@EXAMPLE"
// }
console.log(mailbox('bob@EXAMPLE'))

// {
//   "ok": true,
//   "local": "a.b.c",
//   "domain": "d.e.f.g",
//   "addr": "a.b.c@d.e.f.g"
// }
console.log(mailbox('a.b.c@d.e.f.g'))

// {
//   "ok": true,
//   "local": "\"site.local.test:1111\"",
//   "domain": "example.com",
//   "addr": "\"site.local.test:1111\"@example.com"
// }
console.log(mailbox('"site.local.test:1111"@example.com'))

// {
//   "ok": true,
//   "local": "\"hello, world\"",
//   "domain": "example.com",
//   "addr": "\"hello, world\"@example.com"
// }
console.log(mailbox('"hello, world"@example.com'))

// {
//   "ok": false,
//   "errors": [
//     "{\"pos\":{\"overallPos\":11,\"line\":1,\"offset\":11},\"expmatches\":[{\"kind\":\"RegexMatch\",\"literal\":\"[A-Za-z0-9!#$%&\\\\x27\\\\*\\\\+\\\\-\\\\/=?^_\\\\`{|}~]\",\"negated\":false},{\"kind\":\"RegexMatch\",\"literal\":\"\\\\x20\",\"negated\":false},{\"kind\":\"RegexMatch\",\"literal\":\"\\\\x09\",\"negated\":false},{\"kind\":\"RegexMatch\",\"literal\":\"\\\\r\\\\n\",\"negated\":false},{\"kind\":\"RegexMatch\",\"literal\":\"\\\\(\",\"negated\":false},{\"kind\":\"RegexMatch\",\"literal\":\"\\\\x22\",\"negated\":false},{\"kind\":\"RegexMatch\",\"literal\":\"<\",\"negated\":false}]}"
//   ]
// }
console.log(mailbox('foo bar baz'))
```

## Installation and Usage

To install `npm install typescript-mailbox-parser`

Then to use it you just need to import it and call the `mailbox` function on a string.

```ts
import { mailbox } from 'typescript-mailbox-parser'

const email = mailbox('hello@example.com')
```

It returns the following type

```ts
type MailboxParseResult =
  | { ok: false; errors: string[] }
  | { ok: true; addr: string; name?: string; local: string; domain: string }
```

In other words, if successful it will return an object representing the parts of the email address (mailbox):

```ts
import { mailbox } from 'typescript-mailbox-parser'

// {
//   ok: true,
//   name: 'Bruce "The Boss" Springsteen',
//   local: 'bruce',
//   domain: 'example.com',
//   addr: 'bruce@example.com'
// }
console.log(mailbox('Bruce "The Boss" Springsteen <bruce@example.com>'))
```

If unsuccessful it will return an object with an `errors` field containing an array of error messages as strings:

```ts
import { mailbox } from 'typescript-mailbox-parser'

// {
//   ok: false,
//   errors: [
//     '{"pos":{"overallPos":11,"line":1,"offset":11},"expmatches":[{"kind":"RegexMatch","literal":"[A-Za-z0-9!#$%&\\\\x27\\\\*\\\\+\\\\-\\\\/=?^_\\\\`{|}~]","negated":false},{"kind":"RegexMatch","literal":"\\\\x20","negated":false},{"kind":"RegexMatch","literal":"\\\\x09","negated":false},{"kind":"RegexMatch","literal":"\\\\r\\\\n","negated":false},{"kind":"RegexMatch","literal":"\\\\(","negated":false},{"kind":"RegexMatch","literal":"\\\\x22","negated":false},{"kind":"RegexMatch","literal":"<","negated":false}]}'
//   ]
// }
const email = mailbox('foo bar baz')
```

For development

```sh
# run tests
npm test

# build the parser from the grammar
npm run build:parser

# compile the parser and output to dist
npm run build:compile

# combine build:parser and build:compile
npm run build:all

# generate the examples used in the README
npm run docs:examples

# run formatter
npm run fmt
```

## Notes

This _should_ in theory work with 100% accuracy, as the logic is based off the [rfc5322](https://www.rfc-editor.org/rfc/rfc5322) specification. Please file an issue if there are any bugs.