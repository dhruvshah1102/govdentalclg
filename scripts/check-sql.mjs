// Fails the build if any SQL statement uses a double-quoted string literal.
// SQLite accepted "Published" as a value; Postgres treats it as a column name,
// so the query fails at runtime. Use single quotes for values: 'Published'.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const SQL_WITH_DOUBLE_QUOTES = /(INSERT\s+INTO|UPDATE\s+\w+\s+SET|SELECT\s|DELETE\s+FROM|VALUES\s*\()[^`'\n]*"[^"\n]*"/i;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx|js|mjs)$/.test(name)) out.push(p);
  }
  return out;
}

let bad = 0;
for (const file of walk('src')) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (SQL_WITH_DOUBLE_QUOTES.test(line)) {
      console.error(`${file}:${i + 1}: double-quoted value in SQL (use single quotes): ${line.trim()}`);
      bad++;
    }
  });
}
if (bad) process.exit(1);
console.log('check-sql: OK');
