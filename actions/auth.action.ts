"use server";

import { authOptions } from '@/lib/auth';
import {
  SignupFormSchema,
  FormState
} from '@/lib/definitions';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export async function getAuthorizedUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/sign-in");

  const { user } = session;
  const userDB = await findUser(user.email!);

  if (!userDB) {
    throw new Error("Unauthorized access");
  }

  return userDB;
}

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

  const [user, workspace] = await Promise.all([
    prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    }),
    prisma.workspace.create({
      data: {
        name: `${name}'s Workspace`
      }
    })
  ])

  if (!user || !workspace) {
    return {
      message: 'An error occurred while creating your account or workspace.',
    }
  }

  const workspaceMember = await prisma.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'owner'
    }
  })

  if (!workspaceMember) {
    return {
      message: 'An error occurred while adding you to your workspace.',
    }
  }

  redirect('/auth/sign-in')
}