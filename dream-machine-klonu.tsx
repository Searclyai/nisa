"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Image as ImageIcon, Video, Cube, Save, Share2, User, LogOut, Upload } from 'lucide-react'
import { LumaCanvas, LumaViewer } from '@lumaai/luma-web'
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth"
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

const LUMA_API_KEY = process.env.NEXT_PUBLIC_LUMA_API_KEY

export default function DreamMachineKlonu() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [steps, setSteps] = useState(50)
  const [cfgScale, setCfgScale] = useState(7)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [activeTab, setActiveTab] = useState('2d')
  const [videoFile, setVideoFile] = useState(null)
  const [videoTo3DResult, setVideoTo3DResult] = useState(null)
  const { toast } = useToast()
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { t } = useTranslation('common')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!LUMA_API_KEY) {
      toast({
        title: t('apiKeyMissing'),
        description: t('pleaseSetApiKey'),
        variant: "destructive",
      })
    }
    if (!user) {
      router.push('/login')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/generate-scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          negative_prompt: negativePrompt,
          seed,
          steps,
          cfg_scale: cfgScale,
          aspect_ratio: aspectRatio,
          enhance_prompt: enhancePrompt
        })
      })
      if (!response.ok) {
        throw new Error('API yanıtı başarısız')
      }
      const data = await response.json()
      setResult(data)
      toast({
        title: t('sceneCreated'),
        description: t('sceneCreatedDescription'),
      })
    } catch (error) {
      console.error('Hata:', error)
      toast({
        title: t('error'),
        description: t('sceneCreationError'),
        variant: "destructive",
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    try {
      await fetch('/api/save-scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      })
      toast({
        title: t('sceneSaved'),
        description: t('sceneSavedDescription'),
      })
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      toast({
        title: t('error'),
        description: t('sceneSaveError'),
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    try {
      const response = await fetch('/api/share-scene', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result)
      })
      const { shareUrl } = await response.json()
      navigator.clipboard.writeText(shareUrl)
      toast({
        title: t('sceneShared'),
        description: t('sceneSharedDescription'),
      })
    } catch (error) {
      console.error('Paylaşma hatası:', error)
      toast({
        title: t('error'),
        description: t('sceneShareError'),
        variant: "destructive",
      })
    }
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
    }
  }

  const handleVideoTo3D = async () => {
    if (!videoFile) {
      toast({
        title: t('error'),
        description: t('pleaseSelectVideo'),
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('video', videoFile)

    try {
      const response = await fetch('/api/video-to-3d', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('API yanıtı başarısız')
      }

      const data = await response.json()
      setVideoTo3DResult(data)
      toast({
        title: t('3dPhotoCreated'),
        description: t('3dPhotoCreatedDescription'),
      })
    } catch (error) {
      console.error('Video to 3D dönüşüm hatası:', error)
      toast({
        title: t('error'),
        description: t('videoTo3dError'),
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{t('dreamMachineClone')}</h1>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><User className="mr-2 h-4 w-4" />{user?.name}</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('userProfile')}</DialogTitle>
                <DialogDescription>{t('userProfileDescription')}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">{t('name')}</Label>
                  <Input id="name" value={user?.name} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">{t('email')}</Label>
                  <Input id="email" value={user?.email} className="col-span-3" readOnly />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />{t('signOut')}</Button>
        </div>
      </header>
      <h2 className="text-2xl font-semibold mb-4 text-center">{t('advancedTechnology')}</h2>
      <Tabs defaultValue="text-to-3d">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="text-to-3d">{t('textTo3d')}</TabsTrigger>
          <TabsTrigger value="video-to-3d">{t('videoTo3d')}</TabsTrigger>
        </TabsList>
        <TabsContent value="text-to-3d">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>{t('createScene')}</CardTitle>
                <CardDescription>{t('createSceneDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="prompt">{t('prompt')}</Label>
                    <Textarea
                      id="prompt"
                      placeholder={t('promptPlaceholder')}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="negativePrompt">{t('negativePrompt')}</Label>
                    <Input
                      id="negativePrompt"
                      placeholder={t('negativePromptPlaceholder')}
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seed">{t('seed')}</Label>
                    <Input
                      id="seed"
                      type="number"
                      value={seed}
                      onChange={(e) => setSeed(parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>{t('steps', { count: steps })}</Label>
                    <Slider
                      min={10}
                      max={150}
                      step={1}
                      value={[steps]}
                      onValueChange={([value]) => setSteps(value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>{t('cfgScale', { scale: cfgScale })}</Label>
                    <Slider
                      min={1}
                      max={20}
                      step={0.1}
                      value={[cfgScale]}
                      onValueChange={([value]) => setCfgScale(value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="aspectRatio">{t('aspectRatio')}</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger className="w-full mt-1">
                        <SelectValue placeholder={t('selectAspectRatio')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1">{t('square')}</SelectItem>
                        <SelectItem value="4:3">4:3</SelectItem>
                        <SelectItem value="3:4">3:4</SelectItem>
                        <SelectItem value="16:9">16:9</SelectItem>
                        <SelectItem value="9:16">9:16</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enhancePrompt"
                      checked={enhancePrompt}
                      onCheckedChange={setEnhancePrompt}
                    />
                    <Label htmlFor="enhancePrompt">{t('enhancePrompt')}</Label>
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSubmit} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('generating')}
                    </>
                  ) : (
                    t('createScene')
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('result')}</CardTitle>
                <CardDescription>{t('resultDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {result ? (
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="2d">{t('2dPreview')}</TabsTrigger>
                      <TabsTrigger value="3d">{t('3dView')}</TabsTrigger>
                      <TabsTrigger value="info">{t('info')}</TabsTrigger>
                    </TabsList>
                    <TabsContent value="2d">
                      <div className="aspect-square relative">
                        <img
                          src={result.image_url}
                          alt={t('generatedScenePreview')}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="3d">
                      <div className="aspect-square relative">
                        <LumaCanvas>
                          <LumaViewer
                            capturePath={result.capture_id}
                            style={{ width: '100%', height: '100%' }}
                          />
                        </LumaCanvas>
                      </div>
                    </TabsContent>
                    <TabsContent value="info">
                      <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-md">
                    <Cube className="h-12 w-12 text-gray-400" />
                    <p className="text-gray-500  ml-2">{t('noSceneGenerated')}</p>
                  </div>
                )}
              </CardContent>
              {result && (
                <CardFooter className="flex justify-between">
                  <Button onClick={handleSave} className="flex items-center">
                    <Save className="mr-2 h-4 w-4" />
                    {t('save')}
                  </Button>
                  <Button onClick={handleShare} className="flex items-center">
                    <Share2 className="mr-2 h-4 w-4" />
                    {t('share')}
                  </Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="video-to-3d">
          <Card>
            <CardHeader>
              <CardTitle>{t('videoTo3dPhoto')}</CardTitle>
              <CardDescription>{t('videoTo3dPhotoDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="video-upload">{t('uploadVideo')}</Label>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="mt-1"
                  />
                </div>
                <Button onClick={handleVideoTo3D} disabled={loading || !videoFile} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    t('createFrom3dPhoto')
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
          {videoTo3DResult && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>{t('videoTo3dResult')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square relative">
                  <LumaCanvas>
                    <LumaViewer
                      capturePath={videoTo3DResult.capture_id}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </LumaCanvas>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={() => handleSave(videoTo3DResult)} className="flex items-center">
                  <Save className="mr-2 h-4 w-4" />
                  {t('save')}
                </Button>
                <Button onClick={() => handleShare(videoTo3DResult)} className="flex items-center">
                  <Share2 className="mr-2 h-4 w-4" />
                  {t('share')}
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      <Toast />
    </div>
  )
}