const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

async function main() {
  const db = await open({
    filename: path.join(__dirname, '..', 'db', 'govclg.sqlite'),
    driver: sqlite3.Database
  });

  console.log("Updating gallery table with professional images...");
  await db.run(
    "UPDATE gallery SET image_url = 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&h=400&q=80' WHERE album_name = 'Smart Preclinical Lab'"
  );
  await db.run(
    "UPDATE gallery SET image_url = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&h=400&q=80' WHERE album_name = 'OPD Clinical Theater'"
  );
  await db.run(
    "UPDATE gallery SET image_url = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&h=400&q=80' WHERE album_name = 'Academic College Campus'"
  );
  await db.run(
    "UPDATE gallery SET image_url = 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&h=400&q=80' WHERE album_name = 'College Cultural Festival'"
  );
  console.log("Gallery table updated successfully!");
}

main().catch(console.error);
