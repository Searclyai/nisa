"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Loader2, Image as ImageIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Component() {
  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [seed, setSeed] = useState(0)
  const [steps, setSteps] = useState(50)
  const [cfgScale, setCfgScale] = useState(7)
  const [aspectRatio, setAspectRatio] = useState('1:1')
  const [enhancePrompt, setEnhancePrompt] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResult({
        image_url: 'https://picsum.photos/800/800',
        prompt: prompt,
        seed: seed,
        steps: steps,
        cfg_scale: cfgScale,
        aspect_ratio: aspectRatio,
        enhance_prompt: enhancePrompt
      })
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Luma Labs Dream Machine Demo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate Image</CardTitle>
            <CardDescription>Enter your prompt and adjust settings to generate an image</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="prompt">Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your image description"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="negativePrompt">Negative Prompt</Label>
                <Input
                  id="negativePrompt"
                  placeholder="Enter things to avoid in the image"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="seed">Seed</Label>
                <Input
                  id="seed"
                  type="number"
                  value={seed}
                  onChange={(e) => setSeed(parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Steps: {steps}</Label>
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
                <Label>CFG Scale: {cfgScale}</Label>
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
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Select aspect ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
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
                <Label htmlFor="enhancePrompt">Enhance Prompt</Label>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Image'
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
            <CardDescription>View the generated image and related information</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <Tabs defaultValue="image">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="image">Image</TabsTrigger>
                  <TabsTrigger value="info">Info</TabsTrigger>
                </TabsList>
                <TabsContent value="image">
                  {result.image_url ? (
                    <div className="aspect-square relative">
                      <img
                        src={result.image_url}
                        alt="Generated image"
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-md">
                      <ImageIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="info">
                  <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-gray-500">No image generated yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}