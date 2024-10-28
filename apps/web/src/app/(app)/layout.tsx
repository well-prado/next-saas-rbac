import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth'

export default function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/sign-in')
  }

  return (
    <>
      {children}
      {sheet}
    </>
  )
}
