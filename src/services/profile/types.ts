export interface Profile {
  id: number
  name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  joinedAt: string
}

export type UpdateProfilePayload = Partial<
  Pick<Profile, 'name' | 'email' | 'phone' | 'bio' | 'location' | 'website'>
>
