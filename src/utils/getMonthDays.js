const getMonthDays = () => {
    const dates = [];
    const today = new Date();
    let counter = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
  
    for (let i = 0; i < 60; i++) {
      dates.push({
        date: counter.toISOString().split("T")[0],
        date_formatted: counter.toISOString().split("T")[0],
      });
      counter.setDate(counter.getDate() + 1);
    }
  
    return dates;
  };
export default getMonthDays;