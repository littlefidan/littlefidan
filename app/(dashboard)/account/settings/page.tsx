'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Shield, Key, Lock, Mail, Bell, Trash2, Save, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'

interface Profile {
  id: string
  email: string
  full_name: string | null
  email_notifications: boolean
  marketing_emails: boolean
  created_at: string
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [changingEmail, setChangingEmail] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [emailForm, setEmailForm] = useState({
    newEmail: '',
    confirmEmail: '',
    password: ''
  })
  
  const [notifications, setNotifications] = useState({
    email_notifications: true,
    marketing_emails: false
  })
  
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile(data)
        setNotifications({
          email_notifications: data.email_notifications ?? true,
          marketing_emails: data.marketing_emails ?? false
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('Kon instellingen niet laden')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationChange = async (key: string, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      const updatedNotifications = { ...notifications, [key]: value }
      setNotifications(updatedNotifications)

      const { error } = await supabase
        .from('profiles')
        .update(updatedNotifications)
        .eq('id', user.id)

      if (error) throw error

      toast.success('Notificatie-instellingen bijgewerkt')
    } catch (error: any) {
      console.error('Error updating notifications:', error)
      toast.error('Kon instellingen niet bijwerken')
      // Revert the change
      setNotifications({ ...notifications })
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)

    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Nieuwe wachtwoorden komen niet overeen')
      }

      if (passwordForm.newPassword.length < 6) {
        throw new Error('Nieuw wachtwoord moet minimaal 6 karakters bevatten')
      }

      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      })

      if (error) throw error

      toast.success('Wachtwoord succesvol gewijzigd')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setShowPasswordForm(false)
    } catch (error: any) {
      console.error('Error changing password:', error)
      toast.error(error.message || 'Kon wachtwoord niet wijzigen')
    } finally {
      setChangingPassword(false)
    }
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    })
  }

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingEmail(true)

    try {
      if (emailForm.newEmail !== emailForm.confirmEmail) {
        throw new Error('E-mailadressen komen niet overeen')
      }

      if (!emailForm.password) {
        throw new Error('Wachtwoord is verplicht')
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(emailForm.newEmail)) {
        throw new Error('Ongeldig e-mailadres')
      }

      const { error } = await supabase.auth.updateUser({
        email: emailForm.newEmail
      })

      if (error) throw error

      toast.success('Verificatie e-mail verzonden naar je nieuwe e-mailadres')
      setEmailForm({
        newEmail: '',
        confirmEmail: '',
        password: ''
      })
      setShowEmailForm(false)
    } catch (error: any) {
      console.error('Error changing email:', error)
      toast.error(error.message || 'Kon e-mailadres niet wijzigen')
    } finally {
      setChangingEmail(false)
    }
  }

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailForm({
      ...emailForm,
      [e.target.name]: e.target.value
    })
  }

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt. Alle gegevens, bestellingen en downloads worden permanent verwijderd.'
    )

    if (!confirmed) return

    const doubleConfirmed = window.confirm(
      'Dit is je laatste kans! Je account en alle gegevens worden permanent verwijderd. Typ "DELETE" als je zeker weet dat je door wilt gaan.'
    )

    if (!doubleConfirmed) return

    setDeletingAccount(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Niet ingelogd')

      // Call API to delete user data
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Kon account niet verwijderen')
      }

      // Sign out user
      await supabase.auth.signOut()
      
      toast.success('Account succesvol verwijderd')
      
      // Redirect to homepage
      window.location.href = '/'
    } catch (error: any) {
      console.error('Error deleting account:', error)
      toast.error(error.message || 'Kon account niet verwijderen')
    } finally {
      setDeletingAccount(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-sage-600 mb-2">
          Account Instellingen
        </h1>
        <p className="text-sage-500 text-sm md:text-base">
          Beheer je beveiligingsinstellingen en voorkeuren.
        </p>
      </div>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Beveiliging
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Email */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>E-mailadres</Label>
                <p className="text-sm text-sage-500">
                  Je huidige e-mailadres voor inloggen en notificaties
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Wijzigen
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Input
                type="email"
                value={profile?.email || ''}
                disabled
                className="flex-1"
              />
            </div>

            {showEmailForm && (
              <form onSubmit={handleEmailChange} className="space-y-4 p-4 bg-sage-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="newEmail">Nieuw e-mailadres</Label>
                  <Input
                    id="newEmail"
                    name="newEmail"
                    type="email"
                    value={emailForm.newEmail}
                    onChange={handleEmailInputChange}
                    placeholder="nieuw@email.nl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmEmail">Bevestig nieuw e-mailadres</Label>
                  <Input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    value={emailForm.confirmEmail}
                    onChange={handleEmailInputChange}
                    placeholder="nieuw@email.nl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailPassword">Huidig wachtwoord</Label>
                  <Input
                    id="emailPassword"
                    name="password"
                    type="password"
                    value={emailForm.password}
                    onChange={handleEmailInputChange}
                    placeholder="Je huidige wachtwoord"
                    required
                  />
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-sm text-orange-700">
                    <strong>Let op:</strong> Na het wijzigen krijg je een verificatie e-mail op je nieuwe adres. 
                    Je moet deze bevestigen om je nieuwe e-mailadres te activeren.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={changingEmail}
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {changingEmail ? 'E-mail wijzigen...' : 'E-mailadres wijzigen'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowEmailForm(false)}
                  >
                    Annuleren
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Password Change */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Wachtwoord</Label>
                <p className="text-sm text-sage-500">
                  Zorg voor een sterk wachtwoord van minimaal 6 karakters
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="flex items-center gap-2"
              >
                <Key className="h-4 w-4" />
                Wijzigen
              </Button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4 p-4 bg-sage-50 rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nieuw wachtwoord</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Nieuw wachtwoord"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Bevestig nieuw wachtwoord</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                    placeholder="Bevestig nieuw wachtwoord"
                    required
                    minLength={6}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={changingPassword}
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {changingPassword ? 'Wijzigen...' : 'Wachtwoord wijzigen'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Annuleren
                  </Button>
                </div>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sage-600">E-mail notificaties</p>
              <p className="text-sm text-sage-500">
                Ontvang e-mails over je bestellingen en account
              </p>
            </div>
            <Switch
              checked={notifications.email_notifications}
              onCheckedChange={(checked) => handleNotificationChange('email_notifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium text-sage-600">Marketing e-mails</p>
              <p className="text-sm text-sage-500">
                Ontvang e-mails over nieuwe producten en aanbiedingen
              </p>
            </div>
            <Switch
              checked={notifications.marketing_emails}
              onCheckedChange={(checked) => handleNotificationChange('marketing_emails', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Informatie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-sage-500 mb-1">Account aangemaakt</p>
              <p className="font-medium text-sage-600">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </p>
            </div>
            <div>
              <p className="text-sm text-sage-500 mb-1">Account ID</p>
              <p className="font-mono text-xs text-sage-600 bg-sage-50 p-2 rounded">
                {profile?.id || '-'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Gevarenzone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-red-600 mb-2">Account verwijderen</h4>
            <p className="text-sage-500 text-sm mb-4">
              Het verwijderen van je account is permanent en kan niet ongedaan worden gemaakt.
              Alle gegevens, bestellingen en downloads worden permanent verwijderd.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <h5 className="font-medium text-red-800 mb-2">⚠️ Wat wordt er verwijderd:</h5>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• Je profiel en accountgegevens</li>
                <li>• Alle bestellingen en betalingshistorie</li>
                <li>• Toegang tot gedownloade bestanden</li>
                <li>• Je verlanglijst en winkelwagen</li>
                <li>• Alle notificatie-instellingen</li>
              </ul>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleDeleteAccount}
              disabled={deletingAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {deletingAccount ? 'Account verwijderen...' : 'Account permanent verwijderen'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}