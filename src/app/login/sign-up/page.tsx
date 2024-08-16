"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "../../firebase/firebaseConfig";

type Inputs = {
  email: string;
  password: string;
  passwordConfirm: string;
};

export default function SignUp() {
  const [render, setRender] = useState(false);
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const [noMatchError, setNoMatchError] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      if (data.password === data.passwordConfirm) {
        await signUp(data.email, data.password);
        console.log("User signed in, UID:", localStorage.getItem("userUID"));

        router.push("/dashboard");
      } else {
        setNoMatchError(true);
      }
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
      router.push("/login");
    } catch (error) {
      console.error("Error signing up: ", error);
    }
  };
  const toLogin = () => {
    router.push("/login");
  };

  useEffect(() => {
    const userUID = localStorage.getItem("userUID");
    if (userUID) {
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
          id="SIGN-UP"
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
                <span className="text-red-400">Field required!</span>
              )}

              <label className="font-bold m-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                className={`px-2 m-2 border-2 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md text-start`}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-400">Field required!</span>
              )}
              {noMatchError && (
                <span className="text-red-400">Passwords do not match!</span>
              )}

              <label className="font-bold m-2">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`px-2 m-2 border-2 ${
                  errors.password ? "border-red-300" : "border-gray-300"
                } rounded-md text-start`}
                {...register("passwordConfirm", { required: true })}
              />
              {errors.passwordConfirm && (
                <span className="text-red-400">Field required!</span>
              )}
              {noMatchError && (
                <span className="text-red-400">Passwords do not match!</span>
              )}

              <button
                type="submit"
                className="flex flex-row items-center justify-center border-2 rounded-md p-1 pr-2 border-green-300">
                Create Account
              </button>
            </form>
            <button
              onClick={toLogin}
              className="border-2 rounded-md p-1 pr-2 border-red-300">
              Back to Login
            </button>
          </section>
          <section // OTHER
            id="OTHER"></section>
        </section>
      </section>
    )
  );
}
