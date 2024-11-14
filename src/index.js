const app = require('./app');

// configure port to make the application on heroku also
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
