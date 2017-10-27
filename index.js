import app from './app';
import http from 'http';

const PORT = process.env.PORT || 7235;
const server = http.createServer(app);

// App start
server.listen(PORT, err => {
  console.log(err || `Server listening on port ${PORT}`);
});
