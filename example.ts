import { mailbox } from './src'

/**
 * { local: 'bob', domain: 'example.com', addr: 'bob@example.com' }
 */
console.log(mailbox('bob@example.com'))

/**
   {
      name: undefined,
      local: 'bob',
      domain: 'example.com',
      addr: 'bob@example.com'
   }
 */
console.log(mailbox('<bob@example.com>'))

/**
   {
      name: 'Bruce Springsteen',
      local: 'bruce',
      domain: 'springsteen.com',
      addr: 'bruce@springsteen.com'
   }
 */
console.log(mailbox('Bruce Springsteen <bruce@springsteen.com>'))

/**
   {
      name: 'Bruce "The Boss" Springsteen',
      local: 'bruce',
      domain: 'springsteen.com',
      addr: 'bruce@springsteen.com'
   }
 */
console.log(mailbox('Bruce "The Boss" Springsteen <bruce@springsteen.com>'))

/**
  [
    '{"pos":{"overallPos":11,"line":1,"offset":11},"expmatches":[{"kind":"RegexMatch","literal":"[A-Za-z0-9!#$%&\\\\x27\\\\*\\\\+\\\\-\\\\/=?^_\\\\`{|}~]","negated":false},{"kind":"RegexMatch","literal":"\\\\x20","negated":false},{"kind":"RegexMatch","literal":"\\\\x09","negated":false},{"kind":"RegexMatch","literal":"\\\\r\\\\n","negated":false},{"kind":"RegexMatch","literal":"\\\\(","negated":false},{"kind":"RegexMatch","literal":"\\\\x22","negated":false},{"kind":"RegexMatch","literal":"<","negated":false}]}'
  ]
 */
console.log(mailbox('foo bar baz'))
