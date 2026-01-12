#!/usr/bin/env node

const fs = require('fs');

const TYPES = {
  FRONTMATTER: '§F',
  FMKEY: '§K',
  FMVAL: '§V',
  CODE: '§C',
  TERMYNAL: '§T',
  ADMONITION: '§A',
  ADMONMARK: '§Am',
  ADMONKIND: '§Ak',
  ADMONTITLE: '§At',
  ADMONBODY: '§Ab',
  LINK: '§L',
  HEADER: '§H',
  INLINECODE: '§X',
  TABLE: '§B',
  CELL: '§b',
  LISTITEM: '§D',
  LISTTITLE: '§t',
  LISTTITLE_UI: '§tu',
  LISTTEXT: '§e',
  HEADERTEXT: '§h',
  HEADERANCHOR: '§r',
  LINKLABEL: '§w',
  LINKURL: '§u',
  LINKATTR: '§v',
  IMAGEALT: '§ia',
  IMAGEURL: '§iu',
  BOLDMARK: '§s',
  LISTMARK: '§dm',
  CHECKBOX: '§dc',
  TABLEPIPE: '§tp',
  TABLESEP: '§ts',
  TABLEDASH: '§td',
  IDENT: '§id',
};

const nextLetter = (n) => {
  const A = 'abcdefghijklmnopqrstuvwxyz';
  let s = '';
  n++;
  while (n > 0) {
    n--;
    s = A[n % 26] + s;
    n = Math.floor(n / 26);
  }
  return s;
};

const startsWithFence = (line) => {
  const m = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
  if (!m) return null;
  return { fence: m[2], info: (m[3] || '').trim() };
};
const closesFence = (line, fence) => {
  const l = line.replace(/^\s+/, '');
  return l.startsWith(fence) && l.slice(fence.length).trim() === '';
};
const isHeaderLine = (line) => /^(#{1,6})\s+\S/.test(line);

const admStartRE = /^\s*([!?]{3})\s+([A-Za-z][\w-]*)(?:\s+(?:"([^"]*)"|'([^']*)'))?\s*$/;
const isAdmonitionBodyLine = (line) => /^\s*$/.test(line) || /^( {4}|\t)/.test(line);

function isListItem(line) {
  return /^(\s*)([-*+]|(\d+\.))\s+(\[.\]\s+)?\S/.test(line);
}
function splitListMarker(line) {
  const m = line.match(/^(\s*)([-*+]|(\d+\.))\s+(\[.\]\s+)?(.*)$/);
  return m
    ? {
        indent: m[1] || '',
        marker: m[2] || '',
        checkbox: m[4] || '',
        content: m[5] || '',
      }
    : null;
}

const hasPipe = (line) => /\|/.test(line);
const isTableSepRow = (line) =>
  /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);

function splitRowKeepPipes(line) {
  return line.split(/(\|)/);
}

const inlineCodeRE = /`[^`\n]+`/g;
const boldRE = /\*\*(?!\s)(.+?)(?<!\s)\*\*/g;

const tagStartLineRE = /^\[\§[FCTHB]-\d+[a-z]\]$/i;
const tagEndLineRE = /^\[\§[FCTHB]-\d+\/[a-z]\]$/i;

const startTag = (sym, line1, letter = 'a') => `[${sym}-${line1}${letter}]`;
const endTag = (sym, line1, letter = 'a') => `[${sym}-${line1}/${letter}]`;

function stripStrong(s) {
  return s.replace(/^\*\*(.*)\*\*$/, '$1').trim();
}
function stripTicks(s) {
  return s.replace(/^`(.*)`$/, '$1').trim();
}
function hasBackticks(s) {
  return /`/.test(s);
}
function hasUnderscoreOrPath(s) {
  return /[_/\\.-]/.test(s);
}
function hasCamelOrPascal(s) {
  return /[a-z][A-Z]/.test(s);
}
function isAllCapsToken(s) {
  return /^[A-Z0-9_]+$/.test(s) && /[A-Z]/.test(s);
}
function hasDigitsOrSymbols(s) {
  return /[0-9]|[~!@#$%^&*+=|<>?]/.test(s);
}
function isSingleToken(s) {
  return /^\S+$/.test(s);
}

function isUiLikeTitle(titleRaw) {
  let t = stripStrong(titleRaw);
  if (hasBackticks(t)) return true;
  t = stripTicks(t);
  if (hasUnderscoreOrPath(t)) return true;
  if (hasCamelOrPascal(t)) return true;
  if (isSingleToken(t) && (isAllCapsToken(t) || hasDigitsOrSymbols(t))) return true;
  return false;
}

function isIdentifierToken(token) {
  if (!token) return false;
  if (hasBackticks(token)) return false;
  if (hasUnderscoreOrPath(token)) return true;
  if (hasCamelOrPascal(token)) return true;
  if (isSingleToken(token) && (isAllCapsToken(token) || hasDigitsOrSymbols(token))) return true;
  return false;
}

function wrapUiTokensInTitle(title, line1Based, perTypeLetterState) {
  const parts = title.split(/(\s+)/);
  let out = '';
  for (const p of parts) {
    if (/\s+/.test(p)) {
      out += p;
      continue;
    }
    if (!p) continue;

    const token = p;
    const asUi = isUiLikeTitle(token);
    const TITLE_SYM = asUi ? TYPES.LISTTITLE_UI : TYPES.LISTTITLE;

    const lt = nextLetter(perTypeLetterState[TITLE_SYM] ||= 0);
    perTypeLetterState[TITLE_SYM]++;

    let inner = token;
    if (asUi && isIdentifierToken(token)) {
      const il = nextLetter(perTypeLetterState[TYPES.IDENT] ||= 0);
      perTypeLetterState[TYPES.IDENT]++;
      inner = `${startTag(TYPES.IDENT, line1Based, il)}${token}${endTag(TYPES.IDENT, line1Based, il)}`;
    }

    out += `${startTag(TITLE_SYM, line1Based, lt)}${inner}${endTag(TITLE_SYM, line1Based, lt)}`;
  }
  return out;
}

function wrapHeaderContent(line, line1Based) {
  const m = line.match(/^(\s*#{1,6}\s+)(.*?)(\s*\{\s*: ?\s*#[-A-Za-z0-9_]+\s*\}\s*)?$/);
  if (!m) return line;
  const lead = m[1] || '';
  const text = (m[2] || '').trim();
  const anchorRaw = m[3] || '';
  const textWrapped = text
    ? `${startTag(TYPES.HEADERTEXT, line1Based, 'a')}${text}${endTag(TYPES.HEADERTEXT, line1Based, 'a')}`
    : '';
  const anchorWrapped = anchorRaw
    ? `${startTag(TYPES.HEADERANCHOR, line1Based, 'b')}${anchorRaw.trim()}${endTag(TYPES.HEADERANCHOR, line1Based, 'b')}`
    : '';
  const gap = (textWrapped && anchorWrapped) ? ' ' : '';
  return `${lead}${textWrapped}${gap}${anchorWrapped}`;
}

function tagInlineLinkToken(token, line1Based, perTypeLetterState) {
  const m = token.match(/^\[([^\]]*?)\]\(([^)]*?)\)\s*(\{[^}]*\})?\s*$/);
  if (!m) return null;
  const label = m[1] ?? '';
  const url = m[2] ?? '';
  const attrs = m[3] ?? '';

  const wl = nextLetter(perTypeLetterState[TYPES.LINKLABEL] ||= 0);
  perTypeLetterState[TYPES.LINKLABEL]++;
  const ul = nextLetter(perTypeLetterState[TYPES.LINKURL] ||= 0);
  perTypeLetterState[TYPES.LINKURL]++;

  let attrsWrapped = '';
  if (attrs) {
    const vl = nextLetter(perTypeLetterState[TYPES.LINKATTR] ||= 0);
    perTypeLetterState[TYPES.LINKATTR]++;
    attrsWrapped = `${startTag(TYPES.LINKATTR, line1Based, vl)}${attrs}${endTag(TYPES.LINKATTR, line1Based, vl)}`;
  }

  const labelWrapped = `${startTag(TYPES.LINKLABEL, line1Based, wl)}${label}${endTag(TYPES.LINKLABEL, line1Based, wl)}`;
  const urlWrapped = `${startTag(TYPES.LINKURL, line1Based, ul)}${url}${endTag(TYPES.LINKURL, line1Based, ul)}`;

  return `[${labelWrapped}](${urlWrapped})${attrsWrapped}`;
}

function tagImageToken(token, line1Based, perTypeLetterState) {
  const m = token.match(/^!\[([^\]]*?)\]\(([^)\n]*?)\)\s*(\{[^}]*\})?\s*$/);
  if (!m) return null;
  const alt = m[1] ?? '';
  const url = m[2] ?? '';
  const attrs = m[3] ?? '';

  const al = nextLetter(perTypeLetterState[TYPES.IMAGEALT] ||= 0);
  perTypeLetterState[TYPES.IMAGEALT]++;
  const ul = nextLetter(perTypeLetterState[TYPES.IMAGEURL] ||= 0);
  perTypeLetterState[TYPES.IMAGEURL]++;

  let attrsWrapped = '';
  if (attrs) {
    const vl = nextLetter(perTypeLetterState[TYPES.LINKATTR] ||= 0);
    perTypeLetterState[TYPES.LINKATTR]++;
    attrsWrapped = `${startTag(TYPES.LINKATTR, line1Based, vl)}${attrs}${endTag(TYPES.LINKATTR, line1Based, vl)}`;
  }

  const altWrapped = `${startTag(TYPES.IMAGEALT, line1Based, al)}${alt}${endTag(TYPES.IMAGEALT, line1Based, al)}`;
  const urlWrapped = `${startTag(TYPES.IMAGEURL, line1Based, ul)}${url}${endTag(TYPES.IMAGEURL, line1Based, ul)}`;

  return `![${altWrapped}](${urlWrapped})${attrsWrapped}`;
}

function tagLinkPiecesInsideTitle(titleMarkup, line1Based, perTypeLetterState, makeBold) {
  const boldStripped = stripStrong(titleMarkup);
  const lm = boldStripped.match(/^\s*\[([^\]]+)\]\(([^)]*?)\)\s*(\{[^}]*\})?\s*$/);
  if (!lm) return null;
  const label = lm[1] ?? '';
  const url = lm[2] ?? '';
  const attrs = lm[3] ?? '';

  const asUi = isUiLikeTitle(label);
  const TITLE_SYM = asUi ? TYPES.LISTTITLE_UI : TYPES.LISTTITLE;

  const lt = nextLetter(perTypeLetterState[TITLE_SYM] ||= 0);
  perTypeLetterState[TITLE_SYM]++;
  const uu = nextLetter(perTypeLetterState[TYPES.LINKURL] ||= 0);
  perTypeLetterState[TYPES.LINKURL]++;

  let attrsWrapped = '';
  if (attrs) {
    const va = nextLetter(perTypeLetterState[TYPES.LINKATTR] ||= 0);
    perTypeLetterState[TYPES.LINKATTR]++;
    attrsWrapped = `${startTag(TYPES.LINKATTR, line1Based, va)}${attrs}${endTag(TYPES.LINKATTR, line1Based, va)}`;
  }

  let labelInner = label;
  if (asUi && isIdentifierToken(label)) {
    const il = nextLetter(perTypeLetterState[TYPES.IDENT] ||= 0);
    perTypeLetterState[TYPES.IDENT]++;
    labelInner = `${startTag(TYPES.IDENT, line1Based, il)}${label}${endTag(TYPES.IDENT, line1Based, il)}`;
  }

  const labelWrapped = `${startTag(TITLE_SYM, line1Based, lt)}${labelInner}${endTag(TITLE_SYM, line1Based, lt)}`;
  const urlWrapped = `${startTag(TYPES.LINKURL, line1Based, uu)}${url}${endTag(TYPES.LINKURL, line1Based, uu)}`;
  const labelFinal = makeBold ? `**${labelWrapped}**` : labelWrapped;

  return `[${labelFinal}](${urlWrapped})${attrsWrapped}`;
}

function wrapListContent(content, line1Based, perTypeLetterState) {
  const linkTitleRE =
    /^\s*(\*\*\[.*?\]\([^)]*?\)\s*(?:\{[^}]*\})?\*\*|\[.*?\]\([^)]*?\)\s*(?:\{[^}]*\})?)\s*(?::|-|–|—)\s*(.+?)\s*$/;
  const mLink = content.match(linkTitleRE);
  if (mLink) {
    const rawTitle = mLink[1];
    const explanation = mLink[2];
    const makeBold = /^\*\*/.test(rawTitle);
    const rebuilt = tagLinkPiecesInsideTitle(rawTitle, line1Based, perTypeLetterState, makeBold);
    if (rebuilt) {
      const exL = nextLetter(perTypeLetterState[TYPES.LISTTEXT] ||= 0);
      perTypeLetterState[TYPES.LISTTEXT]++;
      const exp =
        `${startTag(TYPES.LISTTEXT, line1Based, exL)}${explanation}${endTag(TYPES.LISTTEXT, line1Based, exL)}`;
      return `${rebuilt}: ${exp}`;
    }
  }
  let m = content.match(/^\s*(\*\*.+?\*\*)\s*(?::|-|–|—)\s*(.+)$/);
  if (m) {
    const titleRaw = m[1];
    const titleInner = stripStrong(titleRaw);
    const asUi = isUiLikeTitle(titleInner);
    const TITLE_SYM = asUi ? TYPES.LISTTITLE_UI : TYPES.LISTTITLE;

    const lt = nextLetter(perTypeLetterState[TITLE_SYM] ||= 0);
    perTypeLetterState[TITLE_SYM]++;
    const lx = nextLetter(perTypeLetterState[TYPES.LISTTEXT] ||= 0);
    perTypeLetterState[TYPES.LISTTEXT]++;

    let titleBody = titleRaw;
    if (asUi && isIdentifierToken(titleInner)) {
      const il = nextLetter(perTypeLetterState[TYPES.IDENT] ||= 0);
      perTypeLetterState[TYPES.IDENT]++;
      const idWrapped =
        `${startTag(TYPES.IDENT, line1Based, il)}${titleInner}${endTag(TYPES.IDENT, line1Based, il)}`;
      titleBody = `**${idWrapped}**`;
    }

    const t =
      `${startTag(TITLE_SYM, line1Based, lt)}${titleBody}${endTag(TITLE_SYM, line1Based, lt)}`;
    const e =
      `${startTag(TYPES.LISTTEXT, line1Based, lx)}${m[2]}${endTag(TYPES.LISTTEXT, line1Based, lx)}`;
    return `${t}: ${e}`;
  }
  const m2 = content.match(/^\s*([^:*–—-][^:–—-]*?)\s*(?::|-|–|—)\s*(.+)$/);
  if (m2) {
    const titleRaw = m2[1].trim();
    const asUi = isUiLikeTitle(titleRaw);
    const TITLE_SYM = asUi ? TYPES.LISTTITLE_UI : TYPES.LISTTITLE;

    const lt = nextLetter(perTypeLetterState[TITLE_SYM] ||= 0);
    perTypeLetterState[TITLE_SYM]++;
    const lx = nextLetter(perTypeLetterState[TYPES.LISTTEXT] ||= 0);
    perTypeLetterState[TYPES.LISTTEXT]++;

    let titleInner = titleRaw;
    if (asUi && isIdentifierToken(titleRaw)) {
      const il = nextLetter(perTypeLetterState[TYPES.IDENT] ||= 0);
      perTypeLetterState[TYPES.IDENT]++;
      titleInner =
        `${startTag(TYPES.IDENT, line1Based, il)}${titleRaw}${endTag(TYPES.IDENT, line1Based, il)}`;
    }

    const l =
      `${startTag(TITLE_SYM, line1Based, lt)}${titleInner}${endTag(TITLE_SYM, line1Based, lt)}`;
    const r =
      `${startTag(TYPES.LISTTEXT, line1Based, lx)}${m2[2].trim()}${endTag(TYPES.LISTTEXT, line1Based, lx)}`;
    return `${l}: ${r}`;
  }
  return content;
}

function wrapInlineTokens(line, line1Based, perTypeLetterState) {
  const linkScan = /(?<!\!)\[[^\]]*?\]\([^\)\n]*?\)\s*(\{[^}]*\})?/g;
  let s = line;
  let out = '';
  let last = 0;
  let m;
  while ((m = linkScan.exec(s)) !== null) {
    const token = m[0];
    const rebuilt = tagInlineLinkToken(token, line1Based, perTypeLetterState);
    out += s.slice(last, m.index) + (rebuilt || token);
    last = linkScan.lastIndex;
  }
  s = out + s.slice(last);

  const imgScan = /!\[[^\]]*?\]\([^\)\n]*?\)\s*(\{[^}]*\})?/g;
  out = '';
  last = 0;
  while ((m = imgScan.exec(s)) !== null) {
    const token = m[0];
    const rebuilt = tagImageToken(token, line1Based, perTypeLetterState);
    out += s.slice(last, m.index) + (rebuilt || token);
    last = imgScan.lastIndex;
  }
  s = out + s.slice(last);

  const wrap = (text, re, sym) => {
    perTypeLetterState[sym] = perTypeLetterState[sym] || 0;
    let m2, out2 = '', last2 = 0;
    while ((m2 = re.exec(text)) !== null) {
      const token = m2[0];
      const letter = nextLetter(perTypeLetterState[sym]++);
      out2 +=
        text.slice(last2, m2.index) +
        startTag(sym, line1Based, letter) +
        token +
        endTag(sym, line1Based, letter);
      last2 = re.lastIndex;
    }
    out2 += text.slice(last2);
    return out2;
  };
  s = wrap(s, inlineCodeRE, TYPES.INLINECODE);

  perTypeLetterState[TYPES.BOLDMARK] = perTypeLetterState[TYPES.BOLDMARK] || 0;
  s = s.replace(boldRE, (full, inner) => {
    const openL = nextLetter(perTypeLetterState[TYPES.BOLDMARK]++);
    const closeL = nextLetter(perTypeLetterState[TYPES.BOLDMARK]++);
    const open = `${startTag(TYPES.BOLDMARK, line1Based, openL)}**${endTag(TYPES.BOLDMARK, line1Based, openL)}`;
    const close = `${startTag(TYPES.BOLDMARK, line1Based, closeL)}**${endTag(TYPES.BOLDMARK, line1Based, closeL)}`;
    return `${open}${inner}${close}`;
  });

  return s;
}

function insertBlockTags(lines) {
  const out = [];
  const n = lines.length;
  let i = 0;

  if (n > 0 && lines[0].trim() === '---') {
    const start1 = 1;
    let j = 1;
    while (j < n && lines[j].trim() !== '---') j++;
    const endIdx = j < n ? j : n - 1;
    const end1 = endIdx + 1;

    out.push(startTag(TYPES.FRONTMATTER, start1));
    for (let k = 0; k <= endIdx; k++) {
      const L = lines[k];
      if (k === 0 || k === endIdx) {
        out.push(L);
        continue;
      }
      const kv = L.match(/^(\s*)([A-Za-z0-9_-]+)(\s*:\s*)(.*)$/);
      if (kv) {
        const ln = k + 1;
        const pre = kv[1] || '';
        const key = kv[2] || '';
        const sep = kv[3] || ': ';
        const val = kv[4] || '';
        const keyWrapped = `${startTag(TYPES.FMKEY, ln, 'a')}${key}${endTag(TYPES.FMKEY, ln, 'a')}`;
        const valWrapped = `${startTag(TYPES.FMVAL, ln, 'b')}${val}${endTag(TYPES.FMVAL, ln, 'b')}`;
        out.push(`${pre}${keyWrapped}${sep}${valWrapped}`);
      } else {
        out.push(L);
      }
    }
    out.push(endTag(TYPES.FRONTMATTER, end1));
    i = endIdx + 1;
  }

  while (i < n) {
    const line = lines[i];

    const open = startsWithFence(line);
    if (open) {
      const start1 = i + 1;
      const infoLower = (open.info || '').toLowerCase();
      const isTerm =
        infoLower.includes('termynal') ||
        infoLower.includes('{.termynal}') ||
        /\bterminal\b/.test(infoLower);
      const SYM = isTerm ? TYPES.TERMYNAL : TYPES.CODE;

      let j = i + 1;
      while (j < n && !closesFence(lines[j], open.fence)) j++;
      const endIdx = j < n ? j : n - 1;
      const end1 = endIdx + 1;

      out.push(startTag(SYM, start1));
      for (let k = i; k <= endIdx; k++) out.push(lines[k]);
      out.push(endTag(SYM, end1));

      i = endIdx + 1;
      continue;
    }

    const mAdm = line.match(admStartRE);
    if (mAdm) {
      const start1 = i + 1;
      const marker = mAdm[1] || '???';
      const kind = mAdm[2] || '';
      const title = (mAdm[3] != null ? mAdm[3] : mAdm[4]) || '';
      const perType = {};

      let j = i + 1;
      while (j < n && isAdmonitionBodyLine(lines[j])) j++;
      const endIdx = j - 1 >= i ? j - 1 : i;
      const end1 = endIdx + 1;

      out.push(startTag(TYPES.ADMONITION, start1));
      const mk = `${startTag(TYPES.ADMONMARK, start1, 'a')}${marker}${endTag(TYPES.ADMONMARK, start1, 'a')}`;
      const kd = `${startTag(TYPES.ADMONKIND, start1, 'b')}${kind}${endTag(TYPES.ADMONKIND, start1, 'b')}`;

      let titleLine = '';
      if (title) {
        const wrappedTitle = wrapUiTokensInTitle(title, start1, perType);
        titleLine = ` "${startTag(TYPES.ADMONTITLE, start1, 'c')}${wrappedTitle}${endTag(TYPES.ADMONTITLE, start1, 'c')}"`;
      }
      out.push(`${mk} ${kd}${titleLine}`);

      if (endIdx > i) {
        out.push(startTag(TYPES.ADMONBODY, start1, 'd'));
        for (let k = i + 1; k <= endIdx; k++) out.push(lines[k]);
        out.push(endTag(TYPES.ADMONBODY, start1, 'd'));
      }
      out.push(endTag(TYPES.ADMONITION, end1));

      i = endIdx + 1;
      continue;
    }

    if (isHeaderLine(line)) {
      const ln = i + 1;
      out.push(startTag(TYPES.HEADER, ln));
      out.push(wrapHeaderContent(line, ln));
      out.push(endTag(TYPES.HEADER, ln));
      i++;
      continue;
    }

    if (hasPipe(line) && i + 1 < n && isTableSepRow(lines[i + 1])) {
      const start1 = i + 1;
      let j = i + 2;
      while (j < n && hasPipe(lines[j]) && lines[j].trim() !== '') j++;
      const endIdx = j - 1;
      const end1 = endIdx + 1;

      out.push(startTag(TYPES.TABLE, start1));
      for (let r = i; r <= endIdx; r++) {
        const row = lines[r];

        if (isTableSepRow(row)) {
          const ln = r + 1;
          const inner = splitRowKeepPipes(row)
            .map(tok => {
              if (tok === '|') {
                const l = 'a';
                return `${startTag(TYPES.TABLEPIPE, ln, l)}|${endTag(TYPES.TABLEPIPE, ln, l)}`;
              }
              return tok.replace(/(:?-{3,}:?)/g, (mDash) => {
                const d = 'b';
                return `${startTag(TYPES.TABLEDASH, ln, d)}${mDash}${endTag(TYPES.TABLEDASH, ln, d)}`;
              });
            })
            .join('');
          out.push(`${startTag(TYPES.TABLESEP, ln, 'c')}${inner}${endTag(TYPES.TABLESEP, ln, 'c')}`);
          continue;
        }

        const tokens = splitRowKeepPipes(row);
        let letterCounter = 0;
        const ln = r + 1;
        let rebuilt = '';
        for (const tok of tokens) {
          if (tok === '|') {
            const l = nextLetter(letterCounter++);
            rebuilt += `${startTag(TYPES.TABLEPIPE, ln, l)}|${endTag(TYPES.TABLEPIPE, ln, l)}`;
          } else {
            if (tok === '') continue;
            const l = nextLetter(letterCounter++);
            rebuilt += `${startTag(TYPES.CELL, ln, l)}${tok}${endTag(TYPES.CELL, ln, l)}`;
          }
        }
        out.push(rebuilt);
      }
      out.push(endTag(TYPES.TABLE, end1));
      i = endIdx + 1;
      continue;
    }

    if (isListItem(line)) {
      const ln = i + 1;
      const parts = splitListMarker(line);
      const perTypeLetterState = {};
      let content = parts.content;
      content = wrapListContent(content, ln, perTypeLetterState);

      const lmL = 'a';
      const markerWrapped = `${startTag(TYPES.LISTMARK, ln, lmL)}${parts.marker}${endTag(TYPES.LISTMARK, ln, lmL)}`;

      let cbWrapped = '';
      if (parts.checkbox) {
        const cbL = 'b';
        cbWrapped = `${startTag(TYPES.CHECKBOX, ln, cbL)}${parts.checkbox}${endTag(TYPES.CHECKBOX, ln, cbL)}`;
      }

      const rebuilt = `${parts.indent}${markerWrapped} ${cbWrapped}${content}`;
      out.push(startTag(TYPES.LISTITEM, ln));
      out.push(rebuilt);
      out.push(endTag(TYPES.LISTITEM, ln));
      i++;
      continue;
    }

    out.push(line);
    i++;
  }

  return out;
}

function processMarkdown(md) {
  const rawLines = md.split(/\r?\n/);

  const withBlocks = insertBlockTags(rawLines);

  let inCode = false,
    inTerm = false,
    inFront = false,
    inHeader = false,
    inTable = false;

  const final = withBlocks.map((ln, idx) => {
    if (tagStartLineRE.test(ln)) {
      const sym = ln.slice(1, 3);
      if (sym === '§C') inCode = true;
      if (sym === '§T') inTerm = true;
      if (sym === '§F') inFront = true;
      if (sym === '§H') inHeader = true;
      if (sym === '§B') inTable = true;
      return ln;
    }
    if (tagEndLineRE.test(ln)) {
      const sym = ln.slice(1, 3);
      if (sym === '§C') inCode = false;
      if (sym === '§T') inTerm = false;
      if (sym === '§F') inFront = false;
      if (sym === '§H') inHeader = false;
      if (sym === '§B') inTable = false;
      return ln;
    }
    if (inCode || inTerm || inFront || inHeader || inTable) return ln;

    const perTypeLetterState = {};
    return wrapInlineTokens(ln, idx + 1, perTypeLetterState);
  });

  return final.join('\n');
}

function tagContent(content) {
  return processMarkdown(content);
}

if (require.main === module) {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) {
    console.error('Usage: tagger.js <input> <output>');
    process.exit(1);
  }
  const text = fs.readFileSync(input, 'utf8');
  const tagged = tagContent(text);
  fs.writeFileSync(output, tagged, 'utf8');
} else {
  module.exports = tagContent;
}
