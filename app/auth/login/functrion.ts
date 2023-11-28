"use server";
import { signIn } from "@/app/auth";

export const authenticate = async ( values: { username: any; password: any; }) => {
    const { username, password } = values
  
    try {
    const res =   await signIn("credentials",{ ...values, redirect: false });
    console.log(res , "res")
    return res
    } catch (err) {
        console.log(err)
      return "Wrong Credentials!";
    }
  };
  