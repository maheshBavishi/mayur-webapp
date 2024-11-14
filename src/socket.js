import socketIOClient from "socket.io-client";

const localdata = JSON.parse(localStorage.getItem("token"));


const SOCKET_URL = "https://api.wepro.rejoicehub.com";
let socket = null;
if (localdata) {
  socket = socketIOClient(SOCKET_URL, {
    extraHeaders: {
      authorization: localdata,
      "ngrok-skip-browser-warning": "1234",
    },
  });
}

export const connectSocket = () => {
  if (localdata) {
    socket = socketIOClient(SOCKET_URL, {
      extraHeaders: {
        authorization: localdata,
        "ngrok-skip-browser-warning": "1234",
      },
    });
  }
};
export const getSocket = () => {
  return socket;
};
