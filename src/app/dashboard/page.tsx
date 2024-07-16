"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";

export default function Home() {
  const [render, setRender] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const signOutUser = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      router.push("/login");
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    const userName = localStorage.getItem("userName");
    if (user) {
      setRender(true);
    } else {
      router.push("/login");
    }
  }, [router, user]);

  return (
    render && (
      <section // PAGE
        id="PAGE"
        className="text-black text-md py-8 px-8 flex items-center justify-center">
        <section id="NAVBAR">
          <p>Welcome, {userName ? userName : "User"} !</p>
          <button
            onClick={signOutUser}
            className="border-2 rounded-md p-1 pr-2 border-gray-300">
            Sign Out
          </button>
        </section>
        <section id="DASHBOARD"></section>
      </section>
    )
  );
}
