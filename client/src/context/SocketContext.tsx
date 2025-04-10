import { createContext, useEffect, useState, useRef, ReactNode } from 'react';
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
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const reconnectTimeoutRef = useRef<number | null>(null);

  // Setup WebSocket connection
  useEffect(() => {
    // Always connect regardless of authentication
    
    const connectWebSocket = () => {
      // Clear any existing reconnection timeouts
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Close any existing connection
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket at:', wsUrl);
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        
        // Send authentication info
        if (user) {
          ws.send(JSON.stringify({
            type: 'authenticate',
            userId: user.id
          }));
        }
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          
          // Handle specific message types here
          if (data.type === 'error') {
            toast({
              title: 'WebSocket Error',
              description: data.message,
              variant: 'destructive'
            });
          }
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onclose = (event) => {
        console.log(`WebSocket disconnected with code: ${event.code}, reason: ${event.reason}`);
        setIsConnected(false);
        
        // Try to reconnect after 3 seconds if abnormal closure
        if (event.code !== 1000 && event.code !== 1001) {
          console.log('Attempting to reconnect WebSocket in 3 seconds...');
          reconnectTimeoutRef.current = window.setTimeout(() => {
            connectWebSocket();
          }, 3000);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      socketRef.current = ws;
      setSocket(ws);
    };
    
    connectWebSocket();
    
    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current !== null) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user]);
  
  const sendMessage = (data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
    } else {
      console.error('WebSocket is not connected - cannot send message');
      toast({
        title: 'Connection Issue',
        description: 'Unable to communicate with the server. Trying to reconnect...',
        variant: 'destructive'
      });
    }
  };
  
  const startMatchSimulation = (teamId: number) => {
    // Always authenticated
    
    if (!isConnected) {
      toast({
        title: 'Connection Issue',
        description: 'Not connected to the server. Please try again in a moment.',
        variant: 'destructive'
      });
      return;
    }
    
    console.log(`Starting match simulation for team ID: ${teamId}`);
    sendMessage({
      type: 'start_match',
      userId: user.id,
      teamId: teamId
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
