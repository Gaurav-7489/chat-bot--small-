const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const detectIntent = require('./brain/matcher')

const app = express()

app.use(cors())
app.use(express.json())

/* =========================
   DATABASE (AUTO INIT)
   ========================= */

const db = new sqlite3.Database('./chatbot.db')

db.serialize(() => {
  // Create table if not exists
  db.run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      intent TEXT,
      reply TEXT
    )
  `)

  // Seed data ONLY if table is empty
  db.get('SELECT COUNT(*) AS count FROM responses', (err, row) => {
    if (err) {
      console.error('DB error:', err)
      return
    }

    if (row.count === 0) {
      const stmt = db.prepare(
        'INSERT INTO responses (intent, reply) VALUES (?, ?)'
      )

      stmt.run('greeting', 'hi')
      stmt.run('greeting', 'hello')
      stmt.run('greeting', 'hey')
      stmt.run('bye', 'bye')
      stmt.run('bye', 'see you')
      stmt.run('thanks', "you're welcome")
      stmt.run('default', "i don't understand")

      stmt.finalize()
      console.log('DB seeded')
    }
  })
})

/* =========================
   CHAT ENDPOINT
   ========================= */

app.post('/chat', (req, res) => {
  const input = req.body.message
  if (!input) {
    return res.json({ reply: 'empty message' })
  }

  const intent = detectIntent(input)

  db.all(
    'SELECT reply FROM responses WHERE intent = ?',
    [intent],
    (err, rows) => {
      if (err || rows.length === 0) {
        return res.json({ reply: 'error' })
      }

      const reply =
        rows[Math.floor(Math.random() * rows.length)].reply

      res.json({ reply })
    }
  )
})

/* =========================
   SERVER START
   ========================= */

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
