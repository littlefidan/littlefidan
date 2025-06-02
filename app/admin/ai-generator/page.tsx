'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Wand2, 
  Download, 
  Sparkles, 
  Leaf, 
  Palette, 
  BookOpen,
  Baby,
  GraduationCap,
  Flower,
  TreePine,
  Bug,
  Sun,
  Cloud,
  Loader2,
  Save,
  Image as ImageIcon,
  Copy,
  Check
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { cn } from '@/lib/utils'

// Prompt templates voor verschillende categorieën
const promptTemplates = {
  coloring: {
    basic: "Simple coloring page for kids featuring {subject}, drawn in solid black lines with clear bold outlines, no shading or colors, white background, suitable for children ages {age}",
    botanical: "Educational botanical coloring page showing {plant} with labeled parts, clear black outlines, no shading, white background, designed for {age} year old children to learn about plants",
    mandala: "Simple mandala-style coloring page with {theme} elements, symmetrical design, bold black lines, no shading, white background, appropriate for {age} year olds"
  },
  worksheet: {
    tracing: "Educational tracing worksheet for {age} year olds featuring {subject}, with dotted lines to trace, clear instructions in Dutch, practice spaces, white background",
    counting: "Math counting worksheet with {theme} objects (1-{max}), clear illustrations, spaces for writing numbers, Dutch instructions, suitable for {age} year olds",
    matching: "Matching activity worksheet connecting {subject1} to {subject2}, clear line art style, Dutch labels, designed for {age} year old children"
  },
  educational: {
    poster: "Educational poster about {topic} for {age} year olds, colorful illustration with Dutch labels, key facts highlighted, child-friendly design, botanical theme",
    flashcard: "Flashcard illustration of {subject}, simple and clear design, Dutch name prominently displayed, suitable for {age} year old vocabulary learning",
    infographic: "Kid-friendly infographic about {topic}, using {theme} illustrations, simple Dutch text, bright colors, designed for {age} year olds"
  },
  storybook: {
    scene: "Children's storybook illustration showing {scene}, {style} art style, {mood} atmosphere, botanical elements, suitable for {age} year olds",
    character: "Cute {character} character for children's book, {style} illustration style, friendly expression, botanical theme accessories, appealing to {age} year olds",
    cover: "Children's book cover featuring {title}, {style} illustration, botanical border design, Dutch title text, appealing to {age} year old readers"
  }
}

// Leeftijdsgroepen
const ageGroups = [
  { value: '2-4', label: 'Peuters (2-4 jaar)' },
  { value: '4-6', label: 'Kleuters (4-6 jaar)' },
  { value: '6-8', label: 'Onderbouw (6-8 jaar)' },
  { value: '8-10', label: 'Middenbouw (8-10 jaar)' },
  { value: '10-12', label: 'Bovenbouw (10-12 jaar)' }
]

// Botanische thema's
const botanicalThemes = [
  { value: 'flowers', label: 'Bloemen', icon: Flower },
  { value: 'trees', label: 'Bomen', icon: TreePine },
  { value: 'vegetables', label: 'Groenten', icon: Leaf },
  { value: 'fruits', label: 'Fruit', icon: Sun },
  { value: 'herbs', label: 'Kruiden', icon: Leaf },
  { value: 'insects', label: 'Insecten & Bestuivers', icon: Bug },
  { value: 'seasons', label: 'Seizoenen', icon: Cloud },
  { value: 'garden', label: 'Tuin', icon: Flower }
]

// Stijlen
const artStyles = [
  { value: 'simple', label: 'Simpel & Duidelijk' },
  { value: 'watercolor', label: 'Waterverf' },
  { value: 'cartoon', label: 'Cartoon' },
  { value: 'realistic', label: 'Realistisch' },
  { value: 'geometric', label: 'Geometrisch' },
  { value: 'vintage', label: 'Vintage Botanisch' }
]

export default function AIGeneratorPage() {
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('coloring')
  const [subcategory, setSubcategory] = useState('basic')
  const [ageGroup, setAgeGroup] = useState('4-6')
  const [theme, setTheme] = useState('flowers')
  const [style, setStyle] = useState('simple')
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<Array<{
    url: string
    prompt: string
    revised_prompt: string
    timestamp: Date
  }>>([])
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null)
  const [productName, setProductName] = useState('')
  const [productDescription, setProductDescription] = useState('')

  // Smart prompt builder
  const buildSmartPrompt = useCallback(() => {
    const template = promptTemplates[category as keyof typeof promptTemplates]?.[subcategory as keyof typeof promptTemplates.coloring] || ''
    const ThemeIcon = botanicalThemes.find(t => t.value === theme)?.icon
    const themeName = botanicalThemes.find(t => t.value === theme)?.label || theme
    
    let smartPrompt = template
      .replace('{subject}', themeName)
      .replace('{plant}', themeName)
      .replace('{theme}', themeName)
      .replace('{topic}', themeName)
      .replace('{age}', ageGroup.split('-')[0])
      .replace('{max}', ageGroup === '2-4' ? '5' : ageGroup === '4-6' ? '10' : '20')
      .replace('{style}', artStyles.find(s => s.value === style)?.label || style)
      .replace('{mood}', 'vrolijke en educatieve')
    
    // Voeg extra details toe voor betere resultaten
    const enhancements = [
      'high quality',
      'professional illustration',
      'print-ready',
      '300 DPI',
      'clean design'
    ]
    
    if (category === 'coloring') {
      enhancements.push('thick black lines', 'no grey shading', 'easy to color')
    }
    
    if (theme === 'flowers') {
      smartPrompt += ', including tulips, sunflowers, and daisies'
    } else if (theme === 'vegetables') {
      smartPrompt += ', including carrots, tomatoes, and lettuce'
    }
    
    return `${smartPrompt}, ${enhancements.join(', ')}`
  }, [category, subcategory, ageGroup, theme, style])

  // Update prompt wanneer settings veranderen
  useEffect(() => {
    setPrompt(buildSmartPrompt())
  }, [category, subcategory, ageGroup, theme, style])

  // Genereer afbeelding
  const generateImage = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size: '1024x1024',
          quality: 'standard',
          n: 1
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()
      
      setGeneratedImages(prev => [{
        url: data.url,
        prompt: prompt,
        revised_prompt: data.revised_prompt,
        timestamp: new Date()
      }, ...prev])

      setSelectedImage(0)
    } catch (error) {
      console.error('Error generating image:', error)
      alert('Er ging iets mis bij het genereren van de afbeelding')
    } finally {
      setGenerating(false)
    }
  }

  // Kopieer prompt
  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPrompt(text)
    setTimeout(() => setCopiedPrompt(null), 2000)
  }

  // Sla op als product
  const saveAsProduct = async () => {
    if (selectedImage === null || !productName) {
      alert('Selecteer een afbeelding en vul een productnaam in')
      return
    }

    if (productName.length < 3) {
      alert('Productnaam moet minimaal 3 karakters lang zijn')
      return
    }

    setSaving(true)
    try {
      const image = generatedImages[selectedImage]
      
      // Download de afbeelding eerst
      const imageResponse = await fetch(image.url)
      const blob = await imageResponse.blob()
      
      // Upload naar eigen storage
      const formData = new FormData()
      formData.append('file', blob, `${productName.toLowerCase().replace(/\s+/g, '-')}.png`)
      formData.append('folder', 'ai-generated')
      
      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image')
      }

      const { url: uploadedUrl } = await uploadResponse.json()

      // Maak product aan
      const productData = {
        name: productName,
        slug: productName.toLowerCase().replace(/\s+/g, '-'),
        description: productDescription || `${productName} - Gegenereerd met AI voor ${ageGroup} jaar`,
        price: category === 'coloring' ? 2.99 : 4.99,
        category_id: 'downloads', // Aanpassen naar juiste categorie
        product_type: 'digital',
        preview_images: [uploadedUrl],
        files: [{
          name: productName,
          file_url: uploadedUrl,
          file_type: 'image/png'
        }],
        metadata: {
          ai_generated: true,
          prompt: image.prompt,
          revised_prompt: image.revised_prompt,
          age_group: ageGroup,
          theme: theme,
          category: category,
          style: style
        },
        tags: [theme, category, ageGroup, 'ai-generated'],
        status: 'draft'
      }

      const productResponse = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (!productResponse.ok) {
        throw new Error('Failed to create product')
      }

      alert('Product succesvol aangemaakt!')
      setProductName('')
      setProductDescription('')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Er ging iets mis bij het opslaan van het product')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
          <Wand2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">AI Plaatjes Generator</h1>
          <p className="text-gray-600">Genereer educatieve content met DALL-E 3</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Categorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="coloring">Kleurplaten</SelectItem>
                  <SelectItem value="worksheet">Werkbladen</SelectItem>
                  <SelectItem value="educational">Educatief Materiaal</SelectItem>
                  <SelectItem value="storybook">Verhalenboek</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-4">
                <Label>Type</Label>
                <Select value={subcategory} onValueChange={setSubcategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {category === 'coloring' && (
                      <>
                        <SelectItem value="basic">Basis Kleurplaat</SelectItem>
                        <SelectItem value="botanical">Botanisch Educatief</SelectItem>
                        <SelectItem value="mandala">Mandala Stijl</SelectItem>
                      </>
                    )}
                    {category === 'worksheet' && (
                      <>
                        <SelectItem value="tracing">Overtrekken</SelectItem>
                        <SelectItem value="counting">Tellen</SelectItem>
                        <SelectItem value="matching">Verbinden</SelectItem>
                      </>
                    )}
                    {category === 'educational' && (
                      <>
                        <SelectItem value="poster">Poster</SelectItem>
                        <SelectItem value="flashcard">Flashcard</SelectItem>
                        <SelectItem value="infographic">Infographic</SelectItem>
                      </>
                    )}
                    {category === 'storybook' && (
                      <>
                        <SelectItem value="scene">Scene</SelectItem>
                        <SelectItem value="character">Karakter</SelectItem>
                        <SelectItem value="cover">Boekomslag</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Doelgroep */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5" />
                Doelgroep
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map(age => (
                    <SelectItem key={age.value} value={age.value}>
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Thema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Botanisch Thema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {botanicalThemes.map(t => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-lg border transition-colors",
                        theme === t.value
                          ? "bg-sage-50 border-sage-500 text-sage-700"
                          : "hover:bg-gray-50 border-gray-200"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stijl */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Stijl
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {artStyles.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Prompt & Generate */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                AI Prompt
              </CardTitle>
              <CardDescription>
                Automatisch gegenereerde prompt op basis van je selecties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="font-mono text-sm"
                  placeholder="Beschrijf wat je wilt genereren..."
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={generateImage} 
                    disabled={generating}
                    className="flex-1"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Genereren...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Genereer Afbeelding
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPrompt(buildSmartPrompt())}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generated Images */}
          {generatedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Gegenereerde Afbeeldingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {generatedImages.map((img, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all",
                        selectedImage === idx
                          ? "border-sage-500 shadow-lg"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => setSelectedImage(idx)}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={img.url}
                          alt={`Generated ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity space-y-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(img.url, '_blank', 'noopener,noreferrer')
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {selectedImage === idx && (
                        <div className="absolute top-2 right-2 bg-sage-500 text-white p-1 rounded">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Image Details */}
                {selectedImage !== null && (
                  <div className="mt-6 space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label>Gebruikte Prompt</Label>
                      <div className="mt-1 p-3 bg-white rounded border text-sm font-mono relative">
                        {generatedImages[selectedImage].prompt}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1"
                          onClick={() => copyPrompt(generatedImages[selectedImage].prompt)}
                        >
                          {copiedPrompt === generatedImages[selectedImage].prompt ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {generatedImages[selectedImage].revised_prompt && (
                      <div>
                        <Label>AI Verbeterde Prompt</Label>
                        <div className="mt-1 p-3 bg-white rounded border text-sm font-mono relative">
                          {generatedImages[selectedImage].revised_prompt}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1"
                            onClick={() => copyPrompt(generatedImages[selectedImage].revised_prompt)}
                          >
                            {copiedPrompt === generatedImages[selectedImage].revised_prompt ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Save as Product */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3">Opslaan als Product</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="productName">Productnaam</Label>
                          <Input
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Bijv. Bloemen Kleurplaat Peuters"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productDescription">Beschrijving (optioneel)</Label>
                          <Textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows={3}
                            placeholder="Extra informatie over dit product..."
                          />
                        </div>
                        <Button
                          onClick={saveAsProduct}
                          disabled={saving || !productName}
                          className="w-full"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Opslaan...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Opslaan als Product
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}