import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]/route";

const restricted = async (req: any, res: any) => {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
        res.send({
            content: "This is the super secret content. You are signed in.",
            session,
        });
    } else {
        res.send({
            error: "You must be signed in to view the protected content on this page.",
        });
    }
};

export default restricted;
