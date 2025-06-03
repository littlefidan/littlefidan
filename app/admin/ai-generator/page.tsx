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
  Heart,
  Book,
  Moon,
  Star,
  Flower2,
  Baby,
  Calendar,
  Sun,
  Cloud,
  Loader2,
  Save,
  Image as ImageIcon,
  Copy,
  Check,
  Palette,
  Layers,
  BookOpen,
  Users,
  Home
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Islamitische prompt templates - Geoptimaliseerd tegen tekst problemen
const islamicTemplates = {
  coloring: {
    basic: "Simple black outline drawing of {subject} with Islamic geometric patterns, children's coloring book page, clean thick lines only, pure white background, clear shapes for {age} year olds, respectful cultural design, mathematical symmetry in border decoration",
    arabic: "Clean outline illustration showing Arabic letter shape {letter} formed by {subject} elements, simple coloring page design, thick black line art on white background, geometric patterns, suitable for {age} year old children",
    dua: "Simple line drawing of {prayer} theme using symbolic Islamic elements only, children's coloring book illustration, decorative geometric border, thick black outlines, white background, clear shapes for {age} year olds",
    nature: "Black outline drawing of {subject} surrounded by 8-point Islamic star pattern, nature coloring page, clean geometric design, thick lines on white background, mathematical pattern borders, suitable complexity for {age} year olds"
  },
  worksheet: {
    tracing: "Dotted line tracing pattern worksheet featuring {subject} shapes, educational activity page, clear practice lines with directional arrows, white background, suitable for {age} year old children",
    counting: "Math counting practice sheet showing 1 to {max} using {theme} objects, educational worksheet design, thick black outlines, numbered boxes for practice, white background, {age} year old level",
    emotions: "Emotion recognition activity sheet showing {emotion} expressions, educational worksheet with circle faces, thick line drawings, practice areas, white background for {age} year olds",
    routine: "Daily schedule activity sheet with {routine} illustrations, educational time learning worksheet, clock drawings, sequence boxes, thick outlines on white, {age} year old appropriate"
  },
  educational: {
    poster: "Colorful educational poster illustration about {topic}, visual learning design with icons and pictures only, bright child-friendly graphics, suitable for {age} year olds, clean layout",
    flashcard: "Simple flashcard illustration showing {subject}, bold colorful picture design, white background with colored border, visual learning card for {age} year olds",
    infographic: "Visual infographic design about {topic} using pictures and icons only, colorful educational chart, simple graphics suitable for {age} year old children"
  }
}

// Universele templates - Focus op positieve beschrijvingen zonder tekst
const universalTemplates = {
  coloring: {
    animals: "Simple black outline drawing of cute {animal}, children's coloring book page design, thick clean lines only, pure white background, single main subject, clear shapes suitable for {age} year olds",
    vehicles: "Black line drawing of {vehicle} in action scene, coloring book illustration, thick outlines only, white background, simple mechanical details, appropriate complexity for {age} year old children",
    alphabet: "Decorative letter {letter} shape formed by {object} elements, outline coloring page design, thick black lines on white background, creative letter visualization for {age} year olds",
    emotions: "Simple face drawings showing {emotion} expressions, coloring page with circle faces, thick black outlines only, white background, clear emotional features for {age} year old children",
    seasons: "Line drawing of {season} nature scene, coloring book page with seasonal elements, thick black outlines, white background, appropriate detail level for {age} year olds"
  },
  worksheet: {
    counting: "Mathematics practice sheet with {theme} objects from 1 to {max}, educational worksheet design, thick black counting boxes, white background, suitable for {age} year olds",
    shapes: "Shape recognition practice sheet featuring {shapes}, educational worksheet with tracing areas, thick outline drawings, white background for {age} year old children",
    differences: "Spot the difference puzzle with {theme} scene showing {count} variations, activity worksheet design, two similar drawings side by side, thick outlines for {age} year olds",
    patterns: "Pattern completion worksheet using {theme} objects, sequence activity sheet, thick outline drawings in rows, white background, {age} year old difficulty"
  },
  educational: {
    poster: "Bright colorful educational poster about {topic}, visual infographic design using only pictures and symbols, child-friendly illustrations, suitable for {age} year olds",
    flashcard: "Picture flashcard showing {subject}, bold colorful illustration on white card design, simple visual learning tool for {age} year old children",
    routine: "Visual daily schedule showing {routine} activities, picture chart with clock illustrations only, colorful activity icons, designed for {age} year olds"
  }
}

// Leeftijdsgroepen
const ageGroups = [
  { value: '2-3', label: 'Peuters (2-3 jaar)' },
  { value: '3-4', label: 'Kleuters (3-4 jaar)' },
  { value: '4-5', label: 'Kleuters (4-5 jaar)' },
  { value: '5-6', label: 'Kleuters (5-6 jaar)' },
  { value: '6-7', label: 'Onderbouw (6-7 jaar)' },
  { value: '7-8', label: 'Onderbouw (7-8 jaar)' },
  { value: '8-10', label: 'Middenbouw (8-10 jaar)' }
]

// Islamitische thema's
const islamicThemes = [
  { value: 'allah_names', label: '99 Namen van Allah', icon: Star },
  { value: 'prophets', label: 'Profeten verhalen', icon: Book },
  { value: 'quran_stories', label: 'Koran verhalen', icon: BookOpen },
  { value: 'islamic_manners', label: 'Islamitische manieren', icon: Heart },
  { value: 'duas', label: "Dua's en gebeden", icon: Moon },
  { value: 'ramadan', label: 'Ramadan', icon: Moon },
  { value: 'eid', label: 'Eid vieringen', icon: Star },
  { value: 'hajj', label: 'Hajj & Umrah', icon: Home },
  { value: 'mosque', label: 'Moskee', icon: Home },
  { value: 'prayer', label: 'Gebed & Wudu', icon: Moon }
]

// Universele thema's  
const universalThemes = [
  { value: 'animals', label: 'Dieren', icon: Baby },
  { value: 'vehicles', label: 'Voertuigen', icon: Sun },
  { value: 'nature', label: 'Natuur', icon: Flower2 },
  { value: 'seasons', label: 'Seizoenen', icon: Cloud },
  { value: 'emotions', label: 'Emoties', icon: Heart },
  { value: 'alphabet', label: 'Alfabet', icon: Book },
  { value: 'numbers', label: 'Cijfers', icon: Calendar },
  { value: 'shapes', label: 'Vormen', icon: Star },
  { value: 'family', label: 'Familie', icon: Users },
  { value: 'daily_life', label: 'Dagelijks leven', icon: Home }
]

// Kunststijlen - Geoptimaliseerd voor commerciële producten
const artStyles = [
  { value: 'warm_illustration', label: 'Warme Illustratie (Bestseller)' },
  { value: 'watercolor_soft', label: 'Zachte Waterverf Stijl' },
  { value: 'simple_line', label: 'Eenvoudige Lijntekening' },
  { value: 'cartoon_friendly', label: 'Disney/Pixar Cartoon' },
  { value: 'islamic_geometric', label: 'Islamitisch Geometrisch' },
  { value: 'minimalist', label: 'Modern Minimalistisch' },
  { value: 'kawaii', label: 'Kawaii (Schattig)' },
  { value: 'retro_vintage', label: 'Retro Vintage' }
]

export default function AIGeneratorPage() {
  const [contentType, setContentType] = useState<'islamic' | 'universal'>('islamic')
  const [prompt, setPrompt] = useState('')
  const [category, setCategory] = useState('coloring')
  const [subcategory, setSubcategory] = useState('basic')
  const [ageGroup, setAgeGroup] = useState('4-5')
  const [theme, setTheme] = useState('allah_names')
  const [style, setStyle] = useState('warm_illustration')
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
    const templates = contentType === 'islamic' ? islamicTemplates : universalTemplates
    const categoryTemplates = templates[category as keyof typeof templates]
    const template = (categoryTemplates && typeof categoryTemplates === 'object' && subcategory in categoryTemplates 
      ? (categoryTemplates as any)[subcategory] 
      : '') as string
    
    const themes = contentType === 'islamic' ? islamicThemes : universalThemes
    const selectedTheme = themes.find(t => t.value === theme)
    const themeName = selectedTheme?.label || theme
    
    let smartPrompt = template
      .replace('{subject}', themeName)
      .replace('{topic}', themeName)
      .replace('{theme}', themeName)
      .replace('{animal}', themeName)
      .replace('{vehicle}', themeName)
      .replace('{age}', ageGroup.split('-')[0])
      .replace('{max}', ageGroup === '2-3' ? '5' : ageGroup === '3-4' ? '10' : '20')
      .replace('{style}', artStyles.find(s => s.value === style)?.label || style)
      .replace('{emotion}', 'vreugde')
      .replace('{prayer}', 'Bismillah')
      .replace('{letter}', 'A')
      .replace('{object}', 'appel')
      .replace('{routine}', 'ochtend')
      .replace('{season}', 'lente')
      .replace('{shapes}', 'cirkel, vierkant, driehoek')
      .replace('{count}', '5')
    
    // Leeftijd-specifieke complexiteit volgens onderzoek
    let ageComplexity = ''
    const ageNum = parseInt(ageGroup.split('-')[0])
    
    if (ageNum <= 3) {
      ageComplexity = ', extra thick outlines, very simple design, minimal detail, large areas to color, single focal point'
    } else if (ageNum <= 5) {
      ageComplexity = ', thick outlines, moderate detail, clear boundaries, 2-3 related objects'
    } else {
      ageComplexity = ', clean outlines, intricate details, complex composition, detailed background elements'
    }
    
    // Technische specificaties volgens DALL-E 3 best practices
    const technicalSpecs = ', suitable for printing, coloring book style'
    
    // Stijl parameter (onderzoek toont 'natural' werkt beter dan 'vivid' voor kleurplaten)
    const apiStyle = 'natural'
    
    return smartPrompt + ageComplexity + technicalSpecs
  }, [contentType, category, subcategory, ageGroup, theme, style])

  // Update prompt wanneer settings veranderen
  useEffect(() => {
    setPrompt(buildSmartPrompt())
  }, [buildSmartPrompt])

  // Reset theme wanneer content type verandert
  useEffect(() => {
    if (contentType === 'islamic') {
      setTheme('allah_names')
    } else {
      setTheme('animals')
    }
  }, [contentType])

  // Genereer afbeelding
  const generateImage = async () => {
    setGenerating(true)
    try {
      const response = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          size: '1792x1024',
          quality: 'standard', // Onderzoek toont 'standard' is optimaal voor line art
          style: 'natural', // 'natural' produceert schonere line art dan 'vivid'
          n: 1
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate image')
      }

      const data = await response.json()
      
      setGeneratedImages(prev => [{
        url: data.url,
        prompt: prompt,
        revised_prompt: data.revised_prompt,
        timestamp: new Date()
      }, ...prev])

      setSelectedImage(0)
    } catch (error: any) {
      console.error('Error generating image:', error)
      alert(error.message || 'Er ging iets mis bij het genereren van de afbeelding')
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
      
      // Download de afbeelding
      const imageResponse = await fetch(image.url)
      const blob = await imageResponse.blob()
      
      // Upload naar storage
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
        description: productDescription || `${productName} - ${contentType === 'islamic' ? 'Islamitische' : 'Educatieve'} content voor ${ageGroup} jaar`,
        price: category === 'coloring' ? 3.99 : 5.99, // Aangepast naar optimale prijsstelling uit onderzoek
        category_id: 'downloads',
        product_type: 'digital',
        preview_images: [uploadedUrl],
        files: [{
          name: productName,
          file_url: uploadedUrl,
          file_type: 'image/png'
        }],
        metadata: {
          ai_generated: true,
          content_type: contentType,
          category,
          subcategory,
          age_group: ageGroup,
          theme,
          style,
          prompt: image.prompt
        },
        tags: [contentType, category, theme, ageGroup],
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

      alert('Product succesvol aangemaakt! 🌟')
      setProductName('')
      setProductDescription('')
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Er ging iets mis bij het opslaan van het product')
    } finally {
      setSaving(false)
    }
  }

  const currentThemes = contentType === 'islamic' ? islamicThemes : universalThemes

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg">
          <Wand2 className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">LittleFidan AI Content Generator</h1>
          <p className="text-gray-600">Genereer educatieve content met AI</p>
        </div>
      </div>

      {/* Content Type Selector */}
      <Tabs value={contentType} onValueChange={(v) => setContentType(v as 'islamic' | 'universal')} className="mb-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="islamic" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Islamitisch
          </TabsTrigger>
          <TabsTrigger value="universal" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Universeel
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Categorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="coloring">Kleurplaten</SelectItem>
                  <SelectItem value="worksheet">Werkbladen</SelectItem>
                  <SelectItem value="educational">Educatief Materiaal</SelectItem>
                </SelectContent>
              </Select>

              <div className="mt-4">
                <Label>Type</Label>
                <Select value={subcategory} onValueChange={setSubcategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {contentType === 'islamic' && category === 'coloring' && (
                      <>
                        <SelectItem value="basic">Basis Islamitisch</SelectItem>
                        <SelectItem value="arabic">Arabisch Alfabet</SelectItem>
                        <SelectItem value="dua">Dua's & Gebeden</SelectItem>
                        <SelectItem value="nature">Natuur & Schepping</SelectItem>
                      </>
                    )}
                    {contentType === 'universal' && category === 'coloring' && (
                      <>
                        <SelectItem value="animals">Dieren</SelectItem>
                        <SelectItem value="vehicles">Voertuigen</SelectItem>
                        <SelectItem value="alphabet">Alfabet</SelectItem>
                        <SelectItem value="emotions">Emoties</SelectItem>
                        <SelectItem value="seasons">Seizoenen</SelectItem>
                      </>
                    )}
                    {contentType === 'islamic' && category === 'worksheet' && (
                      <>
                        <SelectItem value="tracing">Overtrekken</SelectItem>
                        <SelectItem value="counting">Tellen</SelectItem>
                        <SelectItem value="emotions">Emoties & Gevoel</SelectItem>
                        <SelectItem value="routine">Dagelijkse Routine</SelectItem>
                      </>
                    )}
                    {contentType === 'universal' && category === 'worksheet' && (
                      <>
                        <SelectItem value="counting">Tellen</SelectItem>
                        <SelectItem value="shapes">Vormen</SelectItem>
                        <SelectItem value="differences">Zoek de Verschillen</SelectItem>
                        <SelectItem value="patterns">Patronen</SelectItem>
                      </>
                    )}
                    {category === 'educational' && (
                      <>
                        <SelectItem value="poster">Poster</SelectItem>
                        <SelectItem value="flashcard">Flashcard</SelectItem>
                        {contentType === 'islamic' && <SelectItem value="infographic">Infographic</SelectItem>}
                        {contentType === 'universal' && <SelectItem value="routine">Dagritme</SelectItem>}
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
                <SelectContent className="bg-white">
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
                {contentType === 'islamic' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Thema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {currentThemes.map(t => {
                  const Icon = t.icon
                  return (
                    <button
                      key={t.value}
                      onClick={() => setTheme(t.value)}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-lg border transition-all text-left",
                        theme === t.value
                          ? "bg-amber-50 border-amber-500 text-amber-700"
                          : "hover:bg-gray-50 border-gray-200"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-xs">{t.label}</span>
                    </button>
                  )
                })}
              </div>
              
              {/* Waarschuwing over tekst */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Let op:</strong> DALL-E 3 genereert vaak onleesbare tekst. 
                  Voor Nederlandse/Engelse labels kun je beter de afbeeldingen 
                  zonder tekst genereren en later tekst toevoegen.
                </p>
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
                <SelectContent className="bg-white">
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
                  rows={6}
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
                          ? "border-amber-500 shadow-lg"
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
                        <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Selected Image Details */}
                {selectedImage !== null && (
                  <div className="mt-6 space-y-4 p-4 bg-amber-50 rounded-lg">
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

                    {/* Save as Product */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-rose-500" />
                        Opslaan als Product
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="productName">Productnaam *</Label>
                          <Input
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="Bijv. Ramadan Kleurplaten Bundle"
                          />
                        </div>
                        <div>
                          <Label htmlFor="productDescription">Beschrijving</Label>
                          <Textarea
                            id="productDescription"
                            value={productDescription}
                            onChange={(e) => setProductDescription(e.target.value)}
                            rows={3}
                            placeholder="Beschrijf het product..."
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