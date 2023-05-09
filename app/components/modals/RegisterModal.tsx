'use client';

import axios from 'axios';
import {AiFillGithub} from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState, } from 'react';
import {toast} from 'react-hot-toast';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';

import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';

import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import Button from '../Button';

import { signIn } from "next-auth/react";

const RegisterModal = () => {
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false);

    const { 
        register, 
        handleSubmit, 
        formState:{
            errors,
        }, 
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        axios.post('api/register', data)
            .then(() => {
                toast.success('Registered!');
                registerModal.onClose();
                loginModal.onOpen();
            })
            .catch((error) => {
                toast.error(error);
            })
            .finally(()=>{
                setIsLoading(false);
            })
    };

    const onToggle = useCallback(() => {
        registerModal.onClose();
        loginModal.onOpen();
      }, [registerModal, loginModal])

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <div>
                <p className='text-center text-neutral-500 font-normal'>
                    <strong>Kummy.io</strong> is owned and operated by sex workers and technologists working together. <br/>
                </p>
            </div>
            <Input id='name' label='Name' disabled={isLoading} register={register} errors={errors} required/>
            <Input id='email' label='Email' disabled={isLoading} register={register} errors={errors} required/>
            <Input id='password' label='Password' type='password' disabled={isLoading} register={register} errors={errors} required/>
        </div> 
    )

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button outline label='Continue with google' icon={FcGoogle} onClick={() => signIn('google')}/>
            <Button outline label='Continue with Github' icon={AiFillGithub} onClick={() => signIn('github')}/>
            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='flex flex-row justify-center gap-2'>
                    <div>
                        Already have an account?
                    </div>
                    <div onClick={onToggle} className='font-normal text-rose-500 cursor-pointer hover:underline'>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )

    return ( 
        <Modal 
            disabled={isLoading} 
            isOpen={registerModal.isOpen}
            center 
            title='Join to Kummy.io'
            subtitle='Home of the independent escort, a platform by us, for us' 
            actionLabel='Continue' 
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
     );
}
 
export default RegisterModal;