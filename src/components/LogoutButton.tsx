"use client";

import {signOut} from "next-auth/react";

export default function LogoutButton() {
  return <button onClick={() => signOut({callbackUrl:"/"})} className="bg-gradient-to-r from-blue-500 to-purple-600 w-[80%] mx-auto py-3 rounded-full text-white cursor-pointer">Logout</button>;
}