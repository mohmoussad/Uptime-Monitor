const reportHistoryHandler = (newReport, checkParameters) => {
  const { history } = newReport;

  if (history.length) {
    const status = history[history.length - 1].up ? "Up and Running" : "Down";

    const outages = history.filter((read) => !read.up).length;

    let uptime = 0;
    let downtime = 0;

    history.forEach((read, index) => {
      const prevRead = history[index - 1];
      if (index == 0) {
        if (read.up) {
          uptime = checkParameters.interval / 1000;
        } else {
          downtime = checkParameters.interval / 1000;
        }
      } else {
        const timeDiff = (new Date(read.timestamp) - new Date(prevRead?.timestamp)) / 1000;
        if (read.up) {
          uptime += timeDiff;
        } else {
          downtime += timeDiff;
        }
      }
    });

    const availability = (uptime / (uptime + downtime)) * 100;

    const historyWithoutZeros = history
      .map((read) => {
        return read.responseTime;
      })
      .filter(Number);

    const responseTime = historyWithoutZeros.reduce((a, b) => a + b, 0) / historyWithoutZeros.length || 0;

    return {
      status,
      availability: `${availability.toFixed(2)}%`,
      outages,
      downtime: +downtime.toFixed(2),
      uptime: +uptime.toFixed(2),
      responseTime: +responseTime.toFixed(2),
    };
  }
};

module.exports = reportHistoryHandler;
