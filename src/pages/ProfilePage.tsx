import { useState } from 'react'
import { useProfile, useUpdateProfile, useDeleteAccount } from '@/services/profile/hooks'
import type { UpdateProfilePayload } from '@/services/profile/types'

export function ProfilePage() {
  const { status, data: profile, error, refetch } = useProfile()
  const { status: updateStatus, error: updateError, update } = useUpdateProfile()
  const { status: deleteStatus, error: deleteError, deleteAccount } = useDeleteAccount()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdateProfilePayload>({})
  const [isDeleted, setIsDeleted] = useState(false)

  function handleEditClick() {
    if (!profile) return
    setFormData({
      name:     profile.name,
      email:    profile.email,
      phone:    profile.phone,
      bio:      profile.bio,
      location: profile.location,
      website:  profile.website,
    })
    setIsEditing(true)
  }

  async function handleSave() {
    try {
      await update(formData)
      setIsEditing(false)
      refetch()
    } catch {
      // error shown via updateError
    }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Permanently delete your account? This cannot be undone.')) return
    try {
      await deleteAccount()
      setIsDeleted(true)
    } catch {
      // error shown via deleteError
    }
  }

  function handleFieldChange(field: keyof UpdateProfilePayload, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isDeleted) {
    return (
      <div className="profile-page">
        <div className="profile-deleted">
          <p className="profile-deleted__icon">✓</p>
          <h2>Account deleted</h2>
          <p>Your account has been permanently removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <header className="profile-page__header">
        <h1>Profile</h1>
      </header>

      {status === 'loading' && (
        <div role="status" aria-label="Loading profile">
          <p>Loading profile...</p>
        </div>
      )}

      {status === 'error' && (
        <div role="alert" className="error-message">
          <p>Error: {error}</p>
          <button onClick={refetch}>Retry</button>
        </div>
      )}

      {(status === 'success' || status === 'loading') && profile && (
        <div className="profile-card">
          <div className="profile-card__avatar">
            <span className="profile-card__initials">
              {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </span>
          </div>

          {isEditing ? (
            <form
              className="profile-form"
              onSubmit={(e) => { e.preventDefault(); handleSave() }}
            >
              <div className="profile-form__grid">
                <label className="profile-form__field">
                  <span>Name</span>
                  <input
                    value={formData.name ?? ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    required
                  />
                </label>
                <label className="profile-form__field">
                  <span>Email</span>
                  <input
                    type="email"
                    value={formData.email ?? ''}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    required
                  />
                </label>
                <label className="profile-form__field">
                  <span>Phone</span>
                  <input
                    value={formData.phone ?? ''}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                </label>
                <label className="profile-form__field">
                  <span>Location</span>
                  <input
                    value={formData.location ?? ''}
                    onChange={(e) => handleFieldChange('location', e.target.value)}
                  />
                </label>
                <label className="profile-form__field">
                  <span>Website</span>
                  <input
                    value={formData.website ?? ''}
                    onChange={(e) => handleFieldChange('website', e.target.value)}
                  />
                </label>
                <label className="profile-form__field profile-form__field--full">
                  <span>Bio</span>
                  <textarea
                    rows={3}
                    value={formData.bio ?? ''}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                  />
                </label>
              </div>

              {updateError && (
                <div role="alert" className="error-message" style={{ marginTop: '1rem' }}>
                  <p>Save failed: {updateError}</p>
                </div>
              )}

              <div className="profile-form__actions">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={updateStatus === 'loading'}
                >
                  {updateStatus === 'loading' ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsEditing(false)}
                  disabled={updateStatus === 'loading'}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-view">
              <div className="profile-view__header">
                <div>
                  <h2 className="profile-view__name">{profile.name}</h2>
                  <p className="profile-view__meta">
                    Member since {new Date(profile.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                  </p>
                </div>
                <div className="profile-view__actions">
                  <button className="btn btn--primary" onClick={handleEditClick}>
                    Edit profile
                  </button>
                  <button
                    className="btn btn--danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteStatus === 'loading'}
                  >
                    {deleteStatus === 'loading' ? 'Deleting…' : 'Delete account'}
                  </button>
                </div>
              </div>

              <dl className="profile-view__details">
                <div className="profile-view__detail">
                  <dt>Email</dt>
                  <dd>{profile.email}</dd>
                </div>
                <div className="profile-view__detail">
                  <dt>Phone</dt>
                  <dd>{profile.phone}</dd>
                </div>
                <div className="profile-view__detail">
                  <dt>Location</dt>
                  <dd>{profile.location}</dd>
                </div>
                <div className="profile-view__detail">
                  <dt>Website</dt>
                  <dd>
                    <a href={`https://${profile.website}`} target="_blank" rel="noreferrer">
                      {profile.website}
                    </a>
                  </dd>
                </div>
                {profile.bio && (
                  <div className="profile-view__detail profile-view__detail--full">
                    <dt>Bio</dt>
                    <dd>{profile.bio}</dd>
                  </div>
                )}
              </dl>

              {deleteError && (
                <div role="alert" className="error-message" style={{ marginTop: '1rem' }}>
                  <p>Delete failed: {deleteError}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
