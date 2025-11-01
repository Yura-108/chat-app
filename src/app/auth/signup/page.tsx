"use client"

import React, {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import {toast} from "react-toastify";
import {signIn} from "next-auth/react";
import {AiFillMessage} from "react-icons/ai";
import Link from "next/link";

export default function Home() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        try {
            await axios.post("/api/auth/register", {
                email, password
            });

            toast("Registration successful", {
                style:{
                    background:"#9810fa",
                    color:"white"
                }
            });

            const loginRes = await signIn("credentials", {
                email, password, redirect: false
            });

            if (loginRes?.error) {
                router.replace("/");
            } else {
                router.replace("/auth/setup-profile");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast(error.response?.data.error || "Something went wrong", {
                    style:{
                        background:"#9810fa",
                        color:"white"
                    }
                });
            } else {
                toast("Network error please try again",{
                    style:{
                        background:"#9810fa",
                        color:"white"
                    }
                })
            }
        }
        setLoading(false);
    }

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="max-w-[350px] w-[95%]">
                <div className="flex justify-center text-indigo-600">
                    <AiFillMessage size={50} />
                </div>
                <h2 className="text-center text-3xl font-bold my-6 text-gray-300">
                    Create a new account
                </h2>
                <div className="py-10 px-6 rounded-lg  shadow-md">
                    <form onSubmit={handleSignup}>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full px-4 py-3 placeholder-text-gray-400 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
                        />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className="w-full px-4 py-3 placeholder-text-gray-400 bg-input-bg rounded-lg outline-none text-gray-100 my-3"
                        />
                        <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 my-2 py-2 text-white rounded-lg cursor-pointer hover:from-blue-600 transition">
                            {loading ? "Sign up..." : "Sign up"}
                        </button>
                        <div className="my-3 text-center text-white">
                            <span>Already have an account?</span>
                            <Link href={"/"} className={"ml-2 text-purple-600"} >
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}