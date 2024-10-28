'use server'

import { HTTPError } from 'ky'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'

import { getCurrentOrg } from '@/auth'
import { createOrganization } from '@/http/create-organization'
import { updateOrganization } from '@/http/update-organization'

const organizationSchema = z
  .object({
    name: z.string().min(4, {
      message: 'Organization name should have at least 4 characters.',
    }),
    domain: z
      .string()
      .nullable()
      .refine(
        (value) => {
          if (value) {
            const domainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

            return domainRegex.test(value)
          }

          return true
        },
        {
          message: 'Please enter a valid domain.',
        },
      ),
    shouldAttachUsersByDomain: z
      .union([z.literal('on'), z.literal('off'), z.boolean()])
      .transform((value) => value === true || value === 'on')
      .default(false),
  })
  .refine(
    (data) => {
      if (data.shouldAttachUsersByDomain && data.domain) {
        const publicDomains = [
          'gmail.com',
          'hotmail.com',
          'outlook.com',
          'yahoo.com',
          'aol.com',
          'icloud.com',
          'mail.com',
          'zoho.com',
          'protonmail.com',
          'gmx.com',
          'yandex.com',
          'tutanota.com',
          'fastmail.com',
          'disroot.org',
          'runbox.com',
          'mailbox.org',
          'posteo.de',
          'kolabnow.com',
        ]

        if (
          publicDomains.includes(data.domain) &&
          data.shouldAttachUsersByDomain === true
        ) {
          return false
        }
      }
      return true
    },
    {
      message:
        'You cannot use a public domain to create an organization. Please use a private domain.',
      path: ['domain'],
    },
  )
  .refine(
    (data) => {
      if (!data.domain && data.shouldAttachUsersByDomain === true) {
        return false
      }

      return true
    },
    {
      message: 'A domain is required when the auto-join feature is enabled.',
      path: ['domain'],
    },
  )

export type OrganizationSchema = z.infer<typeof organizationSchema>

export async function createOrganizationAction(data: FormData) {
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    await createOrganization({
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Organization was created successfuly.',
    errors: null,
  }
}

export async function updateOrganizationAction(data: FormData) {
  const currentOrg = getCurrentOrg()
  const result = organizationSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, domain, shouldAttachUsersByDomain } = result.data

  try {
    await updateOrganization({
      org: currentOrg!,
      name,
      domain,
      shouldAttachUsersByDomain,
    })

    revalidateTag('organizations')
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
    message: 'Organization was updated successfuly.',
    errors: null,
  }
}
