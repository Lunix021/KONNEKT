import React from "react";
import { DottedGlowBackground } from "../components/ui/dotted-glow-background";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { cn } from "../lib/utils"
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

export default function Login({setUser}) {

  const navigate=useNavigate();

//general zod schema lmao
const registerSchema = z.object({

  email: z
.string()
.min(1,"Email is required")
.email("Enter a valid email"),

  password:z
.string()
.min(1,"Password is required")
.min(8,"Password must contain 8 characters"),

  

});






const {
  register,
  handleSubmit,
  formState:{errors}
}=useForm({
  resolver:zodResolver(registerSchema)
});




//login api
const onSubmit=async(data)=>{
  try {
    const res= await api.post('/user/login',
      {
        email:data.email,
        pwd:data.password}
    )

       console.log(res.data);
      setUser(res.data);
       navigate('/chats');


  } catch (err) {
    console.log(err.response.data);
  }
}









 const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
 
const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

  return (
    <div className="relative mx-auto flex w-full items-center justify-center dark:bg-background min-h-screen">

      {/* BACKGROUND FROM ACETERNITY FKING LOVE IT */}
      <DottedGlowBackground
        className="pointer-events-none mask-radial-to-90% mask-radial-at-center opacity-20 dark:opacity-100 "
        opacity={1}
        gap={10}
        radius={1.6}
        colorLightVar="--color-neutral-500"
        glowColorLightVar="--color-neutral-600"
        colorDarkVar="--color-neutral-500"
        glowColorDarkVar="--color-sky-800"
        backgroundOpacity={0}
        speedMin={0.3}
        speedMax={1.6}
        speedScale={1}
      />
 



    {/* 3d card */}
 <CardContainer className="inter-var">
      <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 dark:bg-black dark:border-white/20 border-black/10 w-auto sm:w-120 h-auto rounded-xl p-6 border  ">
        

        {/* FORM */}
        <CardItem translateZ="100" className="w-full mt-4">
          
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        WELCOME , PLEASE LOGIN FIRST
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Hey , you can create account if you are new or change password of an existing account if u forgot
      </p>
 
      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
                    <Input id="email" placeholder="projectmayhem@fc.com" type="email" {...register("email")}/>
                    {
          errors.email &&
          <p className="text-red-500">
          {errors.email.message}
          </p>
          }
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" {...register("password")}/>
                           {
          errors.password &&
          <p className="text-red-500">
          {errors.password.message}
          </p>
          }
        </LabelInputContainer>
        
        <button
          className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign in &rarr;
          <BottomGradient />
        </button>
 
        <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      </form>
    
        </CardItem>




        <div className="flex justify-between items-center mt-20">
          

        <Link to='/futureplan'>
        <CardItem
           translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
           FORGOT PASSWORD?
          </CardItem>
          </Link>


  <Link to='/register'>
  <CardItem
            translateZ={20}
            as="button"
            className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
          >
            CREATE NEW ACCOUNT
          </CardItem>
          </Link>
          


        </div>
      </CardBody>
    </CardContainer>

    </div>
  );
}
