const net = require("net");

async function tcpPing({ url, port, timeout }) {
  const startTime = Date.now();

  const pingResponse = {};

  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    socket.connect(parseInt(port), url, () => {
      pingResponse.responseTime = Date.now() - startTime;
      pingResponse.up = true;
      socket.destroy();
      resolve(pingResponse);
    });
    socket.on("error", (e) => {
      pingResponse.responseTime = Date.now() - startTime;
      pingResponse.up = false;
      pingResponse.error = e.message;
      socket.destroy();
      resolve(pingResponse);
    });
    socket.setTimeout(timeout, () => {
      pingResponse.responseTime = Date.now() - startTime;
      pingResponse.up = false;
      pingResponse.error = "Request Timeout";
      socket.destroy();
      resolve(pingResponse);
    });
  });
}

module.exports = tcpPing;
