import { mailbox } from './dist'
import vm from 'node:vm'

const sandbox = { mailbox, console }
vm.createContext(sandbox)

const examples = [
  `mailbox('<bob@example.com>')`,
  `mailbox('Bob Hope <bob@example.com>')`,
  `mailbox('"Bob Hope" <bob@example.com>')`,
  `mailbox('Bruce "The Boss" Springsteen <bruce@example.com>')`,
  `mailbox('bob@example')`,
  `mailbox('BOB@example')`,
  `mailbox('bob@EXAMPLE')`,
  `mailbox('a.b.c@d.e.f.g')`,
  `mailbox('"site.local.test:1111"@example.com')`,
  `mailbox('"hello, world"@example.com')`,
  `mailbox('foo bar baz')`,
]

for (const e of examples) {
  const result = vm.runInContext(e, sandbox)
  // Print the result as a commented block
  const commented = JSON.stringify(result, null, 2)
    .split('\n')
    .map((line) => `// ${line}`)
    .join('\n')

  console.log(commented)
  console.log(`console.log(${e})\n`)
}
