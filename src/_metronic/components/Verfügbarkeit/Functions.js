export const checkSubarrayLength = (arr) => {
  if (Array.isArray(arr)) {
    for (let subArr of arr) {
      if (subArr.length !== 2) {
        return false;
      }
    }
    return true;
  }
  return false;
};

export function groupDateRanges(dates) {
  if (!dates || dates.length === 0) {
    return [];
  }
  const sortedDates = dates
    .map((date) => {
      const parsedDate = new Date(date);
      return isNaN(parsedDate) ? null : parsedDate;
    })
    .filter((date) => date !== null)
    .sort((a, b) => a - b);
  if (sortedDates.length === 0) {
    return [];
  }

  const result = [];
  let startDate = sortedDates[0];
  let endDate = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    const previousDate = sortedDates[i - 1];
    const diffInDays = (currentDate - previousDate) / (1000 * 60 * 60 * 24);
    if (diffInDays > 1) {
      result.push([startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]);
      startDate = currentDate;
    }
    endDate = currentDate;
  }
  result.push([startDate.toISOString().split("T")[0], endDate.toISOString().split("T")[0]]);
  return result;
}

export const getEndDateOfMonth = (dateString) => {
  const date = new Date(dateString);
  const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  nextMonth.setDate(nextMonth.getDate() - 1);
  const year = nextMonth.getFullYear();
  const month = String(nextMonth.getMonth() + 1).padStart(2, "0");
  const day = String(nextMonth.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getCurrentMonthDates = () => {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  return {
    start: formatDate(startDate),
    end: formatDate(endDate),
  };
};

export const generateDateRange = (startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  const dateRange = [];
  for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
    dateRange.push(currentDate.toISOString().split("T")[0]);
  }
  return dateRange;
};
function getMonthDays(year, month) {
  return new Date(year, month, 0).getDate();
}

export function calculateDatePercentage(dates) {
  if (dates.length === 0) return 0;
  const firstDate = new Date(dates[0]);
  const year = firstDate.getFullYear();
  const month = firstDate.getMonth() + 1; 
  const totalDaysInMonth = getMonthDays(year, month);
  const daysSet = new Set();
  dates.forEach(dateString => {
    const date = new Date(dateString);
    if (date.getMonth() + 1 === month && date.getFullYear() === year) {
      daysSet.add(date.getDate());
    }
  });
  const percentage = (daysSet.size / totalDaysInMonth) * 100;
  return percentage;
}
