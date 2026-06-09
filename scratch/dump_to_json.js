const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function main() {
  const db = await open({
    filename: path.join(__dirname, '..', 'db', 'govclg.sqlite'),
    driver: sqlite3.Database
  });

  const tables = ['settings', 'hero_slides', 'announcements', 'stats', 'departments', 'faculty', 'news_events', 'tenders', 'downloads', 'gallery'];
  const dump = {};

  for (const table of tables) {
    try {
      const rows = await db.all(`SELECT * FROM ${table}`);
      dump[table] = rows;
      console.log(`Dumped ${rows.length} rows from table '${table}'`);
    } catch (err) {
      console.error(`Error dumping table '${table}':`, err.message);
    }
  }

  const outputPath = path.join(__dirname, '..', 'db', 'fallback_data.json');
  fs.writeFileSync(outputPath, JSON.stringify(dump, null, 2), 'utf8');
  console.log(`Saved database dump to ${outputPath}`);
}

main().catch(console.error);
