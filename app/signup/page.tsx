"use client"

import React from 'react'
import { object, string } from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import Input from '@/components/input'
import Button from '@/components/button'

interface signUpType {
    name: string;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const signUpSchema = object({
    name: string().required(),
    username: string().required(),
    email: string().email('Email must be a valid email').required(),
    password: string().min(8, 'Password must be a minimum of 8 characters').required(),
    confirmPassword: string().min(8, 'Password must be a minimum of 8 characters').required()
    // profilePic: ,
})

const SignUp = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        resolver: yupResolver(signUpSchema)
    })

    const onSignUp = (data: any) => console.log(data);

    return (
        <React.Fragment>
            <form onSubmit={handleSubmit(onSignUp)} className='mx-auto my-20 w-3/4 shadow-inner rounded-lg p-4 md:p-8 bg-slate-300'>
                <Input label="Name" name="name" placeholder='Enter your name' type="text" register={register} errors={errors} />
                <Input label="Username" name="username" placeholder='Enter your username' type="text" register={register} errors={errors} />
                <Input label="Email" name="email" placeholder='Email' type="email" register={register} errors={errors} />
                <Input label="Password" name="password" placeholder='Password' type="password" register={register} errors={errors} />
                <Input label="Confirm Password" name="confirmPassword" placeholder='Confirm Password' type="password" register={register} errors={errors} />
                <Button text="Sign Up" type='submit' variant='primary' handleClick={() => handleSubmit(onSignUp)}  />
            </form>
        </React.Fragment>
    )
}

export default SignUp;