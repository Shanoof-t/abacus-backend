import { format } from "date-fns";

function formatCronExpression({ nextDate }: { nextDate: Date | string }) {
  const month = format(nextDate, "M");
  const day = format(nextDate, "d");
  const minute = format(nextDate, "m");
  const hour = format(nextDate, "H");

  const scheduledTime = `${hour}:${minute} on ${day}-${month}-${new Date(
    nextDate
  ).getFullYear()}`;
  console.log(`Scheduled time: ${scheduledTime}`);
  console.log(`Actual expression: ${minute} ${hour} ${day} ${month} *`);

  const currMin = format(new Date(), "m");
  const currHou = format(new Date(), "H");
  const parsed = Number(currMin) + 2;
  const mock = `${parsed.toString()} ${currHou} 29 3 *`;
  console.log("Mock expression:", mock);
  return mock;
  // return `${minute} ${hour} ${day} ${month} *`;
}
export default formatCronExpression;
