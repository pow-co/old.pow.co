
import io from 'socket.io-client';

import { useEffect, useState } from 'react';

const tokenMeetLiveSocket = io('wss://tokenmeet.live', {
  transports: ['websocket']
});

const arcadeSocket = io('wss://fluttergame.fun', {
  transports: ['websocket']
});

export function useArcadeWebsocket() {

  const [isConnected, setIsConnected] = useState(arcadeSocket.connected);
  const [lastPong, setLastPong] = useState<any>(null);

useEffect(() => {
  arcadeSocket.on('connect', () => {
    console.log('arcade.websocket.connect')
    setIsConnected(true);
  });

  arcadeSocket.on('disconnect', () => {
    console.log('arcade.websocket.disconnect')
    setIsConnected(false);
  });

  arcadeSocket.on('pong', () => {
    setLastPong(new Date().toISOString());
  });

  arcadeSocket.on('message', (data: any) => {
    console.log('arcade.websocket.message', data)
  })

  arcadeSocket.on('*', (data: any) => {
    console.log('arcade.websocket.*', data)
  })

  return () => {
    arcadeSocket.off('*');
  };
}, []);

const sendPing = () => {
    arcadeSocket.emit('ping');
}

  return {
      isConnected,
      socket: arcadeSocket
  }

}