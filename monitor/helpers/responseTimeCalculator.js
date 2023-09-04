const responseTimeCalculator = (axiosInstance) => {
  axiosInstance.interceptors.request.use((request) => {
    request.requestStartTime = Date.now();
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      response.meta = { responseTime: Math.round(Date.now() - response.config.requestStartTime) };

      return response;
    },
    (error) => {
      if (error.response) {
        error.response.meta = { responseTime: Math.round(Date.now() - error.response.config.requestStartTime) };
      }

      return Promise.reject(error);
    }
  );
};

module.exports = responseTimeCalculator;
