'use client'

import { useState } from 'react'
import { Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: 'Maria van der Berg',
    email: 'maria@example.com',
    instagramHandle: '@mariavdb',
    phone: '+31 6 12345678',
    preferredLanguage: 'nl',
    culturalBackground: 'Nederlandse',
    children: [
      { name: 'Sophie', age: 5 },
      { name: 'Lucas', age: 3 },
    ],
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // TODO: Save to Supabase
    setTimeout(() => {
      setIsSaving(false)
      setIsEditing(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-sage-600 mb-2">
          Mijn Profiel
        </h1>
        <p className="text-sage-500">
          Beheer je persoonlijke informatie en voorkeuren
        </p>
      </div>

      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profielfoto</CardTitle>
          <CardDescription>
            Upload een foto om je profiel te personaliseren
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-sage-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-sage-600">
                  {profile.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-soft hover:shadow-md transition-shadow">
                <Camera className="h-4 w-4 text-sage-600" />
              </button>
            </div>
            <div>
              <Button variant="outline" size="sm">
                Upload Foto
              </Button>
              <p className="text-xs text-sage-500 mt-2">
                JPG, PNG of GIF. Max 5MB.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Persoonlijke Informatie</CardTitle>
              <CardDescription>
                Update je accountgegevens
              </CardDescription>
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Bewerken
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Volledige naam</Label>
                <Input
                  id="fullName"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefoonnummer</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram gebruikersnaam</Label>
                <Input
                  id="instagram"
                  value={profile.instagramHandle}
                  onChange={(e) => setProfile({ ...profile, instagramHandle: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Voorkeurstaal</Label>
              <select
                id="language"
                className="flex h-10 w-full rounded-xl border border-sage-200 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={profile.preferredLanguage}
                onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                disabled={!isEditing}
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cultural">Culturele achtergrond (optioneel)</Label>
              <Input
                id="cultural"
                value={profile.culturalBackground}
                onChange={(e) => setProfile({ ...profile, culturalBackground: e.target.value })}
                disabled={!isEditing}
                placeholder="Bijv. Nederlandse, Marokkaanse, Turkse"
              />
            </div>

            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Opslaan...' : 'Opslaan'}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Annuleren
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Children Information */}
      <Card>
        <CardHeader>
          <CardTitle>Kinderen</CardTitle>
          <CardDescription>
            Voeg je kinderen toe om gepersonaliseerde aanbevelingen te krijgen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profile.children.map((child, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-sage-50 rounded-xl">
                <div>
                  <p className="font-medium text-sage-600">{child.name}</p>
                  <p className="text-sm text-sage-500">{child.age} jaar</p>
                </div>
                <Button variant="ghost" size="sm">
                  Bewerken
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              + Kind toevoegen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Instellingen</CardTitle>
          <CardDescription>
            Beheer je account voorkeuren en privacy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sage-600">E-mail notificaties</p>
              <p className="text-sm text-sage-500">Ontvang updates over nieuwe producten</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-400"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sage-600">Tweestapsverificatie</p>
              <p className="text-sm text-sage-500">Extra beveiliging voor je account</p>
            </div>
            <Button variant="outline" size="sm">
              Instellen
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}