import IDatabase from "../../shared/types/IDatabase";
import IFramework from "../../shared/types/IFramework";
import { ISocket } from "../../shared/types/ISocket";

export default class BootServer {
  private database: IDatabase;
  private framework: IFramework;
  private socket: ISocket;

  constructor(database: IDatabase, framework: IFramework, socket: ISocket) {
    this.database = database;
    this.framework = framework;
    this.socket = socket;
  }

  async start(PORT: string) {
    await this.database.connect();
    const server = this.framework.init();
    this.socket.init(server);
    this.socket.connect();

    server.listen(PORT, () => {
      console.log(`Abacus Running On Port:${PORT}`);
    });
  }

  async stop() {
    await this.database.disconnect();
    this.socket.disconnect();
  }
}
