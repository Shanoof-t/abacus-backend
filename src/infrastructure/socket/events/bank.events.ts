import sockets from "..";

function bankAccountConnectedEvent({
  userId,
  data,
}: {
  userId: string;
  data: any;
}) {
  const io = sockets.getIO();
  io.to(userId).emit("bank:connected", {
    message: "Successfully connected,transactions updated within one day",
    data,
  });
}

export default {
  bankAccountConnectedEvent,
};
