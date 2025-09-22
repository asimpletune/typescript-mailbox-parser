# typescript-mailbox-parser

Parse an email address (i.e. [mailbox](https://www.rfc-editor.org/rfc/rfc5322#section-3.4)) into it main parts: display name, local portion, domain.

Also:

* it has 0 dependencies
* is 100% based off [the spec](https://www.rfc-editor.org/rfc/rfc5322#section-3.4)
* is compatible in browser or node (maybe Deno too?)
* Preserves case sensitivity

⚠️ THIS LIBRARY IS NOT ABANDONED ⚠️

While there are few commits and not much activity, sometimes things are just done and work.

Examples:

```ts
import { mailbox } from './src'

/**
 * {  local: 'bob', domain: 'example.com' }
 */
mailbox('bob@example.com')

/**
 * {  name: undefined, local: 'bob', domain: 'example.com', addr: 'bob@example.com'  }
 */
mailbox('<bob@example.com>')

/**
   {
      name: 'Bruce Springsteen',
      local: 'bruce',
      domain: 'springsteen.com',
      addr: 'bruce@springsteen.com'
   }
 */
mailbox('Bruce Springsteen <bruce@springsteen.com>')


/**
   {
      name: 'Bruce "The Boss" Springsteen',
      local: 'bruce',
      domain: 'springsteen.com',
      addr: 'bruce@springsteen.com'
   }
 */
mailbox('Bruce "The Boss" Springsteen <bruce@springsteen.com>')
```

## Installation and Usage

To install `npm install typescript-mailbox-parser`

Then to use it you just need to import it and call the `mailbox` function on a string. If successful it will return an object representing the parts of the email address (mailbox).

```ts
import { mailbox } from 'typescript-mailbox-parser'

const email = mailbox('hello@example.com')
```

If the string supplied is not a valid email address (mailbox), then it will return an array of error strings.

```ts
import { mailbox } from 'typescript-mailbox-parser'

/**
  [
    '{"pos":{"overallPos":11,"line":1,"offset":11},"expmatches":[{"kind":"RegexMatch","literal":"[A-Za-z0-9!#$%&\\\\x27\\\\*\\\\+\\\\-\\\\/=?^_\\\\`{|}~]","negated":false},{"kind":"RegexMatch","literal":"\\\\x20","negated":false},{"kind":"RegexMatch","literal":"\\\\x09","negated":false},{"kind":"RegexMatch","literal":"\\\\r\\\\n","negated":false},{"kind":"RegexMatch","literal":"\\\\(","negated":false},{"kind":"RegexMatch","literal":"\\\\x22","negated":false},{"kind":"RegexMatch","literal":"<","negated":false}]}'
  ]
 */
const email = mailbox('foo bar baz')
```

For development

```sh
# run tests
npm run test

# build the parser from the grammar
npm run build:parser

# compile the parser and output to dist
npm run build:compile

# combine build:parser and build:compile
npm run build:all

# run formatter
npm run fmt
```

## Notes

This _should_ in theory work with 100% accuracy, as the logic is based off the [rfc5322](https://www.rfc-editor.org/rfc/rfc5322) specification... however mistakes can always be made. Please file an issue if there are any bugs.