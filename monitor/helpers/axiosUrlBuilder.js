const axiosUrlBuilder = async ({ protocol, url, port, path }) => {
  let fullUrl = `${protocol}://${url}`;
  if (port) fullUrl += `:${port}`;
  if (path) fullUrl += path;

  return fullUrl;
};

module.exports = axiosUrlBuilder;