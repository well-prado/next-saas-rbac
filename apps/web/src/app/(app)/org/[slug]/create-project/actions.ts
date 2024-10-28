'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth'
import { createProject } from '@/http/create-project'

const projectSchema = z.object({
  name: z.string().min(4, {
    message: 'Project name should have at least 4 characters.',
  }),
  description: z.string(),
})

export async function createProjectAction(data: FormData) {
  const currentOrg = getCurrentOrg()
  const result = projectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, description } = result.data

  try {
    await createProject({
      org: currentOrg!,
      name,
      description,
    })
  } catch (error) {
    if (error instanceof HTTPError) {
      const { message } = await error.response.json()

      return { success: false, message, errors: null }
    }

    console.error(error)

    return {
      success: false,
      message: 'Unexpected error occurred. Please try again later.',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Project was created successfuly.',
    errors: null,
  }
}
