const bodyParser = require('body-parser');
const app = require('./app');
const routes = require('./routes');

const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const apiRoutes = app.Router();

app.post('/users', routes.users.createUser);

app.listen(PORT, () => console.log(`conectado na porta ${PORT}`));
