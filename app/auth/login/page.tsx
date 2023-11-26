'use client'
import { signIn } from '@/app/auth'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import React, { useState } from 'react'
import { authenticate } from './functrion'
const Login = () => {
    const [values, setValues] = useState({
        username: "",
        password: ""
    })

    const signIn = async () => {
    const res =    await authenticate(values);
    console.log(res, "rssss login")
    }
    return (
        <section className="h-screen">
            <div className="container h-full px-6 py-24 mx-auto">
                <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
                    {/* <!-- Left column container with background--> */}
                    <div className="mb-12 md:mb-0 md:w-8/12 lg:w-6/12">
                        <img
                            src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                            className="w-full"
                            alt="Phone image"
                        />
                    </div>

                    {/* <!-- Right column container with form --> */}
                    <div className="md:w-8/12 lg:ml-6 lg:w-5/12">
                        <form >
                            {/* <!-- Email input --> */}
                            <label htmlFor='email'>Email</label>
                            <InputText
                                id='email'
                                value={values.username}
                                type="email"
                                className="mb-6 w-full"
                                placeholder='Enter email...'
                                onChange={(e) => setValues({ ...values, username: e.target.value })}
                            ></InputText>

                            {/* <!--Password input--> */}
                            <label htmlFor='email'>Password</label>
                            <InputText
                                type="password"
                                value={values.password}
                                className="mb-6 w-full"
                                placeholder='Enter password...'
                                onChange={(e) => setValues({ ...values, password: e.target.value })}
                            ></InputText>

                            {/* <!-- Remember me checkbox --> */}
                            <div className="mb-6 flex items-center justify-between">
                                <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                                    <input
                                        className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] 
                                        h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] 
                                        border-solid border-neutral-300 outline-none before:pointer-events-none 
                                        before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 
                                        before:rounded-full before:bg-transparent before:opacity-0 
                                        before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] 
                                        checked:border-primary checked:bg-primary checked:before:opacity-[0.16]
                                         checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] 
                                         checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] 
                                         checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 
                                         checked:after:border-t-0 checked:after:border-solid checked:after:border-white 
                                         checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer 
                                         hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
                                         focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 
                                         focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] 
                                         focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute 
                                         focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] 
                                         focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100
                                          checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] 
                                          checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] 
                                          checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                                        type="checkbox"
                                        value=""
                                        id="exampleCheck3"
                                        defaultChecked
                                    />
                                    <label
                                        className="inline-block pl-[0.15rem] hover:cursor-pointer"
                                        htmlFor="exampleCheck3"
                                    >
                                        Remember me
                                    </label>
                                </div>

                                {/* <!-- Forgot password link --> */}
                                <a
                                    href="#!"
                                    className="text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* <!-- Submit button --> */}

                            <Button className="w-full" label='Sign in' type='button' onClick={signIn}> </Button>

                            {/* <!-- Divider --> */}
                            <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                                <p className="mx-4 mb-0 text-center font-semibold dark:text-neutral-200">

                                </p>
                            </div>



                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login