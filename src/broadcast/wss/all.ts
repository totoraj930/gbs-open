import { WebSocketServer } from 'ws';
import { getTimestamp } from '$/tweet/schema';

export const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log(getTimestamp(), 'connection');
});

export function sendToAll(msg: string) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(msg, { binary: false });
    }
  });
}
