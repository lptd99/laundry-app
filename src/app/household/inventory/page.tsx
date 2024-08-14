"use client";

import { collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db } from "../../firebase/firebaseConfig";

const inventoryDB = collection(db, "inventory");
inventoryDB.get().then((snapshot) => {
  snapshot.forEach((doc) => {
    console.log(doc.id, "=>", doc.data());
  });
});
const inventoryUsers = collection(db, "inventory", "users");

const mockDB = {
  users: ["user1"],
  lists: [
    {
      owner: "user1",
      items: [
        {
          id: 1,
          name: "Milk",
          quantity: 1,
          measurement: "Liter",
          price: 2.5,
          currency: "USD",
          expiration: "2024-12-31",
          category: "Dairy",
          module: "Kitchen",
        },
      ],
    },
  ],
};

type Item = {
  id: number;
  name: string;
  quantity: number;
  measurement: string;
  price: number;
  currency: string;
  expiration: string;
  category: string;
  module: string;
};

export default function Inventory() {
  const [render, setRender] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<string>("");
  const [userInventory, setUserInventory] = useState<Item[]>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Item>();
  const onSubmit = (data: Item) => {
    const nextID = userInventory.length + 1;
    console.log("Next ID: ", nextID);
    data.id = nextID;

    mockDB.lists.find((list) => list.owner === user)?.items.push(data);
  };

  const loadInventory = useCallback(
    (user: string) => {
      console.log("Loading inventory for user: ", user);

      if (mockDB.users.find((dbUser) => dbUser === user)) {
        const userItems =
          mockDB.lists.find((list) => list.owner === user)?.items || [];
        setUserInventory(userItems);
      } else {
        mockDB.users.push(user);
        mockDB.lists.push({ owner: user, items: userInventory });
      }
    },
    [userInventory]
  );

  useEffect(() => {
    // const user = localStorage.getItem("user");
    console.log("UseEffect");

    const user = "user1";
    if (user) {
      setRender(true);
      setUser(user);
      loadInventory(user);
    } else {
      setRender(false);
      router.push("/login");
    }
  }, [router, loadInventory]);

  return (
    render && (
      <section // PAGE
        id="PAGE"
        className="text-black text-md py-8 px-8 flex items-center justify-center">
        <section // ITEMS
          id="ITEMS"
          className="">
          <section // ADD-ITEM
            id="ADD-ITEM"
            className="m-4 flex-col flex items-center">
            <h2>Add Item</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center">
              <section className="flex flex-row items-center">
                <label className="font-bold m-2">Item Name</label>
                <input
                  placeholder="Item Name"
                  className={`px-2 m-2 border-2 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}

                <label className="font-bold m-2">Expiration Date</label>
                <input
                  type="date"
                  placeholder="Expiration Date"
                  className={`px-2 m-2 border-2 ${
                    errors.expiration ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("expiration")}
                />
              </section>
              <section className="flex flex-row items-center">
                <label className="font-bold m-2">Quantity</label>
                <input
                  type="number"
                  placeholder="Quantity"
                  step="any"
                  className={`px-2 m-2 border-2 ${
                    errors.quantity ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("quantity", { required: true })}
                />
                {errors.quantity && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}

                <label className="font-bold m-2">Unit of Measurement</label>
                <input
                  placeholder="LB, KG, L, ml, oz, floz, etc."
                  className={`px-2 m-2 border-2 ${
                    errors.measurement ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("measurement", { required: true })}
                />
                {errors.measurement && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}
              </section>

              <section className="flex flex-row items-center">
                <label className="font-bold m-2">Price</label>
                <input
                  type="number"
                  placeholder="Price"
                  step="any"
                  className={`px-2 m-2 border-2 ${
                    errors.price ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("price", { required: true })}
                />
                {errors.price && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}

                <label className="font-bold m-2">Currency</label>
                <input
                  placeholder="Currency"
                  className={`px-2 m-2 border-2 ${
                    errors.currency ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("currency", { required: true })}
                />
                {errors.currency && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}
              </section>

              <section className="flex flex-row items-center">
                <label className="font-bold m-2">Category</label>
                <input
                  placeholder="Category"
                  className={`px-2 m-2 border-2 ${
                    errors.category ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("category", { required: true })}
                />
                {errors.category && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}

                <label className="font-bold m-2">Module</label>
                <input
                  placeholder="Module"
                  className={`px-2 m-2 border-2 ${
                    errors.module ? "border-red-300" : "border-gray-300"
                  } rounded-md text-start`}
                  {...register("module", { required: true })}
                />
                {errors.module && (
                  <span className="text-red-400">Campo obrigatório</span>
                )}
              </section>

              <button
                type="submit"
                className="flex flex-row items-center justify-center border-2 rounded-md p-1 pr-2 border-gray-300">
                Add Item
              </button>
            </form>
          </section>
          <section // SHOW-ITEMS
            className="flex flex-col items-center p-4"
            id="SHOW-ITEMS">
            {userInventory.length > 0 ? (
              <ul className="flex flex-col p-8">
                <p className="">Listing {`${user}'s items:`}</p>
                {mockDB.lists
                  .find((list) => list.owner === user)
                  ?.items.map((item) => (
                    <li
                      key={"item " + item.id}
                      className="border-2 border-black-200 rounded-lg px-3 pb-2 pt-1 mt-4">
                      <section className="flex flex-col items-center">
                        <p className="m-1 text-2xl font-semibold">
                          {item.name}
                        </p>
                        <p className="mt-1 text-md font-semibold">
                          Quantity: {item.quantity} {item.measurement}
                        </p>
                        <p className="mt-1 text-md font-semibold">
                          Price: {item.currency} {item.price}
                        </p>
                        {item.expiration && (
                          <p className="mt-1 text-md font-semibold">
                            Use by: {item.expiration}
                          </p>
                        )}
                        <p className="mt-1 text-md font-semibold">
                          Category: {item.category}
                        </p>
                      </section>
                    </li>
                  ))}
              </ul>
            ) : (
              <section // NO-ITEMS
                id="NO-ITEMS">
                <p>You {"don't"} have any items yet, try adding one above.</p>
              </section>
            )}
          </section>
        </section>
      </section>
    )
  );
}
