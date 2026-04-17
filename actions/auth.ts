"use server";

import { 
  SignupFormSchema, 
  FormState 
} from '@/lib/definitions';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
 
export async function findUser(email: string) {
    if (!email) {
        return null;
    }
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  return user;
}

export async function checkPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
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