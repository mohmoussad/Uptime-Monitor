const https = require("https");

const axiosOptionsBuilder = async ({ timeout, authentication, httpHeaders, ignoreSSL }) => {
  // Handling Basic Authintecation
  const token = `${authentication.username}:${authentication.password}`;
  const encodedToken = Buffer.from(token).toString("base64");
  const basicAuthHeader = `Basic ${encodedToken}`;

  // Handling httpHeaders Array
  if (httpHeaders.Authorization && authentication)
    return Error("Authorization conflict, you are using basic auth and another type of auth passed in http headers.");
  const mappedHttpHeaders = {};
  httpHeaders.forEach((header) => {
    mappedHttpHeaders[header.key] = header.value;
  });

  // Handling ingoreSSL Flag
  const httpsAgent = new https.Agent({
    rejectUnauthorized: !ignoreSSL,
  });

  const axiosConfig = {
    headers: {
      Authorization: basicAuthHeader,
      ...mappedHttpHeaders,
    },
    auth: authentication,
    timeout,
    httpsAgent,
  };

  return axiosConfig;
};

module.exports = axiosOptionsBuilder;
