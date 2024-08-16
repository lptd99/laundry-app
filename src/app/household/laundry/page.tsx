"use client";

import { db } from "@/app/firebase/firebaseConfig";
import { get, ref, set } from "firebase/database";
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
  date: number;
}

interface UserData {
  balance: number;
  transactions: Transaction[];
}

export default function Home() {
  const [balance, setBalance] = useState(0);
  const [ownerUID, setOwnerUID] = useState("");
  const [owner, setOwner] = useState("");
  const [errorOnOwner, setErrorOnOwner] = useState(false);
  const [render, setRender] = useState(false);

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [suggestions, setSuggestions] = useState([] as string[]);
  const [acceptedBills, setAcceptedBills] = useState([] as number[]);
  const [machineOptions, setMachineOptions] = useState([] as MachineOption[]);

  const getUserData = async (ownerUID: string) => {
    const userRef = ref(db, `users/${ownerUID}`);
    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data: UserData = snapshot.val();
          console.log(data);
          setBalance(data.balance || 0);
          setTransactions(data.transactions || []);
        } else {
          console.log("No data available, creating...");
          set(userRef, {
            balance: balance,
            transactions: transactions,
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const saveUserData = async (
    ownerUID: string,
    balance: number,
    updatedTransactions: Transaction[]
  ) => {
    console.log("Saving user data for: ", ownerUID);
    const newData = {
      balance: balance,
      transactions: updatedTransactions,
    };

    const userRef = ref(db, `users/${ownerUID}`);
    set(userRef, newData);
  };

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
    if (errorOnOwner) {
      console.log("Please enter a valid user name.");
      return;
    }
    const absoluteValue = value < 0 ? value * -1 : value;
    setBalance(balance + absoluteValue);
    addTransaction(owner, value, new Date());
  }

  function addTransaction(owner: string, value: number, date: Date) {
    const nextID =
      transactions.length > 0
        ? transactions[transactions.length - 1].id + 1
        : 1;
    const transaction: Transaction = {
      id: nextID,
      owner: owner,
      value: value,
      date: date.getTime(),
      operation: value >= 0 ? "add" : "remove",
    };
    console.log("Adding transaction: ", transaction);

    const updatedTransactions = [transaction, ...transactions];
    const updatedBalance = balance + value;

    setBalance(updatedBalance);
    setTransactions(updatedTransactions);
    saveUserData(ownerUID, updatedBalance, updatedTransactions);
  }

  function removeBalance(value: number) {
    if (errorOnOwner) {
      console.log("Please enter a valid user name.");
      return;
    }
    const absoluteValue = value < 0 ? value * -1 : value;
    if (balance - absoluteValue >= 0) {
      setBalance(balance - absoluteValue);
      addTransaction(owner, -absoluteValue, new Date());
    } else {
      console.log("Insufficient funds.");
    }
  }

  function handleOwnerChange(event: React.ChangeEvent<HTMLInputElement>) {
    let name = event.target.value;
    setOwner(name);

    if (name.trim().length > 1) {
      setErrorOnOwner(false);
    } else {
      setErrorOnOwner(true);
    }
  }

  function getUserUID() {
    const userUID = localStorage.getItem("userUID");
    console.log("UserUID: ", userUID);
    if (userUID) {
      setOwnerUID(userUID);
      return userUID;
    } else {
      console.log("No userUID found.");
      return null;
  }
  useEffect(() => {
    // if (!isOnline()) {
    //   console.log("You are offline. Please check your internet connection.");
    // } else {
    //   console.log("You are online.");
    // }
    const userUID = getUserUID();
    if (userUID) {
      setRender(true);
    } else {
      router.push("/login");
    }
    getMachineOptions();
    getAcceptedBills();
    setErrorOnOwner(true);
    setOwner("");
  }, []); // Runs only on mount

  // const isOnline = () => {
  //   return window.navigator.onLine;
  // };

  useEffect(() => {
    if (ownerUID) {
      getUserData(ownerUID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerUID]); // Runs when ownerUID changes

  // function fixFunction() {
  //   const fixedBalance = 10.55;
  //   const fixedTransactions: Transaction[] = [];
  //   setBalance(fixedBalance);
  //   setTransactions(fixedTransactions);
  //   saveUserData(ownerUID, fixedBalance, fixedTransactions);
  // }

  return (
    <section
      id="PAGE"
      className="font-bold text-black text-md py-8 px-8 flex items-center justify-center">
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
              className={`text-center w-32 border-2 ${
                errorOnOwner ? "border-red-300" : "border-gray-300"
              }  rounded-md`}
              onChange={(event) => handleOwnerChange(event)}></input>
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

              {/* <button
                id={`BALANCE_FIX`}
                key={`BALANCE_FIX`}
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
                onClick={fixFunction}>
                FIX
              </button> */}
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
            {transactions &&
              transactions.length > 0 &&
              transactions[0].id &&
              transactions[0].date &&
              transactions.map((transaction, index) => (
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
                    new Date(transaction.date).toLocaleString()}
                </label>
              ))}
          </section>
        </section>
      </section>
    </section>
  );
}
