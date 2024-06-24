"use client";

import { useEffect, useState } from "react";

interface MachineOption {
  id: number;
  temperature: string; // Cold, Warm, Hot
  care: string; // Regular, Delicate, Permanent Press
  operation: string; // Wash or Dry
  condition: string; // Old or New
  price: number;
}

interface Transaction {
  id: number;
  owner: string;
  value: number;
  operation: string;
  date: Date;
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [owner, setOwner] = useState("Someone");

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [suggestions, setSuggestions] = useState([] as string[]);
  const [acceptedBills, setAcceptedBills] = useState([] as number[]);
  const [machineOptions, setMachineOptions] = useState([] as MachineOption[]);

  function getMachineOptions() {
    setMachineOptions([
      {
        id: 1,
        temperature: "Cold",
        care: "Regular",
        operation: "Wash",
        condition: "Old",
        price: 2.85,
      },
      {
        id: 2,
        temperature: "Warm",
        care: "Regular",
        operation: "Wash",
        condition: "Old",
        price: 3.1,
      },
      {
        id: 3,
        temperature: "Hot",
        care: "Regular",
        operation: "Wash",
        condition: "Old",
        price: 3.35,
      },
      {
        id: 4,
        temperature: "Any",
        care: "Regular",
        operation: "Wash",
        condition: "New",
        price: 3.75,
      },
      {
        id: 5,
        temperature: "Any",
        care: "Regular",
        operation: "Dry",
        condition: "Old",
        price: 2.65,
      },
      {
        id: 6,
        temperature: "Any",
        care: "Regular",
        operation: "Dry",
        condition: "New",
        price: 2.65,
      },
    ]);
  }

  function getAcceptedBills() {
    setAcceptedBills([5, 10, 20]);
  }

  function addBalance(value: number) {
    setBalance(balance + value);
    addTransaction(owner, value, new Date());
  }

  function addTransaction(owner: string, value: number, date: Date) {
    const transaction: Transaction = {
      id: transactions.length,
      owner: owner,
      value: value,
      date: date,
      operation: value >= 0 ? "add" : "remove",
    };
    setTransactions([transaction, ...transactions]);
  }

  function removeBalance(value: number) {
    if (balance - value >= 0) {
      addBalance(value * -1);
    }
  }

  useEffect(() => {
    getMachineOptions();
    getAcceptedBills();
    humanizeMachineOptions();
  }, []);

  function humanizeMachineOptions() {
    //
  }

  return (
    <section
      id="PAGE"
      className="bg-white font-bold text-black text-md py-8 px-8 flex items-center justify-center">
      <section // SECTIONS
        id="SECTIONS"
        className="m-4">
        <section // SECTION_BALANCE
          id="SECTION_BALANCE"
          className="flex flex-row items-start">
          <section // SECTION_BALANCE_INFO
            id="SECTION_BALANCE_INFO"
            className="flex flex-col items-center">
            <label
              id="BALANCE_LABEL"
              className="text-xl font-semibold">
              {`Current balance: ${
                balance >= 0
                  ? "$" + balance.toFixed(2)
                  : "-$" + balance.toFixed(2).replace("-", "")
              }`}
            </label>
            <label className="mt-8">User:</label>
            <input
              type="text"
              placeholder="User"
              className="text-center w-32 border-2 border-gray-300 rounded-md"
              onChange={(event) => setOwner(event.target.value)}></input>

            <section // BALANCE_ADD_BUTTONS
              id="BALANCE_ADD_BUTTONS"
              className="flex flex-col items-center mx-10 my-10">
              {acceptedBills.map((bill) => (
                <button
                  id={`BALANCE_ADD_${bill}`}
                  key={`BALANCE_ADD_${bill}`}
                  className="
                rounded-lg
                bg-green-300 hover:bg-green-200
                border-green-400 hover:border-green-300 border-b-4
                text-black
                font-semibold
                text-sm
                py-2
                px-4
                flex flex-row justify-center
                m-2 "
                  onClick={() => addBalance(bill)}>
                  Add ${bill}
                </button>
              ))}
            </section>
          </section>
          <section // SECTION_MACHINE_OPTIONS
            id="SECTION_MACHINE_OPTIONS"
            className="flex flex-col items-center m-4">
            <section // MACHINE_OPTIONS_WASH
              id="MACHINE_OPTIONS_WASH">
              <label className="flex justify-center mt-4">Wash Options:</label>
              {machineOptions
                .filter((machineOption) => machineOption.operation === "Wash")
                .map((machineOption) => (
                  <button
                    className="
                rounded-lg
                bg-red-300 hover:bg-red-200
                border-red-400 hover:border-red-300 border-b-4
                text-black
                font-semibold
                text-sm
                py-2
                px-3
                flex flex-row
                m-2"
                    id={`${machineOption.id}`}
                    key={`${machineOption.id}`}
                    onClick={() => removeBalance(machineOption.price)}>
                    {machineOption.temperature +
                      ", " +
                      machineOption.care +
                      " (" +
                      machineOption.condition +
                      " Machine) - $" +
                      machineOption.price}
                  </button>
                ))}
            </section>
            <section // MACHINE_OPTIONS_DRY
              id="MACHINE_OPTIONS_DRY"></section>
            <label className="flex justify-center mt-4">Dry Options:</label>
            {machineOptions
              .filter((option) => option.operation === "Dry")
              .map((machineOption) => (
                <button
                  className="
                rounded-lg
                bg-red-300 hover:bg-red-200
                border-red-400 hover:border-red-300 border-b-4
                text-black
                font-semibold
                text-sm
                py-2
                px-3
                flex flex-row
                m-2"
                  id={`${machineOption.id}`}
                  key={`${machineOption.id}`}
                  onClick={() => removeBalance(machineOption.price)}>
                  {machineOption.temperature +
                    ", " +
                    machineOption.care +
                    " " +
                    machineOption.operation +
                    " (" +
                    machineOption.condition +
                    " Machine) - $" +
                    machineOption.price}
                </button>
              ))}
          </section>
        </section>
        <section // SECTION_SUGGESTIONS
          id="SECTION_SUGGESTIONS"
          className="">
          Sugestions:
        </section>
        <section // SECTION_TRANSACTIONS
          id="SECTION_TRANSACTIONS">
          <label>Transactions:</label>
          <section // TRANSACTIONS
            id="TRANSACTIONS"
            className="flex flex-col justify-right">
            {transactions.map((transaction, index) => (
              <label
                className={`flex justify-center w-full p-2 m-1 rounded-md ${
                  transaction.value >= 0 ? "bg-green-100" : "bg-red-100"
                }`}
                key={`transaction+${index}`}>
                {transaction.owner +
                  (transaction.value >= 0
                    ? ` added $${transaction.value}`
                    : ` spent $${-transaction.value}`) +
                  " on " +
                  transaction.date.toLocaleString()}
              </label>
            ))}
          </section>
        </section>
      </section>
    </section>
  );
}
