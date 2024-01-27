import { NextApiRequest, NextApiResponse } from "next";
import { clerkClient } from "@clerk/nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { id },
    method,
  } = req;
  if (method === "GET") {
    const users = await clerkClient.users.getUserList();
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      role: user.publicMetadata.role ?? "user",
    }));
    return res.status(200).json({ data: formattedUsers, success: true });
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
