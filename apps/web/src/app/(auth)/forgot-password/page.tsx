import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <section>
      <form action="" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="johndoe@acme.com"
          />
        </div>

        <Button type="submit" className="w-full">
          Recover password
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/sign-in">Back to login</Link>
        </Button>
      </form>
    </section>
  )
}
