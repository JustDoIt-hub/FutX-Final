import {
  createContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (data: any) => void;
  startMatchSimulation: (teamId: number) => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => {},
  startMatchSimulation: () => {},
});

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);

  const { user } = useAuth();
  const { toast } = useToast();

  const connectWebSocket = () => {
    if (reconnectTimeoutRef.current !== null) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
    }

    const wsUrl =
      import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

    console.log('Connecting to WebSocket at:', wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);

      if (user?.id) {
        ws.send(
          JSON.stringify({
            type: 'authenticate',
            userId: user.id,
          })
        );
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('📨 WebSocket message received:', data);

        if (data.type === 'error') {
          toast({
            title: 'WebSocket Error',
            description: data.message,
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('❌ Failed to parse WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.warn(
        `⚠️ WebSocket disconnected (code: ${event.code}, reason: ${event.reason})`
      );
      setIsConnected(false);

      if (event.code !== 1000 && event.code !== 1001) {
        console.log('🔄 Reconnecting in 3 seconds...');
        reconnectTimeoutRef.current = window.setTimeout(() => {
          connectWebSocket();
        }, 3000);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
    };

    socketRef.current = ws;
    setSocket(ws);
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      setSocket(null);
      setIsConnected(false);
    };
  }, [user?.id]);

  const sendMessage = (data: any) => {
    if (
      socketRef.current &&
      socketRef.current.readyState === WebSocket.OPEN
    ) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      toast({
        title: 'Connection Issue',
        description:
          'Unable to send message. WebSocket is not connected.',
        variant: 'destructive',
      });
    }
  };

  const startMatchSimulation = (teamId: number) => {
    if (!isConnected || !user?.id) {
      toast({
        title: 'Not Connected',
        description:
          'You are not connected to the server. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    console.log(`▶️ Starting match simulation for team ${teamId}`);
    sendMessage({
      type: 'start_match',
      userId: user.id,
      teamId,
    });
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        sendMessage,
        startMatchSimulation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
