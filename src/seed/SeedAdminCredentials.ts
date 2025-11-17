import { hash } from "bcryptjs";
import { prisma } from "..";
const SeedAdminCredentials = async () => {
  try {
    const AdminCredentials: {
      email: string;
      password: string;
    } = {
      email: "mamafuaAdmin@gmail.com",
      password: "Admin1234",
    };
    const hashPwd = await hash(AdminCredentials.password, 15);
    const admin = await prisma.user.upsert({
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
  } catch (error) {
    console.log({ error });
  }
};

SeedAdminCredentials().then(() => console.log("Admin Credentials created "));
