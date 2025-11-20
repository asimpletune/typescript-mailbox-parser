import {
  addr_spec,
  ASTKinds,
  atom,
  display_name,
  domain,
  domain_literal,
  dot_atom,
  dot_atom_text,
  local_part,
  mailbox,
  named_addr,
  obs_domain,
  obs_local_part,
  obs_NO_WS_CTL,
  obs_phrase,
  obs_phrase_$0,
  obs_qp,
  parse,
  qcontent,
  qtext,
  quoted_pair,
  quoted_string,
  word,
} from '../generated/parser'

export type MailboxParseResult =
  | { ok: false; errors: string[] }
  | { ok: true; addr: string; name?: string; local: string; domain: string }

export function mailbox(mb: string): MailboxParseResult {
  const mailbox = parse(mb)
  if (mailbox.errs.length > 0)
    return { ok: false, errors: mailbox.errs.map((e) => JSON.stringify(e)) }
  else {
    const parts = mailbox_2_parts(mailbox.ast!)
    return {
      ok: true,
      ...parts,
      addr: `${parts.local}@${parts.domain}`,
    }
  }
}

function mailbox_2_parts(input: mailbox): {
  name?: string
  local: string
  domain: string
} {
  if (input.kind == ASTKinds.named_addr) return named_addr_2_parts(input)
  else if (input.kind == ASTKinds.addr_spec) return addr_spec_2_parts(input)
  else throw new Error('not implemented')
}
function named_addr_2_parts(input: named_addr) {
  const name = input.name == null ? undefined : display_name_2_str(input.name)
  const addr = addr_spec_2_parts(input.angle_addr.addr)
  return { name, ...addr }
}
function addr_spec_2_parts(input: addr_spec) {
  const local = local_part_2_str(input.local)
  const domain = domain_part_2_str(input.domain)
  return { local, domain }
}

function display_name_2_str(input: display_name): string {
  if (input.kind == ASTKinds.phrase_1) {
    const words = input.words
    const head = word_2_str(words[0], false)
    const tail = words.slice(1).map((w) => word_2_str(w, true))
    return [head, ...tail].join(' ')
  } else if (input.kind == ASTKinds.phrase_2) {
    return obs_phrase_2_string(input.obs_phrase)
  } else {
    throw new Error('not implemented')
  }
}

function obs_phrase_2_string(input: obs_phrase): string {
  const head = word_2_str(input.head, false)
  const tail = input.tail.map((el) => {
    const foo: obs_phrase_$0 = el
    if (typeof el === 'string') {
      return el
    } else if (el.kind == ASTKinds.CFWS_1 || el.kind == ASTKinds.CFWS_2)
      return ''
    else if (el.kind == ASTKinds.quoted_string)
      return quoted_string_2_str(el, true)
    else if (el.kind == ASTKinds.atom) return atom_2_str(el)
    else throw new Error('not implemented')
  })
  return [head, ...tail].join('')
}

function local_part_2_str(input: local_part): string {
  if (input.kind == ASTKinds.dot_atom) {
    return dot_atom_2_str(input)
  } else if (input.kind == ASTKinds.quoted_string) {
    return quoted_string_2_str(input, true)
  } else if (input.kind == ASTKinds.obs_local_part) {
    return obs_local_part_2_str(input)
  } else {
    throw new Error('not implemented')
  }
}

function word_2_str(input: word, include_quotes: boolean): string {
  if (input.kind == ASTKinds.quoted_string) {
    return quoted_string_2_str(input, include_quotes)
  } else if (input.kind == ASTKinds.atom) {
    return atom_2_str(input)
  } else {
    throw new Error('not implemented')
  }
}

function obs_local_part_2_str(input: obs_local_part): string {
  const head = word_2_str(input.head, false)
  const tail = input.tail.map((el) => word_2_str(el.text, true)).join(input.sep)
  return [head, ...tail].join(input.sep)
}

function quoted_string_2_str(
  input: quoted_string,
  include_quotes: boolean,
): string {
  const middle = input.chars
    .map((el) => {
      const space = el.space === null ? '' : ' '
      const char = qcontent_2_str(el.char)
      return space + char
    })
    .join('')
  if (include_quotes) return input.open_quote + middle + input.close_quote
  else return middle
}

function qcontent_2_str(input: qcontent): string {
  if (typeof input === 'string') {
    return qtext_2_str(input)
  } else if (input.kind == ASTKinds.quoted_pair_1) {
    return quoted_pair_2_str(input)
  }
  throw ''
}

function qtext_2_str(input: qtext): string {
  if (typeof input === 'string') return input
  else return obs_NO_WS_CTL_2_str(input.obs_qtext)
}

function quoted_pair_2_str(input: quoted_pair): string {
  if (input.kind == ASTKinds.quoted_pair_1) {
    return input.char
  } else if (input.kind == ASTKinds.obs_qp) {
    return obs_qp_2_str(input)
  } else {
    throw new Error('not implemented')
  }
}

function obs_qp_2_str(input: obs_qp): string {
  // there aren't really any printable characters in this
  return ''
}

// `obs_NO_WS_CTL` is basically escaped null character, control characters, or new lines
function obs_NO_WS_CTL_2_str(input: obs_NO_WS_CTL): string {
  return ''
}

function atom_2_str(input: atom): string {
  return input.chars.join('')
}

function dot_atom_2_str(input: dot_atom): string {
  return dot_atom_text_2_str(input.text)
}

function dot_atom_text_2_str(input: dot_atom_text): string {
  const head = input.head.join('')
  const tail = input.tail.map((el) => el.chars.join(''))
  return [head, ...tail].join(input.sep)
}

function domain_part_2_str(input: domain): string {
  if (input.kind == ASTKinds.dot_atom) {
    return dot_atom_2_str(input)
  } else if (input.kind == ASTKinds.domain_literal) {
    return domain_literal_2_str(input)
  } else if (input.kind == ASTKinds.obs_domain) {
    return obs_domain_2_str(input)
  } else {
    throw new Error('not implemented')
  }
}

function domain_literal_2_str(input: domain_literal): string {
  return input.chars.join('')
}

function obs_domain_2_str(input: obs_domain) {
  const head = input.head.chars.join('')
  const tail = input.tail.map((el) => el.text.chars.join(''))
  return [head, ...tail].join('')
}
