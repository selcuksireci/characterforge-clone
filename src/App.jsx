import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Camera,
  Check,
  ChevronLeft,
  CloudRain,
  Cloudy,
  Flame,
  ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Palette,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Sun,
  Upload,
  Wand2,
  X
} from 'lucide-react'
import './App.css'

const BODY_TIPS = [
  'Tam boy fotoğraf',
  'Düz arka plan',
  'İyi aydınlatma',
  'Temel/nötr kıyafet'
]

const MIN_REQUIREMENTS = {
  top: 1,
  bottomOrDress: 1,
  shoes: 1
}

const VALID_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/heic']
const MAX_FILE_SIZE = 10 * 1024 * 1024
const MIN_WIDTH = 800
const MIN_HEIGHT = 1200

const createPlaceholder = (text, color) =>
  `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='800'><defs><linearGradient id='grad' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' style='stop-color:${color};stop-opacity:0.85' /><stop offset='100%' style='stop-color:%23ffffff;stop-opacity:0.85' /></linearGradient></defs><rect width='100%' height='100%' rx='32' fill='url(%23grad)' /><text x='50%' y='50%' font-family='Inter' font-size='36' fill='%23000000' text-anchor='middle'>${encodeURIComponent(
    text
  )}</text></svg>`

const PLACEHOLDER_IMAGES = {
  bodyPhoto: createPlaceholder('VÜCUT FOTOĞRAFI', '%23fde68a'),
  bodyProcessed: createPlaceholder('ARABG · TEMİZ', '%23dcfce7'),
  bodyThumb: createPlaceholder('SEN', '%23e2e8f0'),
  heroBefore: createPlaceholder('ÖNCE', '%23fbcfe8'),
  heroAfter: createPlaceholder('SONRA', '%23bfdbfe'),
  outfit: createPlaceholder('AI KOMBİN', '%23c7d2fe'),
  editorBase: createPlaceholder('DÜZENLEYİCİ', '%23e0f2fe')
}

const SAMPLE_ITEMS = {
  üst: [
    {
      name: 'Lacivert V Yaka Tişört',
      colors: 'Lacivert, Pamuk',
      tags: ['casual', 'basic', 'versatile'],
      season: 'Yaz, İlkbahar',
      occasion: 'Günlük, İş',
      image: createPlaceholder('ÜST · Lacivert Tişört', '%23bfd7ff'),
      score: 0.92
    },
    {
      name: 'Beyaz Oxford Gömlek',
      colors: 'Beyaz, Pamuk',
      tags: ['formal', 'minimal', 'clean'],
      season: 'Her Mevsim',
      occasion: 'İş, Özel Davet',
      image: createPlaceholder('ÜST · Beyaz Gömlek', '%23e0e7ff'),
      score: 0.88
    }
  ],
  alt: [
    {
      name: 'Antrasit Kumaş Pantolon',
      colors: 'Koyu gri, Yün',
      tags: ['smart', 'workwear'],
      season: 'Sonbahar, Kış',
      occasion: 'İş, Özel Davet',
      image: createPlaceholder('ALT · Antrasit Pantolon', '%23d2d6dc'),
      score: 0.9
    },
    {
      name: 'Açık Mavi Mom Jean',
      colors: 'Açık mavi, Denim',
      tags: ['casual', 'city'],
      season: 'İlkbahar, Yaz',
      occasion: 'Günlük, Hafta Sonu',
      image: createPlaceholder('ALT · Mom Jean', '%23cfe8ff'),
      score: 0.86
    }
  ],
  elbise: [
    {
      name: 'Siyah Midi Elbise',
      colors: 'Siyah, Viskon',
      tags: ['elegant', 'evening'],
      season: 'Her Mevsim',
      occasion: 'Özel Davet, Gece',
      image: createPlaceholder('ELBİSE · Midi', '%23d6d3f0'),
      score: 0.93
    }
  ],
  ayakkabı: [
    {
      name: 'Beyaz Sneaker',
      colors: 'Beyaz, Deri',
      tags: ['casual', 'sporty'],
      season: 'Her Mevsim',
      occasion: 'Günlük, Hafta Sonu',
      image: createPlaceholder('AYAKKABI · Sneaker', '%23f1f5f9'),
      score: 0.89
    },
    {
      name: 'Kahve Deri Loafer',
      colors: 'Kahverengi, Deri',
      tags: ['formal', 'classic'],
      season: 'İlkbahar, Sonbahar',
      occasion: 'İş, Özel Davet',
      image: createPlaceholder('AYAKKABI · Loafer', '%23f2ebe3'),
      score: 0.91
    }
  ],
  'dış-giyim': [
    {
      name: 'Bej Trençkot',
      colors: 'Bej, Pamuk',
      tags: ['classic', 'city'],
      season: 'İlkbahar, Sonbahar',
      occasion: 'Günlük, İş',
      image: createPlaceholder('DIŞ GİYİM · Trençkot', '%23f6ede4'),
      score: 0.84
    }
  ]
}

const ANALYSIS_STEPS = [
  'Ürün tipi belirleniyor',
  'Renkler analiz ediliyor',
  'Mevsim tahmini yapılıyor'
]

const MAIN_REASONINGS = [
  'Renk uyumu mükemmel',
  'Hava durumuna uygun',
  'Stil tutarlı'
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const OutfitCard = ({ outfit, onEdit }) => (
  <div className="rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5">
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-500">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">Bugün Ne Giysem?</p>
          <h2 className="text-xl font-semibold text-gray-900">{outfit.name}</h2>
        </div>
      </div>
      <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-600">
        <ShieldCheck className="h-4 w-4" /> AI Güveni: {(outfit.score * 100).toFixed(0)}%
      </div>
    </div>

    <div className="mt-6 overflow-hidden rounded-2xl bg-gray-100">
      <img src={outfit.image} alt="Outfit" className="h-72 w-full object-cover" />
    </div>

    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Kombin Detayları</h3>
      <div className="mt-3 grid grid-cols-4 gap-3 text-center text-sm">
        {outfit.items.map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white py-4">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <item.icon className="h-5 w-5 text-gray-600" />
            </div>
            <p className="mt-2 font-medium text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500">{item.name}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="mt-6 space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">Neden Bu Kombin?</h3>
      <ul className="space-y-1 text-sm text-gray-700">
        {MAIN_REASONINGS.map((reason) => (
          <li key={reason} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-500" /> {reason}
          </li>
        ))}
      </ul>
    </div>

    <div className="mt-6 flex flex-wrap gap-3">
      <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800">
        ❤️ Beğendim
      </button>
      <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
        🔄 Başka Göster
      </button>
      <button
        onClick={onEdit}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
      >
        ✏️ Düzenle
      </button>
      <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
        👔 Giydim
      </button>
    </div>
  </div>
)

const WardrobeItemCard = ({ item, onEdit, onRemove }) => (
  <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur">
    <div className="overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="relative h-36 w-full">
        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 rounded-xl border border-white/60" />
      </div>
    </div>
    <div>
      <h4 className="text-base font-semibold text-gray-900">{item.name}</h4>
      <div className="mt-1 text-sm text-gray-600">{item.colors}</div>
      <div className="mt-1 text-sm text-gray-600">
        <span className="font-medium">Mevsim:</span> {item.season}
      </div>
      <div className="text-sm text-gray-600">
        <span className="font-medium">Kullanım:</span> {item.occasion}
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {item.tags.map((tag) => (
        <span key={tag} className="rounded-full bg-gray-900/5 px-3 py-1 text-xs font-medium text-gray-600">
          #{tag}
        </span>
      ))}
    </div>
    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
      <span>AI Skoru: {(item.score * 100).toFixed(0)}%</span>
      <div className="flex gap-2">
        <button onClick={() => onEdit(item)} className="font-medium text-gray-700 underline-offset-2 hover:underline">
          Düzenle
        </button>
        <button onClick={() => onRemove(item)} className="font-medium text-rose-500 underline-offset-2 hover:underline">
          Sil
        </button>
      </div>
    </div>
  </div>
)

const WardrobeProgress = ({ wardrobeItems }) => {
  const counts = useMemo(() => {
    const top = wardrobeItems.filter((item) => item.category === 'üst').length
    const bottom = wardrobeItems.filter((item) => item.category === 'alt').length
    const dresses = wardrobeItems.filter((item) => item.category === 'elbise').length
    const shoes = wardrobeItems.filter((item) => item.category === 'ayakkabı').length
    return {
      top,
      bottom,
      dresses,
      shoes,
      bottomOrDress: bottom + dresses
    }
  }, [wardrobeItems])

  const minReached =
    counts.top >= MIN_REQUIREMENTS.top && counts.bottomOrDress >= MIN_REQUIREMENTS.bottomOrDress && counts.shoes >= MIN_REQUIREMENTS.shoes

  return (
    <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 backdrop-blur">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">İlk kombin için hedefin</h3>
        <div className={classNames('flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold', minReached ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
          {counts.top + counts.bottom + counts.dresses + counts.shoes}/3 parça
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-gray-700 sm:grid-cols-2">
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
          <span>Üst Giyim</span>
          <span className="font-semibold">{counts.top}/1</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
          <span>Alt veya Elbise</span>
          <span className="font-semibold">{counts.bottomOrDress}/1</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
          <span>Ayakkabı</span>
          <span className="font-semibold">{counts.shoes}/1</span>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
          <span>Toplam Parça</span>
          <span className="font-semibold">{wardrobeItems.length}</span>
        </div>
      </div>
      {!minReached && (
        <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          İlk kombinini oluşturmak için en az 3 parça eklemen yeterli. Devam etmek için eksik kategorileri tamamla.
        </div>
      )}
    </div>
  )
}

const WeatherBanner = () => (
  <div className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-sky-100 via-white to-emerald-100 p-6">
    <div className="flex items-center gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-500 shadow">
        <Sun className="h-8 w-8" />
      </div>
      <div>
        <p className="text-sm font-medium text-sky-600">Bugünkü Hava</p>
        <h2 className="text-2xl font-semibold text-gray-900">18°C · Parçalı Bulutlu</h2>
      </div>
    </div>
    <div className="flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <CloudRain className="h-5 w-5" /> %10 yağış
      </div>
      <div className="flex items-center gap-2">
        <Cloudy className="h-5 w-5" /> Hafif rüzgar
      </div>
    </div>
  </div>
)

const SectionTitle = ({ title, description, icon: Icon }) => (
  <div className="flex items-center gap-3">
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900/90 text-white">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
)

function App() {
  const [step, setStep] = useState('landing')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedPhoto, setUploadedPhoto] = useState(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [wardrobeItems, setWardrobeItems] = useState([])
  const [analysisStep, setAnalysisStep] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [formError, setFormError] = useState('')

  const cameraInputRef = useRef(null)
  const galleryInputRef = useRef(null)

  const sampleBodyPhoto = PLACEHOLDER_IMAGES.bodyPhoto

  useEffect(() => {
    let timer
    if (processing) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer)
            setProcessing(false)
            setStep('photoReady')
            return 100
          }
          return Math.min(100, prev + Math.floor(Math.random() * 15))
        })
      }, 600)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [processing])

  useEffect(() => {
    let timer
    if (isAnalyzing) {
      timer = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev === ANALYSIS_STEPS.length - 1) {
            clearInterval(timer)
            setIsAnalyzing(false)
            return prev
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [isAnalyzing])

  const resetUploadState = () => {
    setUploadedPhoto(null)
    setUploadedFileName('')
    setUploadError('')
    setProgress(0)
    setProcessing(false)
  }

  const validateAndLoadPhoto = (file) => {
    if (!file) return

    if (!VALID_PHOTO_TYPES.includes(file.type)) {
      setUploadError('Desteklenmeyen dosya formatı. Lütfen JPG, PNG veya HEIC yükleyin.')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('Dosya boyutu çok büyük. Maksimum 10MB yükleyebilirsin.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result !== 'string') {
        setUploadError('Fotoğraf okunurken sorun oluştu. Tekrar dene.')
        return
      }

      const image = new Image()
      image.onload = () => {
        if (image.width < MIN_WIDTH || image.height < MIN_HEIGHT) {
          setUploadError('Fotoğraf çözünürlüğü çok düşük. Minimum 800x1200 piksel olmalı.')
          return
        }

        if (image.height < image.width) {
          setUploadError('Lütfen dikey (portre) bir fotoğraf yükle.')
          return
        }

        setUploadedPhoto(result)
        setUploadedFileName(file.name)
        setUploadError('')
        setProcessing(false)
        setProgress(0)
        setIsDragging(false)
      }
      image.onerror = () => {
        setUploadError('Fotoğraf doğrulanamadı. Başka bir fotoğraf yüklemeyi dene.')
      }
      image.src = result
    }
    reader.onerror = () => {
      setUploadError('Fotoğraf okunurken bir hata oluştu.')
    }
    reader.readAsDataURL(file)
  }

  const handleInputChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      validateAndLoadPhoto(file)
    }
    event.target.value = ''
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) {
      validateAndLoadPhoto(file)
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    if (!isDragging) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    if (event.relatedTarget && event.currentTarget.contains(event.relatedTarget)) return
    setIsDragging(false)
  }

  const openCameraPicker = () => {
    setUploadError('')
    cameraInputRef.current?.click()
  }

  const openGalleryPicker = () => {
    setUploadError('')
    galleryInputRef.current?.click()
  }

  const startProcessing = () => {
    if (!uploadedPhoto) return
    setShowUploadModal(false)
    setStep('processing')
    setProcessing(true)
    setProgress(0)
  }

  const handleCloseSaveModal = () => {
    setShowSaveModal(false)
    setShowEmailForm(false)
    setFormError('')
    setEmail('')
    setPassword('')
    setAcceptTerms(false)
  }

  const handleGuestContinue = () => {
    setShowSuccess(true)
    handleCloseSaveModal()
    setTimeout(() => {
      setShowSuccess(false)
      setStep('main')
    }, 2500)
  }

  const handleEmailSubmit = (event) => {
    event.preventDefault()

    if (!email.trim()) {
      setFormError('Lütfen geçerli bir email adresi gir.')
      return
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email.trim())) {
      setFormError('Email formatı geçerli değil.')
      return
    }

    if (password.length < 8) {
      setFormError('Şifren en az 8 karakter olmalı.')
      return
    }

    if (!acceptTerms) {
      setFormError('Devam etmek için kullanım koşullarını kabul etmelisin.')
      return
    }

    setFormError('')
    setShowSuccess(true)
    handleCloseSaveModal()
    setTimeout(() => {
      setShowSuccess(false)
      setStep('main')
    }, 2500)
  }

  const resetFlow = () => {
    setWardrobeItems([])
    setStep('landing')
    resetUploadState()
    setShowUploadModal(false)
    setIsDragging(false)
    setShowSaveModal(false)
    setShowEmailForm(false)
    setShowSuccess(false)
    setEmail('')
    setPassword('')
    setAcceptTerms(false)
    setFormError('')
  }

  const addWardrobeItem = (categoryKey) => {
    const options = SAMPLE_ITEMS[categoryKey]
    if (!options) return

    setIsAnalyzing(true)
    setAnalysisStep(0)

    setTimeout(() => {
      const option = options[Math.floor(Math.random() * options.length)]
      setWardrobeItems((prev) => [
        ...prev,
        {
          id: `${categoryKey}-${Date.now()}`,
          category: categoryKey,
          ...option
        }
      ])
      setIsAnalyzing(false)
    }, 3200)
  }

  const removeWardrobeItem = (item) => {
    setWardrobeItems((prev) => prev.filter((wardrobeItem) => wardrobeItem.id !== item.id))
  }

  const canContinue = useMemo(() => {
    const counts = {
      top: wardrobeItems.filter((item) => item.category === 'üst').length,
      bottomOrDress:
        wardrobeItems.filter((item) => item.category === 'alt').length +
        wardrobeItems.filter((item) => item.category === 'elbise').length,
      shoes: wardrobeItems.filter((item) => item.category === 'ayakkabı').length
    }

    return (
      counts.top >= MIN_REQUIREMENTS.top &&
      counts.bottomOrDress >= MIN_REQUIREMENTS.bottomOrDress &&
      counts.shoes >= MIN_REQUIREMENTS.shoes
    )
  }, [wardrobeItems])

  const groupedWardrobe = useMemo(() => {
    return wardrobeItems.reduce(
      (acc, item) => {
        const key = item.category
        if (!acc[key]) acc[key] = []
        acc[key].push(item)
        return acc
      },
      { üst: [], alt: [], elbise: [], 'dış-giyim': [], ayakkabı: [] }
    )
  }, [wardrobeItems])

  const outfit = {
    name: 'Perşembe Kombini',
    score: 0.95,
    image: PLACEHOLDER_IMAGES.outfit,
    items: [
      { label: 'Üst', name: 'Lacivert V Yaka Tişört', icon: Sparkles },
      { label: 'Alt', name: 'Antrasit Kumaş Pantolon', icon: Flame },
      { label: 'Ayakkabı', name: 'Kahve Deri Loafer', icon: ShieldCheck },
      { label: 'Dış', name: 'Bej Trençkot', icon: Wand2 }
    ]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-sky-50">
      {/* Landing */}
      {step === 'landing' && (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16">
          <header className="text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-gray-900 px-4 py-2 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-widest">Kişisel Stil Asistanım</span>
            </div>
            <h1 className="mt-8 text-4xl font-bold text-gray-900 sm:text-5xl">
              Senin Üzerinde Kombinler Dene
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-gray-600">
              Başlamak için fotoğrafını yükle ve yapay zekâ senin için kişiselleştirilmiş kombin önerileri oluştursun.
            </p>
          </header>

          <div className="mt-12 grid w-full gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative overflow-hidden rounded-3xl bg-gray-900 p-10 text-white shadow-xl">
              <div className="space-y-6">
                <div className="rounded-2xl bg-white/10 p-6">
                  <p className="text-sm text-gray-200">Önce</p>
                  <img src={PLACEHOLDER_IMAGES.heroBefore} alt="Before" className="mt-4 h-56 w-full rounded-2xl object-cover" />
                </div>
                <div className="rounded-2xl bg-white p-6 text-gray-900">
                  <p className="text-sm font-medium text-gray-500">Sonra</p>
                  <img src={PLACEHOLDER_IMAGES.heroAfter} alt="After" className="mt-4 h-56 w-full rounded-2xl object-cover" />
                </div>
              </div>
              <div className="absolute inset-x-10 bottom-10 flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Gerçek kullanıcı deneyimi · 30 sn</span>
                </div>
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">AI Destekli</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 backdrop-blur">
                <p className="text-sm font-semibold uppercase tracking-widest text-rose-500">Adım 1</p>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">Vücut Fotoğrafını Yükle</h2>
                <p className="mt-3 text-sm text-gray-600">
                  Kişiselleştirilmiş kombin önerileri için tam boy bir fotoğraf yükleyerek başlayalım. Her şey senin üzerinde gerçekleşecek.
                </p>
                <button
                  onClick={() => {
                    setShowUploadModal(true)
                    setUploadError('')
                    setIsDragging(false)
                  }}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
                >
                  <Camera className="h-5 w-5" /> Fotoğrafımı Yükle
                </button>
                <button className="mt-4 text-sm font-medium text-gray-500 underline-offset-2 hover:underline">Nasıl çalışır?</button>
              </div>

              <div className="grid gap-4 text-sm text-gray-600">
                <div className="rounded-3xl border border-gray-200 bg-white/60 p-6 backdrop-blur">
                  <h3 className="font-semibold text-gray-900">Neden fotoğraf?</h3>
                  <p className="mt-2 text-sm">AI, vücut hatlarını analiz ederek senin için en doğru kombinleri oluşturur. Her şey gizliliğin korunarak işlenir.</p>
                </div>
                <div className="rounded-3xl border border-gray-200 bg-white/60 p-6 backdrop-blur">
                  <h3 className="font-semibold text-gray-900">%100 Gizlilik</h3>
                  <p className="mt-2 text-sm">Fotoğrafın şifreli olarak saklanır ve yalnızca kombin oluşturma amacıyla kullanılır.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Processing */}
      {step === 'processing' && (
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
          <SectionTitle
            title="AI Fotoğrafını İşliyor"
            description="Senin için arka plan temizleniyor ve vücut analizi yapılıyor"
            icon={Sparkles}
          />
          <div className="mt-10 grid gap-8 rounded-3xl border border-gray-200 bg-white/80 p-10 backdrop-blur">
            <div className="overflow-hidden rounded-2xl border border-dashed border-gray-300 bg-white">
              <img src={uploadedPhoto || sampleBodyPhoto} alt="Body preview" className="h-96 w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Fotoğrafın yükleniyor... {progress}%</p>
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
                <div className="h-full rounded-full bg-gray-900" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <Loader2 className="h-4 w-4 animate-spin" /> Arka plan temizleniyor
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <Loader2 className="h-4 w-4 animate-spin" /> Vücut analizi yapılıyor
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-700">
                <Loader2 className="h-4 w-4 animate-spin" /> Fotoğraf optimize ediliyor
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Ready */}
      {step === 'photoReady' && (
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
          <SectionTitle
            title="Fotoğrafın Hazır"
            description="Bu fotoğraf senin üzerinde kombinleri denemek için kullanılacak"
            icon={Check}
          />
          <div className="mt-10 grid gap-8 rounded-3xl border border-gray-200 bg-white/80 p-10 backdrop-blur">
            <div className="grid gap-6 sm:grid-cols-[2fr,1fr]">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 p-6">
                <div className="rounded-2xl border border-white/60 bg-white/70 p-4">
                  <img src={PLACEHOLDER_IMAGES.bodyProcessed} alt="Processed body" className="mx-auto h-[420px] object-contain" />
                </div>
              </div>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">Ne yaptık?</p>
                  <ul className="mt-3 space-y-2">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" /> Arka planını temizledik
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" /> Vücut hatlarını analiz ettik
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" /> Fotoğrafı optimize ettik
                    </li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">Gizlilik</p>
                  <p className="mt-2 text-sm">Fotoğrafın yalnızca kombin oluşturmak için kullanılır. 7 gün boyunca şifreli olarak saklanır.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setStep('wardrobe')}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-gray-800"
              >
                <Sparkles className="h-5 w-5" /> Gardırop Oluşturmaya Geç
              </button>
              <button onClick={resetFlow} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-4 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
                <RefreshCcw className="h-5 w-5" /> Yeni Fotoğraf Yükle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wardrobe Creation */}
      {step === 'wardrobe' && (
        <div className="mx-auto min-h-screen max-w-6xl px-6 py-16">
          <SectionTitle
            title="Gardırobunu Oluştur"
            description="AI parçalarını analiz ederek kombinler için hazır hale getiriyor"
            icon={Palette}
          />

          <div className="mt-10 grid gap-10 lg:grid-cols-[2fr,1fr]">
            <div className="space-y-8">
              <div className="flex items-center justify-between rounded-3xl border border-gray-200 bg-white/80 p-6 backdrop-blur">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl border border-gray-200">
                    <img src={PLACEHOLDER_IMAGES.bodyThumb} alt="Body thumb" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Gardırobun henüz boş</p>
                    <h2 className="text-2xl font-semibold text-gray-900">Kıyafetlerini ekle ve AI çalışsın</h2>
                  </div>
                </div>
                <div className="hidden text-sm font-medium text-gray-500 lg:block">
                  İlk kombin için en az 3 parça eklemen yeterli.
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {['üst', 'alt', 'elbise', 'ayakkabı', 'dış-giyim'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      addWardrobeItem(category)
                    }}
                    className="flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-gray-800"
                  >
                    <Plus className="h-4 w-4" /> {category === 'dış-giyim' ? 'Dış Giyim' : category.charAt(0).toUpperCase() + category.slice(1)} Ekle
                  </button>
                ))}
                <button className="flex items-center gap-2 rounded-full border border-dashed border-gray-400 px-6 py-3 text-sm font-semibold text-gray-500">
                  <Upload className="h-4 w-4" /> Toplu Yükle (10+)
                </button>
              </div>

              {isAnalyzing && (
                <div className="rounded-3xl border border-gray-200 bg-white/90 p-8 backdrop-blur">
                  <h3 className="text-lg font-semibold text-gray-900">AI analiz ediyor...</h3>
                  <p className="mt-2 text-sm text-gray-600">Seçtiğin parçayı saniyeler içinde anlamlandırıyoruz.</p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    {ANALYSIS_STEPS.map((label, index) => (
                      <div key={label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          {analysisStep >= index ? (
                            <Check className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          )}
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {wardrobeItems.length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(groupedWardrobe)
                    .filter(([, items]) => items.length > 0)
                    .map(([category, items]) => (
                      <div key={category} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {category === 'dış-giyim'
                              ? 'Dış Giyim'
                              : category.charAt(0).toUpperCase() + category.slice(1)}{' '}
                            ({items.length})
                          </h3>
                          <button className="text-sm font-medium text-gray-500 underline-offset-2 hover:underline">Düzenle</button>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          {items.map((item) => (
                            <WardrobeItemCard key={item.id} item={item} onEdit={() => {}} onRemove={removeWardrobeItem} />
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-white/70 p-16 text-center text-sm text-gray-500">
                  Henüz eklenmiş ürün yok. Üstteki butonları kullanarak gardırobuna parçalar ekle.
                </div>
              )}
            </div>

            <div className="space-y-6">
              <WardrobeProgress wardrobeItems={wardrobeItems} />

              <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-gray-900">İpuçları</h3>
                <ul className="mt-4 space-y-3 text-sm text-gray-600">
                  <li>• İlk kombinini oluşturmak için üst + alt veya elbise + ayakkabı yeterli.</li>
                  <li>• Parçaları ne kadar detaylı tanımlarsan AI o kadar iyi sonuç verir.</li>
                  <li>• Çoklu seçimle toplu yüklemeleri destekliyoruz.</li>
                </ul>
              </div>

              <div className="rounded-3xl border border-gray-200 bg-white/80 p-6 backdrop-blur">
                <h3 className="text-lg font-semibold text-gray-900">Kategori Dağılımı</h3>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-between">
                    <span>Üst</span>
                    <span className="font-semibold">{groupedWardrobe['üst'].length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Alt</span>
                    <span className="font-semibold">{groupedWardrobe['alt'].length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Elbise</span>
                    <span className="font-semibold">{groupedWardrobe['elbise'].length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ayakkabı</span>
                    <span className="font-semibold">{groupedWardrobe['ayakkabı'].length}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSaveModal(true)
                  setShowEmailForm(false)
                  setFormError('')
                }}
                disabled={!canContinue}
                className={classNames(
                  'flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition',
                  canContinue ? 'bg-gray-900 text-white shadow-lg hover:bg-gray-800' : 'cursor-not-allowed bg-gray-200 text-gray-500'
                )}
              >
                <Check className="h-5 w-5" /> Kaydet ve Devam Et
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main App */}
      {step === 'main' && (
        <div className="mx-auto min-h-screen max-w-6xl px-6 py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-gray-200">
                <img src={PLACEHOLDER_IMAGES.bodyThumb} alt="Avatar" className="h-full w-full object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Hoş geldin</p>
                <h1 className="text-3xl font-semibold text-gray-900">Bugün Ne Giysem?</h1>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin className="h-4 w-4" /> İstanbul, TR
            </div>
          </div>

          <div className="mt-10 space-y-10">
            <WeatherBanner />
            <OutfitCard outfit={outfit} onEdit={() => setShowEditor(true)} />
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2">
            <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 backdrop-blur">
              <SectionTitle title="Takvim" description="Planlanan kombinlerini gör" icon={CalendarIcon} />
              <div className="mt-6 grid gap-6 text-sm text-gray-600">
                <CalendarRow day="12 Kasım" status="Giyildi" color="emerald" outfit="Toplantı Kombini" />
                <CalendarRow day="13 Kasım" status="Planlandı" color="amber" outfit="Özel Davet" />
                <CalendarRow day="14 Kasım" status="AI önerisi" color="sky" outfit="Casual Cuma" />
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white/80 p-8 backdrop-blur">
              <SectionTitle title="İstatistikler" description="Gardırobunun nabzını tut" icon={Flame} />
              <div className="mt-6 space-y-5 text-sm text-gray-600">
                <StatRow label="Bu ay giyilen kombin" value="18" />
                <StatRow label="Toplam parça" value="47" />
                <StatRow label="En çok giyilen parça" value="Beyaz Sneaker" />
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="font-semibold text-gray-900">AI Önerisi</p>
                  <p className="mt-2 text-sm">Mor eteğini uzun süredir giymedin. Bu hafta kombinlemeyi deneyelim mi?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-10 backdrop-blur">
          <div className="relative w-full max-w-2xl rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur">
            <button onClick={() => setShowUploadModal(false)} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500">
              <ChevronLeft className="h-4 w-4" /> Vücut Fotoğrafı Yükle
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">Referans Fotoğrafın</h2>
            <p className="mt-2 text-sm text-gray-600">Mobilde kameranı kullanabilir veya galerinden seçebilirsin.</p>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleInputChange}
            />
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/heic"
              className="hidden"
              onChange={handleInputChange}
            />

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <button
                onClick={openCameraPicker}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
              >
                <Camera className="h-6 w-6" /> Kamerayla Çek
              </button>
              <button
                onClick={openGalleryPicker}
                className="flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-6 py-8 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
              >
                <ImageIcon className="h-6 w-6" /> Galeriden Seç
              </button>
              <div className="md:col-span-2">
                <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  <span className="h-px flex-1 bg-gray-200" /> veya <span className="h-px flex-1 bg-gray-200" />
                </div>
                <div
                  onClick={openGalleryPicker}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={classNames(
                    'mt-3 cursor-pointer rounded-2xl border border-dashed p-10 text-center text-sm transition',
                    isDragging ? 'border-sky-400 bg-sky-50 text-sky-600' : 'border-gray-300 bg-white/60 text-gray-500'
                  )}
                >
                  <Upload className={classNames('mx-auto h-6 w-6', isDragging ? 'text-sky-500' : 'text-gray-400')} />
                  <p className="mt-3">Fotoğrafını sürükle & bırak veya tıkla</p>
                </div>
              </div>
            </div>

            {uploadedPhoto && (
              <div className="mt-6 grid gap-4 rounded-2xl border border-gray-200 bg-white/80 p-4">
                <div className="overflow-hidden rounded-xl bg-gray-100">
                  <img src={uploadedPhoto} alt="Seçilen fotoğraf" className="mx-auto h-80 w-full object-contain" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                  <span className="truncate font-medium" title={uploadedFileName}>
                    {uploadedFileName || 'Seçilen fotoğraf'}
                  </span>
                  <button onClick={resetUploadState} className="text-sm font-medium text-rose-500 underline-offset-2 hover:underline">
                    Fotoğrafı değiştir
                  </button>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{uploadError}</div>
            )}

            <div className="mt-6 grid gap-3 rounded-2xl bg-gray-50 p-6 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">İpuçları</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {BODY_TIPS.map((tip) => (
                  <li key={tip} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" /> {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={startProcessing}
                disabled={!uploadedPhoto}
                className={classNames(
                  'flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-4 text-sm font-semibold transition',
                  uploadedPhoto ? 'bg-gray-900 text-white hover:bg-gray-800' : 'cursor-not-allowed bg-gray-200 text-gray-500'
                )}
              >
                {processing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />} Fotoğrafı İşle
              </button>
              {!uploadedPhoto && (
                <button
                  onClick={() => {
                    setUploadError('')
                    openGalleryPicker()
                  }}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-4 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                >
                  <ImageIcon className="h-5 w-5" /> Dosya Seç
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur">
          <div className="relative w-full max-w-xl rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur">
            <button onClick={handleCloseSaveModal} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>
            {!showEmailForm ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-900">Gardırobun Hazır!</h2>
                <p className="mt-2 text-sm text-gray-600">
                  Kombinlerini kaydetmek ve her gün yeni öneriler almak için kayıt ol. Dilersen şimdilik misafir olarak devam edebilirsin.
                </p>
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => {
                      setShowEmailForm(true)
                      setFormError('')
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <Mail className="h-4 w-4" /> Email ile Kayıt Ol
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-gray-700 ring-1 ring-gray-300">G</span>{' '}
                    Google ile Devam Et
                  </button>
                  <button className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-semibold text-white"></span>{' '}
                    Apple ile Devam Et
                  </button>
                  <button
                    onClick={handleGuestContinue}
                    className="w-full text-sm font-medium text-gray-500 underline-offset-2 hover:underline"
                  >
                    Kayıt Olmadan Devam Et (7 gün saklanır)
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Hızlı Kayıt</h2>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                    placeholder="ornek@email.com"
                  />
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Şifre
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
                    placeholder="Min 8 karakter"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(event) => setAcceptTerms(event.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />{' '}
                  Kullanım koşullarını kabul ediyorum
                </label>
                {formError && <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{formError}</div>}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailForm(false)
                      setFormError('')
                    }}
                    className="flex-1 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                  >
                    Geri Dön
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Kaydet ve Devam Et
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10 backdrop-blur">
          <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-3xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-500">
              <Check className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Harika!</h2>
            <p className="text-center text-sm text-gray-600">Gardırobun kaydedildi. Şimdi senin için kombinler oluşturuyoruz...</p>
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </div>
      )}

      {showEditor && <ManualEditor onClose={() => setShowEditor(false)} />}
    </div>
  )
}

const CalendarIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M7 3v2M17 3v2M3 11h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CalendarRow = ({ day, status, outfit, color }) => (
  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
    <div>
      <p className="text-sm font-semibold text-gray-900">{day}</p>
      <p className="text-xs text-gray-500">{outfit}</p>
    </div>
    <span
      className={classNames(
        'rounded-full px-3 py-1 text-xs font-semibold capitalize',
        color === 'emerald' && 'bg-emerald-100 text-emerald-600',
        color === 'amber' && 'bg-amber-100 text-amber-600',
        color === 'sky' && 'bg-sky-100 text-sky-600'
      )}
    >
      {status}
    </span>
  </div>
)

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between rounded-2xl bg-gray-50 px-4 py-3">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
)

function ManualEditor({ onClose }) {
  const [selectedTab, setSelectedTab] = useState('üst')
  const [currentSelection, setCurrentSelection] = useState({
    üst: SAMPLE_ITEMS['üst'][0],
    alt: SAMPLE_ITEMS['alt'][0],
    ayakkabı: SAMPLE_ITEMS['ayakkabı'][0],
    'dış-giyim': SAMPLE_ITEMS['dış-giyim'][0]
  })

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900">Kombini Düzenle</h2>
        </div>
        <button className="rounded-full bg-gray-900 px-6 py-2 text-sm font-semibold text-white hover:bg-gray-800">Kaydet</button>
      </div>
      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 p-6">
          <div className="relative max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg">
            <img src={PLACEHOLDER_IMAGES.editorBase} alt="Editor base" className="h-[520px] w-full object-cover" />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/80 px-4 py-3 text-sm text-gray-600 backdrop-blur">
              Renk Uyumu: %85 🟢
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto border-t border-gray-200 bg-white p-6 lg:border-l lg:border-t-0">
          <div className="flex flex-wrap gap-2">
            {['üst', 'alt', 'ayakkabı', 'dış-giyim'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={classNames(
                  'rounded-full px-4 py-2 text-sm font-semibold capitalize',
                  selectedTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {tab === 'dış-giyim' ? 'Dış Giyim' : tab}
              </button>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {SAMPLE_ITEMS[selectedTab]?.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentSelection((prev) => ({ ...prev, [selectedTab]: item }))}
                  className={classNames(
                    'flex flex-col items-start gap-3 rounded-2xl border px-4 py-4 text-left text-sm transition',
                    currentSelection[selectedTab]?.name === item.name
                      ? 'border-gray-900 bg-gray-900/5'
                      : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="flex w-full items-center gap-3">
                    <div className="h-16 w-16 overflow-hidden rounded-xl border border-gray-200">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.colors}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">AI Önerileri</p>
              <p className="mt-2">Bu üst ile antrasit pantolon ve beyaz sneaker harika uyum sağlıyor. Renk uyumu %92.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
