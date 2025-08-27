import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { 
  Home, 
  Users, 
  Video, 
  ImageIcon, 
  Edit, 
  Palette, 
  Cpu, 
  Grid3X3, 
  MessageSquare, 
  Workflow, 
  FolderOpen, 
  BookOpen,
  Youtube,
  MessageCircle,
  Sparkles,
  Play,
  Wand2,
  Zap,
  ArrowUpRight,
  X
} from 'lucide-react'
import './App.css'

function App() {
  const [showPromo, setShowPromo] = useState(true)

  const sidebarItems = [
    { icon: Home, label: 'Home', count: 4, active: true },
    { icon: Users, label: 'Characters', count: 3, badge: 'NEW' },
    { icon: Video, label: 'Videos', count: 5 },
    { icon: ImageIcon, label: 'Create Image', count: 7 },
    { icon: Edit, label: 'Edit Image', count: 8 },
    { icon: Palette, label: 'Style Palettes', count: 9 },
    { icon: Cpu, label: 'Models', count: 10 },
    { icon: Grid3X3, label: 'Apps', count: 11 },
    { icon: MessageSquare, label: 'Community Feed', count: 12 },
    { icon: Workflow, label: 'ComfyUI Workflows', count: 13 },
    { icon: FolderOpen, label: 'My stuff', count: 14 },
    { icon: BookOpen, label: 'Resources' }
  ]

  const quickStarts = [
    {
      icon: Video,
      title: 'Image to Video',
      description: 'Bring your image to life',
      badge: 'New',
      color: 'bg-yellow-500'
    },
    {
      icon: Palette,
      title: 'Choose a Style',
      description: 'Start with a style you like',
      color: 'bg-green-500'
    },
    {
      icon: Cpu,
      title: 'Explore Models',
      description: 'See 100+ Fine-tuned models',
      color: 'bg-purple-500'
    },
    {
      icon: Wand2,
      title: 'Train Model',
      description: 'Customize your creativity',
      color: 'bg-purple-500'
    },
    {
      icon: ArrowUpRight,
      title: 'Ultimate Upscale',
      description: 'Upscale your images',
      color: 'bg-yellow-500'
    },
    {
      icon: MessageSquare,
      title: 'Image to Prompt',
      description: 'Convert image to text prompt',
      color: 'bg-green-500'
    }
  ]

  const featuredApps = [
    { title: 'Image to Video', author: 'OpenArt', badge: 'New' },
    { title: 'Ultimate Upscale', author: 'OpenArt' },
    { title: 'AI Filters', author: 'OpenArt' },
    { title: 'Sketch to image', author: 'OpenArt' },
    { title: 'Blend Board', author: 'OpenArt' },
    { title: 'Change Facial Expression', author: 'OpenArt' },
    { title: 'Expand', author: 'OpenArt' },
    { title: 'Remove background', author: 'OpenArt' }
  ]

  const models = [
    { title: 'Train your own model', subtitle: 'Customize your creativity', type: 'Custom' },
    { title: 'OpenArt SDXL', subtitle: 'OpenArt', type: 'SDXL', category: 'Standard' },
    { title: 'Flux (dev)', subtitle: 'Flux_dev', type: 'Flux', category: 'Standard' },
    { title: 'Flux Realism', subtitle: 'Flux_Realism', type: 'Flux', category: 'Photorealistic' }
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Promo Banner */}
      {showPromo && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 text-center relative">
          <div className="flex items-center justify-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">
              Limited-time offer! Unlock a year of limitless creativity with all annual plans at 50% off.
            </span>
            <Button variant="outline" size="sm" className="ml-2 bg-white/20 border-white/30 text-white hover:bg-white/30">
              View Plan
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={() => setShowPromo(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-4">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">OpenArt</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  item.active 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                    {item.badge}
                  </Badge>
                )}
                {item.count && (
                  <span className="text-xs bg-red-500 text-white rounded-full px-2 py-1 min-w-[20px] text-center">
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </nav>

          {/* Social Links */}
          <div className="mt-8 flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Youtube className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="border-purple-500 text-purple-400">
                16
              </Badge>
              <Badge variant="outline" className="border-blue-500 text-blue-400">
                +1
              </Badge>
              <Badge variant="outline" className="border-pink-500 text-pink-400">
                🎨
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-purple-500 text-purple-400 hover:bg-purple-500/20">
                Upgrade
                <span className="ml-1 bg-purple-500 text-white rounded px-1 text-xs">19</span>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Create
                <span className="ml-1 bg-purple-800 text-white rounded px-1 text-xs">20</span>
              </Button>
              <Button variant="outline">Sign In</Button>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl font-bold mb-12 text-center">What would you like to create?</h1>

          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Image Card */}
            <Card className="bg-blue-600 border-0 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl"></div>
                <div className="flex gap-4">
                  <Button className="bg-black/50 hover:bg-black/70 flex-1">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Create Image
                    <span className="ml-2 bg-red-500 text-white rounded px-1 text-xs">22</span>
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Image
                    <span className="ml-2 bg-red-500 text-white rounded px-1 text-xs">23</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Storytelling Card */}
            <Card className="bg-yellow-500 border-0 text-black overflow-hidden relative">
              <CardHeader>
                <CardTitle className="text-2xl">Storytelling</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="absolute top-4 right-4">
                  <Badge className="bg-black/20 text-black">Generating</Badge>
                </div>
                <div className="flex gap-4 mt-8">
                  <Button className="bg-black text-white hover:bg-gray-800 flex-1">
                    <Users className="h-4 w-4 mr-2" />
                    Consistent Character
                    <span className="ml-2 bg-red-500 text-white rounded px-1 text-xs">24</span>
                  </Button>
                  <Button className="bg-black text-white hover:bg-gray-800 flex-1">
                    <Video className="h-4 w-4 mr-2" />
                    Image To Video
                    <span className="ml-2 bg-red-500 text-white rounded px-1 text-xs">25</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Starts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Quick starts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickStarts.map((item, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${item.color}`}>
                        <item.icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          {item.badge && (
                            <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Featured Apps */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Apps</h2>
              <Badge variant="secondary" className="bg-green-500 text-white">New</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {featuredApps.slice(0, 8).map((app, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white text-sm">{app.title}</h3>
                      {app.badge && (
                        <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                          {app.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">By {app.author}</p>
                    <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                      Run
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              View All Flow Apps
            </Button>
          </div>

          {/* Models */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Start from a model</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {models.map((model, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-1">{model.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{model.subtitle}</p>
                    {model.type && (
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="border-purple-500 text-purple-400 text-xs">
                          {model.type}
                        </Badge>
                        {model.category && (
                          <Badge variant="outline" className="border-gray-500 text-gray-400 text-xs">
                            {model.category}
                          </Badge>
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                        Create
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700">
                        Gallery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
              View All Models
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

