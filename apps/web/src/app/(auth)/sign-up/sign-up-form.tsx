'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import githubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/use-form-state'

import { signInWithGithub } from '../actions'
import { signUpAction } from './actions'

export function SignUpForm() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signUpAction,
    () => {
      router.push('/sign-in')
    },
  )

  async function handleGithubSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await signInWithGithub()
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>Sign up failed</AlertTitle>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" id="name" placeholder="John Doe" />
          {errors?.name && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.name[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="johndoe@acme.com"
          />
          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            name="password"
            type="password"
            id="password"
            placeholder="* * * * * * * *"
          />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm Password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
            placeholder="* * * * * * * *"
          />
          {errors?.password_confirmation && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Create Account'
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/sign-in">Already have an account? Sign in</Link>
        </Button>
      </form>
      <Separator />

      <form onSubmit={handleGithubSubmit}>
        <Button type="submit" variant="outline" className="w-full">
          <Image src={githubIcon} className="mr-2 size-4 dark:invert" alt="" />
          Sign up with Github
        </Button>
      </form>
    </div>
  )
}