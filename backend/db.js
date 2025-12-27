const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./chatbot.db')

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      intent TEXT,
      reply TEXT
    )
  `)

  const stmt = db.prepare(
    'INSERT INTO responses (intent, reply) VALUES (?, ?)'
  )

  stmt.run('greeting', 'hi')
  stmt.run('greeting', 'hello')
  stmt.run('bye', 'bye')
  stmt.run('thanks', "you're welcome")
  stmt.run('default', "i don't understand")

  stmt.finalize()
})

db.close()
