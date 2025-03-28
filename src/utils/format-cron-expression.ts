import { format } from "date-fns";

function formatCronExpression({ nextDate }: { nextDate: Date | string }) {
  // create expression elements
  const month = format(nextDate, "M");
  const day = format(nextDate, "d");
  const minute = format(nextDate, "m");
  const hour = format(nextDate, "H");

  // format this one tomorrow
  const scheduledTime = `${hour}:${minute} on ${day}-${month}-${new Date(
    nextDate
  ).getFullYear()}`;
  console.log(`Scheduled time: ${scheduledTime}`);

  // const currMin = format(new Date(), "m");
  // const currHou = format(new Date(), "H");
  // const parsed = Number(currMin) + 1;
  // const mock = `${parsed.toString()} ${currHou} 29 1 *`;
  // console.log("mock date", mock);
  // return mock;
  // // return "58 21 28 1 *";
  return `${minute} ${hour} ${day} ${month} *`;
}
export default formatCronExpression