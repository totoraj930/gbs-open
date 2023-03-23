import { WebSocketServer, WebSocket } from 'ws';
import { getTimestamp } from '@/tweet/schema';
import { RaidTweetMini } from '@/redis/schema';

export const wss = new WebSocketServer({ noServer: true });

const aliveFlag = new Map<WebSocket, boolean>();

/**
 * PingPong
 */
const interval = setInterval(() => {
  aliveFlag.forEach((flag, ws) => {
    if (!flag) {
      ws.terminate();
      aliveFlag.delete(ws);
      return;
    }
    aliveFlag.set(ws, false);
    ws.ping();
  });
}, 1000 * 10);

wss.on('connection', (ws, req) => {
  console.log(getTimestamp(), 'connection', req.socket.remoteAddress);
  aliveFlag.set(ws, true);

  sendToSocket(ws, { type: 'time', data: Date.now() });

  ws.on('pong', () => {
    aliveFlag.set(ws, true);
  });
  ws.on('close', () => {
    aliveFlag.delete(ws);
  });
});

wss.on('close', () => {
  clearInterval(interval);
});

export type TweetMessage = {
  type: 't';
  data: RaidTweetMini;
};
export type TimeMessage = {
  type: 'time';
  data: number;
};

export type Message = TweetMessage | TimeMessage;

export function sendToAll(msg: Message) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  });
}

export function sendToSocket(ws: WebSocket, msg: Message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(msg));
  }
}
