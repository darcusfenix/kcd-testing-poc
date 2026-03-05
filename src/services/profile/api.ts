import { profileClient } from '@/services/config'
import type { Profile, UpdateProfilePayload } from './types'

export const profileApi = {
  getProfile: () =>
    profileClient.get<Profile>('/profile'),

  updateProfile: (data: UpdateProfilePayload) =>
    profileClient.put<Profile>('/profile', data),

  deleteAccount: () =>
    profileClient.delete('/profile'),
}
