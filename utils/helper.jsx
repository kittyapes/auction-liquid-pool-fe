const getTimeRemaining = (timestamp) => {
  const total = Date.parse(timestamp) - Date.parse(new Date());
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

export const startTimer = (timestamp) => {
  let { total, hours, minutes, seconds } = getTimeRemaining(timestamp);
  if (total >= 0) {
    return (
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds)
    );
  }
  return "Over";
};

export const getDeadTime = (timestamp) => {
  let deadline = new Date(timestamp * 1000);
  // This is where you need to adjust if
  // you ented to add more time
  deadline.setSeconds(deadline.getSeconds() + 10);
  return deadline;
};

export const Status = {
  NOT_ACTIVATED: "NOT_ACTIVATED",
  ACTIVATED: "ACTIVATED",
  END: "END",
};

export const TxStatus = {
  DONE: "DONE",
  PENDING: "PENDING",
  NONE: "NONE",
};
