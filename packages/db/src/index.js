"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// prisma.ts
const client_1 = require("@prisma/client");
let prisma;
if (process.env.NODE_ENV === "production") {
    prisma = new client_1.PrismaClient();
}
else {
    // In development, use a global variable to store the Prisma client instance to prevent
    // reinitializing it across hot reloads
    if (!global.prisma) {
        global.prisma = new client_1.PrismaClient();
    }
    prisma = global.prisma;
}
exports.default = prisma;
