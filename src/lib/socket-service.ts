"use client";

import { getAccessToken } from "@/api/api-client";
import { ESOCKET_NAMESPACE } from "@/constants/socket";
import {
  ESOCKET_GLOBAL_EVENTS,
  IUserClientToServerEvents,
  IUserServerToClientEvents,
} from "@/types/user";
import { Socket, io } from "socket.io-client";
import { EventsMap } from "@socket.io/component-emitter";
import {
  INotificationClientToServerEvents,
  INotificationServerToClientEvents,
} from "@/types/notification";

// Define type for socket service
interface SocketService {
  user: Socket;
  notification: Socket;
  reconnect: () => void;
}

const createSocket = <
  ServerEvents extends EventsMap,
  ClientEvents extends EventsMap,
>(
  namespace: string,
): Socket<ServerEvents, ClientEvents> => {
  const token = getAccessToken();
  const socket = io(`${process.env.NEXT_PUBLIC_BASE_API_URL}${namespace}`, {
    auth: {
      token: `Bearer ${token}`,
    },
    // parser: customParser
  });

  // Update auth token on specific event
  socket.on(ESOCKET_GLOBAL_EVENTS.UPDATE_USER_AUTH, () => {
    socket.auth = {
      token: `Bearer ${token}`,
    };
  });

  // Update auth token on reconnection
  socket.on("reconnect", () => {
    socket.auth = {
      token: `Bearer ${token}`,
    };
  });

  // Alternative approach using reconnection attempt
  socket.on("reconnect_attempt", () => {
    socket.auth = {
      token: `Bearer ${token}`,
    };
  });

  return socket;
};

const userSocket = createSocket<
  IUserServerToClientEvents,
  IUserClientToServerEvents
>(ESOCKET_NAMESPACE.user);

const notificationSocket = createSocket<
  INotificationServerToClientEvents,
  INotificationClientToServerEvents
>(ESOCKET_NAMESPACE.notification);

// Function to reconnect socket with new token
const reconnectSocket = () => {
  if (userSocket && typeof userSocket.disconnect === "function") {
    userSocket.auth = {
      token: `Bearer ${getAccessToken()}`,
    };
    userSocket.disconnect().connect();
  }
  if (
    notificationSocket &&
    typeof notificationSocket.disconnect === "function"
  ) {
    notificationSocket.auth = {
      token: `Bearer ${getAccessToken()}`,
    };
    notificationSocket.disconnect().connect();
  }
};

const RedflagSocket: SocketService = {
  user: userSocket,
  notification: notificationSocket,
  reconnect: reconnectSocket,
};

export default RedflagSocket;
