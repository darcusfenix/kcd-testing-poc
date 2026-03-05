import { useCallback, useEffect } from 'react'
import { useAsync } from '@/lib/use-async'
import { profileApi } from './api'
import type { Profile, UpdateProfilePayload } from './types'

export function useProfile() {
  const { status, data, error, run } = useAsync<Profile>()

  const fetch = useCallback(() => run(profileApi.getProfile()), [run])

  useEffect(() => {
    fetch().catch(() => {}) // error already captured in state
  }, [fetch])

  return { status, data, error, refetch: fetch }
}

export function useUpdateProfile() {
  const { status, data, error, run } = useAsync<Profile>()

  const update = useCallback(
    (payload: UpdateProfilePayload) => run(profileApi.updateProfile(payload)),
    [run],
  )

  return { status, data, error, update }
}

export function useDeleteAccount() {
  const { status, error, run } = useAsync<void>()

  const deleteAccount = useCallback(() => run(profileApi.deleteAccount()), [run])

  return { status, error, deleteAccount }
}
