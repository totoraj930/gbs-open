import { wss as wssAll } from './wss/all';
import { createServer } from 'http';
import { parse } from 'node:url';

export const server = createServer();

server.on('upgrade', (req, socket, head) => {
  try {
    const { pathname } = parse(req.url!);
    if (pathname === '/all') {
      wssAll.handleUpgrade(req, socket, head, (ws) => {
        wssAll.emit('connection', ws, req);
      });
      return;
    }
  } catch {}
  socket.destroy();
});

server.on('request', (req, res) => {
  try {
    res.write(
      'gbs-open-project\nsee...\nhttps://github.com/totoraj930/gbs-open'
    );
    return res.end();
  } catch (err) {
    console.log(err);
  }
  res.statusCode = 500;
  return res.end('Server Error');
});
