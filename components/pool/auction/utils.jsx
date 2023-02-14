const getTimeRemaining = (e) => {
  const total = Date.parse(e) - Date.parse(new Date());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / 1000 / 60 / 60) % 24);
  return {
    total,
    hours,
    minutes,
    seconds,
  };
};

const startTimer = (e) => {
  let { total, hours, minutes, seconds } = getTimeRemaining(e);
  if (total >= 0) {
    // update the timer
    // check if less than 10 then we need to
    // add '0' at the beginning of the variable
    setTimer(
      (hours > 9 ? hours : "0" + hours) +
        ":" +
        (minutes > 9 ? minutes : "0" + minutes) +
        ":" +
        (seconds > 9 ? seconds : "0" + seconds)
    );
  }
};

const getDeadTime = (timestamp) => {
  let deadline = new Date(timestamp * 1000);
  // This is where you need to adjust if
  // you entend to add more time
  deadline.setSeconds(deadline.getSeconds() + 10);
  return deadline;
};

export const Status = {
  NOT_ACTIVATED: "NOT_ACTIVIATED",
  ACTIVATED: "ACTIVIATED",
  SOLD: "SOLD",
};
