import { wss as wssAll } from './wss/all';
import { createServer } from 'http';
import { parse } from 'url';

export const server = createServer();

server.on('upgrade', (req, socket, head) => {
  try {
    const { pathname } = parse(req.url!);
    if (pathname === '/stream/all') {
      wssAll.handleUpgrade(req, socket, head, (ws) => {
        ws.emit('connection', ws, req);
      });
      return;
    }
  } catch {}
  socket.destroy();
});

server.on('request', (req, res) => {
  res.write('gbs-open-project\nsee...\nhttps://github.com/totoraj930/gbs-open');
  res.end();
});
