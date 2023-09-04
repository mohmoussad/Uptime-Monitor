const axios = require("axios");
const Check = require("../models/check.model");
const notify = require("../notification/notify");
const {
  axiosUrlBuilder,
  tcpPing,
  responseTimeCalculator,
  axiosOptionsBuilder,
  reportHistoryHandler,
} = require("./helpers");

responseTimeCalculator(axios);

const ping = async (checkId) => {
  try {
    const checkParameters = await Check.findById(checkId);

    const url = await axiosUrlBuilder(checkParameters);
    const axiosConfig = await axiosOptionsBuilder(checkParameters);

    let pingResponse;

    if (checkParameters.protocol == "tcp") {
      pingResponse = await tcpPing(checkParameters);
      if(!pingResponse.up) throw { statusCode: "NO", message: pingResponse.error, responseTime: pingResponse.responseTime };
    } else {
      pingResponse = await axios.get(url, { ...axiosConfig });
    }

  
    // Handling Assertion
    if (
      checkParameters.protocol !== "tcp" && // TCP response doesn't have status code so it would always cause assertion error without this condition
      checkParameters.assert?.statusCode &&
      pingResponse.status != checkParameters.assert?.statusCode
    ) {
      throw {
        statusCode: pingResponse.status,
        message: `The Status code ${checkParameters.assert.statusCode} that requested to be asserted hasn't been received.`,
      };
    }
    return {
      timestamp: new Date(),
      up: true,
      responseTime: pingResponse?.meta?.responseTime || +pingResponse?.responseTime,
      statusCode: checkParameters.protocol == "tcp" ? "YES" : pingResponse?.status,
      statusText: checkParameters.protocol == "tcp" ? "Up and Running" : pingResponse?.statusText,
    };
  } 
  catch (error) {
    return {
      timestamp: new Date(),
      up: false,
      responseTime: error?.response?.meta?.responseTime || +error?.responseTime || 0,
      statusCode: error?.response?.status || error?.statusCode || "Undefined Error Code",
      statusText: error?.response?.statusText || error?.message || "Undefined Error Reason",
    };
  }
};


const monitor = async (checkId, newReport) => {
  const checkParameters = await Check.findById(checkId);

  let thresholdCounter = 0;

  const pingAndUpdateReport = async () => {
    const read = await ping(checkId);
    const reportResults = reportHistoryHandler(newReport, checkParameters);

    newReport.history.push(read);
    Object.assign(newReport, reportResults);

    newReport.save();

    if (newReport.history.length) {
      if (!newReport.history[newReport.history.length - 1].up) {
        thresholdCounter++;
      } else {
        thresholdCounter = 0;
      }
    }

    if (thresholdCounter == checkParameters.threshold) {
      notify("thresholdPassed", checkParameters);
    }
  };

  pingAndUpdateReport();

  setInterval(() => pingAndUpdateReport(), checkParameters.interval);
};

module.exports = monitor;
