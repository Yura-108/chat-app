import {NextResponse} from "next/server";
import prisma from "@/utils/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = (body.email ?? "").toLowerCase().trim();
        const password = (body.password ?? "");

        if (!email || !password) {
            return NextResponse.json({
                    error: "Email and Password are required",
                },
                {
                    status: 400
                }
            );
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json(
                {
                    error: "Please enter a valid email!",
                },
                {
                    status: 400,
                }
            );
        }

        if (password.length < 6) {
            return NextResponse.json({
                error: "Password must be at least 6 characters",
            },
                {
                    status: 400
                }
            )
        }

        const existingUser = await prisma.user.findUnique({
            where: {email},
        });

        if (existingUser) {
            return NextResponse.json({
                error: "Email already exists!",
            },
                {
                    status: 409
                }
            )
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });

        return NextResponse.json({user}, {status: 201});
    } catch (error) {
        console.error("registration Error:", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}