import { mailbox } from '../dist'

/**
  These tests should cover most of what's important. However, they don't cover the 'obsolete' parts of the spec. One day more testing should be done to target that directly. It's not a big concern though because the obsolete part of the spec only applies to emails from the punchcard days.
 */

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true

  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  const [max, min] = keysA.length > keysB.length ? [a, b] : [b, a]

  for (const key of Object.keys(max)) {
    if (!deepEqual(max[key], min[key])) {
      return false
    }
  }

  return true
}

type Pass = Exclude<ReturnType<typeof mailbox>, { errors: string[] }>
type Fail = Exclude<ReturnType<typeof mailbox>, Pass>

function test({
  actual,
  expect,
  label,
}: {
  actual: Pass | Fail
  expect: Pass | Fail
  label: string
}) {
  if (actual.ok !== expect.ok) {
    throw new Error(
      `Test failed, errors: \n\n${JSON.stringify(actual, null, 2)}`,
    )
  }
  const expected_str = JSON.stringify(expect, null, 2)
  const actual_str = JSON.stringify(actual, null, 2)
  const result = deepEqual(expect, actual)

  if (!result) {
    throw new Error(
      `[${label}] Test failed: \n\nexpected: ${expected_str}\n\nactual: ${actual_str}`,
    )
  }
  if (label) console.log(`'${label}' passed`)
}

test({
  actual: mailbox('bob@example.com'),
  expect: {
    ok: true,
    addr: 'bob@example.com',
    local: 'bob',
    domain: 'example.com',
  },
  label: 'bob@example.com',
})

test({
  actual: mailbox('<bob@example.com>'),
  expect: {
    ok: true,
    addr: 'bob@example.com',
    local: 'bob',
    domain: 'example.com',
  },
  label: '<bob@example.com>',
})

test({
  actual: mailbox('Bob Hope <bob@example.com>'),
  expect: {
    ok: true,
    addr: 'bob@example.com',
    local: 'bob',
    domain: 'example.com',
    name: 'Bob Hope',
  },
  label: 'Bob Hope <bob@example.com>',
})

test({
  actual: mailbox('"Bob Hope" <bob@example.com>'),
  expect: {
    ok: true,
    addr: 'bob@example.com',
    local: 'bob',
    domain: 'example.com',
    name: 'Bob Hope',
  },
  label: '"Bob Hope" <bob@example.com>',
})

test({
  actual: mailbox('Bruce "The Boss" Springsteen <bruce@example.com>'),
  expect: {
    ok: true,
    addr: 'bruce@example.com',
    local: 'bruce',
    domain: 'example.com',
    name: 'Bruce "The Boss" Springsteen',
  },
  label: 'Bruce "The Boss" Springsteen <bruce@example.com>',
})

test({
  actual: mailbox('bob@example'),
  expect: { ok: true, addr: 'bob@example', local: 'bob', domain: 'example' },
  label: 'bob@example',
})

test({
  actual: mailbox('BOB@example'),
  expect: { ok: true, addr: 'BOB@example', local: 'BOB', domain: 'example' },
  label: 'BOB@example',
})

test({
  actual: mailbox('bob@EXAMPLE'),
  expect: { ok: true, addr: 'bob@EXAMPLE', local: 'bob', domain: 'EXAMPLE' },
  label: 'bob@EXAMPLE',
})

test({
  actual: mailbox('a.b.c@d.e.f.g'),
  expect: {
    ok: true,
    addr: 'a.b.c@d.e.f.g',
    local: 'a.b.c',
    domain: 'd.e.f.g',
  },
  label: 'a.b.c@d.e.f.g',
})

test({
  actual: mailbox('"site.local.test:1111"@example.com'),
  expect: {
    ok: true,
    addr: '"site.local.test:1111"@example.com',
    local: '"site.local.test:1111"',
    domain: 'example.com',
  },
  label: 'quoted with illegal characters',
})

test({
  actual: mailbox('"hello, world"@example.com'),
  expect: {
    ok: true,
    addr: '"hello, world"@example.com',
    local: '"hello, world"',
    domain: 'example.com',
  },
  label: 'quoted with illegal characters 2',
})

test({
  actual: mailbox('foo bar baz'),
  expect: {
    ok: false,
    errors: [
      '{"pos":{"overallPos":11,"line":1,"offset":11},"expmatches":[{"kind":"RegexMatch","literal":"[A-Za-z0-9!#$%&\\\\x27\\\\*\\\\+\\\\-\\\\/=?^_\\\\`{|}~]","negated":false},{"kind":"RegexMatch","literal":"\\\\x20","negated":false},{"kind":"RegexMatch","literal":"\\\\x09","negated":false},{"kind":"RegexMatch","literal":"\\\\r\\\\n","negated":false},{"kind":"RegexMatch","literal":"\\\\(","negated":false},{"kind":"RegexMatch","literal":"\\\\x22","negated":false},{"kind":"RegexMatch","literal":"<","negated":false}]}',
    ],
  },
  label: 'Invalid mailbox should fail to parse',
})
