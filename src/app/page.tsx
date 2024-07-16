"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setUser(user);
  }, []);

  return (
    <section id="PAGE">
      <section
        id="FEATURES"
        className="flex flex-col p-8">
        <h1 className="text-xl text-center mb-8">
          Welcome to the Household Management System
        </h1>
        <p className="">
          Manage your household expenses, tasks, and other activities
          efficiently with our comprehensive system.
        </p>
        <ul className="flex flex-col">
          <li>
            <button className="mr-3 mb-2 border-2 rounded-md p-1 pr-2 border-gray-300">
              💸 Expenses:
            </button>
            Keep track of your monthly income and expenses easily, get
            suggestions on what to save money on.
          </li>
          <li>
            <button className="mr-3 mb-2 border-2 rounded-md p-1 pr-2 border-gray-300">
              📦 Inventory:
            </button>
            Monitor your household supplies, food stock, and expiration dates.
          </li>
          <li>
            <button className="mr-3 mb-2 border-2 rounded-md p-1 pr-2 border-gray-300">
              🍲 Kitchen:
            </button>
            Plan your meals and grocery shopping efficiently, get
            recommendations suiting your dietary restrictions.
          </li>
          <li>
            <a href="/info/laundry">
              <button className="mr-3 border-2 rounded-md p-1 pr-2 border-gray-300">
                🩳 Laundry:
              </button>
            </a>
            Plan your laundry trips efficiently, log your card balance activity,
            set reminders for your preferred day for laundry.
          </li>
        </ul>
      </section>
      {user ? (
        <section id="SECTION-DASHBOARD">
          <a href="/dashboard">
            <button className="border-2 rounded-md p-1 pr-2 border-gray-300">
              Dashboard
            </button>
          </a>
        </section>
      ) : (
        <section id="SECTION-LOGIN">
          <a href="/login">
            <button className="border-2 rounded-md p-1 pr-2 border-gray-300">
              Login
            </button>
          </a>
        </section>
      )}
    </section>
  );
}
