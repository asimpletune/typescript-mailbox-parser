import { mailbox } from 'typescript-mailbox-parser'

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

type Pass = Exclude<ReturnType<typeof mailbox>, string[]>
type Fail = Exclude<ReturnType<typeof mailbox>, Pass>

function test_pos({
  actual,
  expect,
  label,
}: {
  actual: Fail | Pass
  expect: Pass
  label: string
}) {
  if (Array.isArray(actual)) {
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

test_pos({
  actual: mailbox('bob@example.com'),
  expect: { addr: 'bob@example.com', local: 'bob', domain: 'example.com' },
  label: 'bob@example.com',
})

test_pos({
  actual: mailbox('<bob@example.com>'),
  expect: { addr: 'bob@example.com', local: 'bob', domain: 'example.com' },
  label: '<bob@example.com>',
})

test_pos({
  actual: mailbox('Bob Hope <bob@example.com>'),
  expect: {
    addr: 'bob@example.com',
    local: 'bob',
    domain: 'example.com',
    name: 'Bob Hope',
  },
  label: 'Bob Hope <bob@example.com>',
})

test_pos({
  actual: mailbox('"Bob Hope" <bob@example.com>'),
  expect: {
    addr: 'bob@example.com',
    local: 'bob',
    domain: 'example.com',
    name: 'Bob Hope',
  },
  label: '"Bob Hope" <bob@example.com>',
})

test_pos({
  actual: mailbox('Bruce "The Boss" Springsteen <bruce@example.com>'),
  expect: {
    addr: 'bruce@example.com',
    local: 'bruce',
    domain: 'example.com',
    name: 'Bruce "The Boss" Springsteen',
  },
  label: 'Bruce "The Boss" Springsteen <bruce@example.com>',
})

test_pos({
  actual: mailbox('bob@example'),
  expect: { addr: 'bob@example', local: 'bob', domain: 'example' },
  label: 'bob@example',
})

test_pos({
  actual: mailbox('BOB@example'),
  expect: { addr: 'BOB@example', local: 'BOB', domain: 'example' },
  label: 'BOB@example',
})

test_pos({
  actual: mailbox('bob@EXAMPLE'),
  expect: { addr: 'bob@EXAMPLE', local: 'bob', domain: 'EXAMPLE' },
  label: 'bob@EXAMPLE',
})

test_pos({
  actual: mailbox('a.b.c@d.e.f.g'),
  expect: { addr: 'a.b.c@d.e.f.g', local: 'a.b.c', domain: 'd.e.f.g' },
  label: 'a.b.c@d.e.f.g',
})
