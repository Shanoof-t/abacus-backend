"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
let io;
function init(server) {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: (origin, callback) => {
                const allowedOrigins = [
                    "https://abacuss.online",
                    "https://www.abacuss.online",
                    "http://localhost:3000"
                ];
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error("Not allowed by CORS"));
                }
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        },
    });
    io.on("connection", (socket) => __awaiter(this, void 0, void 0, function* () {
        socket.on("register", ({ userId }) => {
            socket.join(userId);
        });
        socket.on("disconnect", () => { });
    }));
    return io;
}
function getIO() {
    if (!io) {
        console.log("Can't find io check it on socket config.Maybe not initialized");
    }
    return io;
}
exports.default = {
    init,
    getIO,
};
