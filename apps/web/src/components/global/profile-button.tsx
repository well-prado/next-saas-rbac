import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ChevronDown, LogOut } from 'lucide-react'

import { auth } from '@/auth'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../ui/dropdown-menu'

function getInitials(name: string) {
  const words = name.split(' ')
  let initials = ''
  if (words.length > 1) {
    initials = words
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  } else {
    initials = name.slice(0, 2).toUpperCase()
  }
  return initials
}

export async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3 outline-none">
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">{user.name}</span>
          <span className="text-xs text-zinc-400">{user.email}</span>
        </div>
        <Avatar className="size-8">
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
          {user.name && (
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          )}
        </Avatar>
        <ChevronDown className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="mt-2">
        <DropdownMenuItem asChild>
          <a href="/api/auth/sign-out">
            <LogOut className="mr-2 size-4" />
            Sign out
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
