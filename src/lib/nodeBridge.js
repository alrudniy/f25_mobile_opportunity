import nodejs from 'nodejs-mobile-react-native';

let started = false;
const listeners = new Map();

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

export function startNode() {
  if (started) return;
  nodejs.start('main.js'); // runs nodejs-assets/nodejs-project/main.js
  nodejs.channel.addListener('message', (msg) => {
    try {
      const data = JSON.parse(msg);
      if (data && data.id && listeners.has(data.id)) {
        const { resolve, reject } = listeners.get(data.id);
        listeners.delete(data.id);
        if (data.status === 'ok') resolve(data.result);
        else reject(new Error(data.error || 'RPC error'));
      }
    } catch (e) {
      // ignore unparsed messages
    }
  }, this);
  started = true;
}

export function rpc(type, payload) {
  if (!started) startNode();
  return new Promise((resolve, reject) => {
    const id = uuid();
    listeners.set(id, { resolve, reject });
    nodejs.channel.send(JSON.stringify({ id, type, payload }));
  });
}
