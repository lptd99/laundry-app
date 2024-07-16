"use client";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../firebase/firebaseConfig";

type Inputs = {
  email: string;
  password: string;
};

export default function Home() {
  const [render, setRender] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await signIn(data.email, data.password);
      console.log("User signed in, UID:", localStorage.getItem("user"));

      router.push("/dashboard");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User signed up: ", userCredential.user);
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem("user", JSON.stringify(userCredential.user.uid));
      localStorage.setItem(
        "userName",
        JSON.stringify(userCredential.user.displayName)
      );
      console.log("displayName:", userCredential.user.displayName);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setRender(false);
      router.push("/dashboard");
    } else {
      setRender(true);
    }
  }, [router]);

  return (
    render && (
      <section // PAGE
        id="PAGE"
        className="text-black text-md py-8 px-8 flex items-center justify-center">
        <section // LOGIN
          id="LOGIN"
          className="">
          <section // FORM
            id="FORM"
            className="m-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col items-center">
              <label className="font-bold m-2">Email</label>
              <input
                placeholder="Email"
                className={`px-2 m-2 border-2 ${
                  errors.email ? "border-red-300" : "border-gray-300"
                } rounded-md text-start`}
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-400">Campo obrigatório</span>
              )}

              <label className="font-bold m-2">Senha</label>
              <input
                type="password"
                placeholder="Senha"
                className={`px-2 m-2 border-2 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md text-start`}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-400">Campo obrigatório</span>
              )}

              <button
                type="submit"
                className="flex flex-row items-center justify-center border-2 rounded-md p-1 pr-2 border-gray-300">
                Login
              </button>
            </form>
          </section>
          <section // OTHER
            id="OTHER"></section>
        </section>
      </section>
    )
  );
}
