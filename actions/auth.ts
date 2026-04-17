"use server";

import { 
  SigninFormSchema,
  SignupFormSchema, 
  FormState 
} from '@/lib/definitions';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
 
export async function signin(state: FormState, formData: FormData) {
  const validatedFields = SigninFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password')
  })
  
  if (!validatedFields.success) {
      return {
      errors: validatedFields.error.flatten().fieldErrors
      }
  }
  
  const { email, password } = validatedFields.data;
  
  const user = await prisma.user.findUnique({
      where: {
          email
      }
  })
  
  if (!user) {
      return {
          message: 'User not found.',
      }
  }
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  
  if (!isPasswordValid) {
      return {
          message: 'Invalid password.'
      }
  }
  
  redirect('/dashboard')
}

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword')
  })
  
  if (!validatedFields.success) {
      return {
      errors: validatedFields.error.flatten().fieldErrors
      }
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
      data: {
          name,
          email,
          password: hashedPassword
      }
  })
 
  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  redirect('/auth/sign-in')
}