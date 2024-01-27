import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";

const getLoggedinUserData = (req: NextApiRequest) => {
  const { sessionClaims, userId } = getAuth(req);
  return { role: sessionClaims?.metadata?.role, userId };
};

export default getLoggedinUserData;
