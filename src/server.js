const app = require('./app')

const {PORT} = require('./config')

console.log(process.env.API_TOKEN)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})