const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const detectIntent = require('./brain/matcher')

const app = express()
const db = new sqlite3.Database('./chatbot.db')

app.use(cors())
app.use(express.json())

app.post('/chat', (req, res) => {
  const input = req.body.message
  if (!input) return res.json({ reply: 'empty message' })

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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})
