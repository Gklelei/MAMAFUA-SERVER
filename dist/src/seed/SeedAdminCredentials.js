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
const bcryptjs_1 = require("bcryptjs");
const __1 = require("..");
const SeedAdminCredentials = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AdminCredentials = {
            email: "mamafuaAdmin@gmail.com",
            password: "Admin1234",
        };
        const hashPwd = yield (0, bcryptjs_1.hash)(AdminCredentials.password, 15);
        const admin = yield __1.prisma.user.upsert({
            create: {
                email: AdminCredentials.email,
                password: hashPwd,
                role: "ADMIN",
            },
            update: {
                email: AdminCredentials.email,
                password: hashPwd,
                role: "ADMIN",
            },
            where: {
                email: AdminCredentials.email,
            },
        });
    }
    catch (error) {
        console.log({ error });
    }
});
SeedAdminCredentials().then(() => console.log("Admin Credentials created "));
