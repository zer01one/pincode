const Express = require('express');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const app = Express();

app.use(Express.static(path.join(__dirname, 'public')));
app.use(Express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => console.log('Server started on port: ', PORT));