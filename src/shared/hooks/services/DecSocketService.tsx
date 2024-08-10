import { useDataStore, useDecSocketStore } from "@/shared";

const URL = import.meta.env.VITE_DEC_SERVER_URL;

export const DecSocketService = () => {
  const encClientId = useDataStore((state) => state.encClientId);

  const setSocket = useDecSocketStore((state) => state.setSocket);
  const socket = useDecSocketStore((state) => state.socket);
  const addMessage = useDecSocketStore((state) => state.addMessage);

  const token = useDataStore((state) => state.token);

  const onOpen = (id: string) => {
    //create socket
    const newSocket = new WebSocket(`${URL}:ws/${id}`);

    //setting socket
    newSocket.onclose = (error) => {
      console.log(error);
    };
    newSocket.onerror = (error) => {
      console.log(error);
    };

    newSocket.onmessage = (event: MessageEvent<string>) => {
      addMessage(JSON.parse(event.data));
    };

    //send id message
    if (newSocket.readyState === WebSocket.OPEN && encClientId) {
      newSocket.send(
        JSON.stringify({
          mode: "ID",
          id: encClientId,
        })
      );
    } else {
      console.log("There is something wrong with dec server socket");
      return;
    }

    setSocket(newSocket);
  };

  const onClose = () => {
    socket?.close();
  };

  const sendMessage = (data: Socket.DecServerMessageDto) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    } else console.log("There is something wrong with dec server socket");
  };

  const sendToken = () => {
    if (token)
      sendMessage({
        mode: "TOKEN",
        token: token,
      });
  };

  return { onOpen, onClose, sendMessage, sendToken };
};
