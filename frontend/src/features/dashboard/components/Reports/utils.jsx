export const generateMonthRange = (year, startM, endM) => {
  const start = parseInt(startM);
  const end = parseInt(endM);
  let result = [];
  for (let m = start; m <= end; m++) {
    const mm = m < 10 ? `0${m}` : `${m}`;
    result.push(`${year}-${mm}`);
  }
  return result;
};

export const getMonthLabel = (months, val) => months.find(m => m.value === val)?.label || val;
