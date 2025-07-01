import { Server } from "http";
export default interface IFramework {
  init(): Server;
}
