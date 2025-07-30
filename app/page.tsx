"use client"

import type React from "react"
import { createPortal } from "react-dom"
import { useState, createContext, useContext, useRef, useEffect } from "react"
import {
  Search,
  Star,
  Calendar,
  Clock,
  AlertCircle,
  Sun,
  Moon,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
  HelpCircle,
  PanelLeftClose,
  Menu,
  ArrowUp,
} from "lucide-react"

const themes = {
  dark: {
    name: "Dark",
    primary: "bg-black",
    primaryColorValue: "#000000",
    secondary: "bg-gray-900",
    tertiary: "bg-gray-800",
    accent: "bg-red-600",
    accentHover: "bg-red-700",
    text: "text-white",
    textSecondary: "text-gray-300",
    textMuted: "text-gray-400",
    border: "border-gray-700",
    borderLight: "border-gray-800",
    hover: "hover:bg-gray-700",
    overlay: "bg-black/80",
    ring: "red",
    scrollbar: {
      track: "#000000",
      thumb: "#374151",
      thumbHover: "#4b5563",
    },
  },
  light: {
    name: "Light",
    primary: "bg-white",
    primaryColorValue: "#00000099",
    secondary: "bg-gray-50",
    tertiary: "bg-gray-100",
    accent: "bg-blue-600",
    accentHover: "bg-blue-700",
    text: "text-gray-900",
    textSecondary: "text-gray-700",
    textMuted: "text-gray-500",
    border: "border-gray-300",
    borderLight: "border-gray-200",
    hover: "hover:bg-gray-200",
    overlay: "bg-white/90",
    ring: "blue",
    scrollbar: {
      track: "#f9fafb",
      thumb: "#d1d5db",
      thumbHover: "#9ca3af",
    },
  },
}
const ThemeContext = createContext<{
  theme: keyof typeof themes
  setTheme: (theme: keyof typeof themes) => void
  currentTheme: typeof themes.dark
  toggleTheme: () => void
}>({
  theme: "dark",
  setTheme: () => {},
  currentTheme: themes.dark,
  toggleTheme: () => {},
})

const useTheme = () => useContext(ThemeContext)

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => window.removeEventListener("resize", checkIsMobile)
  }, [])

  return isMobile
}

function Tooltip({
  children,
  content,
  side = "bottom",
  className = "",
}: {
  children: React.ReactNode
  content: string
  side?: "top" | "bottom" | "left" | "right"
  className?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const targetRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const isMobile = useIsMobile()

  const arrowClasses = {
    top: "bottom-0 left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-4 border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "top-0 left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-4 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-0 top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-4 border-t-transparent border-b-transparent border-r-transparent",
    right:
      "left-0 top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-4 border-t-transparent border-b-transparent border-l-transparent",
  }

  useEffect(() => {
    if (isVisible && targetRef.current && tooltipRef.current) {
      const targetRect = targetRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const spacing = 8

      let top = 0
      let left = 0
      let transform = ""

      switch (side) {
        case "top":
          top = targetRect.top - tooltipRect.height - spacing
          left = targetRect.left + targetRect.width / 2
          transform = "translateX(-50%)"
          break
        case "bottom":
          top = targetRect.bottom + spacing
          left = targetRect.left + targetRect.width / 2
          transform = "translateX(-50%)"
          break
        case "left":
          top = targetRect.top + targetRect.height / 2
          left = targetRect.left - tooltipRect.width - spacing
          transform = "translateY(-50%)"
          break
        case "right":
          top = targetRect.top + targetRect.height / 2
          left = targetRect.right + spacing
          transform = "translateY(-50%)"
          break
      }

      setTooltipStyle({
        top: `${top}px`,
        left: `${left}px`,
        transform: transform,
      })
    }
  }, [isVisible, side])
  if (isMobile) {
    return <>{children}</>
  }

  return (
    <>
      <div
        className="inline-block"
        ref={targetRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`fixed z-[9999] pointer-events-none animate-in fade-in-0 zoom-in-95 duration-300`}
            style={tooltipStyle}
          >
            <div
              className={`px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 rounded-lg shadow-lg border border-gray-700 dark:border-gray-600 whitespace-nowrap max-w-xs ${className}`}
            >
              {content}
              <div className={`absolute w-0 h-0 ${arrowClasses[side]}`} />
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}

const createScrollbarStyles = (theme: typeof themes.dark) => `
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: ${theme.scrollbar.track};
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: ${theme.scrollbar.thumb};
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: ${theme.scrollbar.thumbHover};
}
.custom-scrollbar-main::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar-main::-webkit-scrollbar-track {
  background: ${theme.scrollbar.track};
  border-radius: 4px;
}
.custom-scrollbar-main::-webkit-scrollbar-thumb {
  background: ${theme.scrollbar.thumb};
  border-radius: 4px;
}
.custom-scrollbar-main::-webkit-scrollbar-thumb:hover {
  background: ${theme.scrollbar.thumbHover};
}

/* Mobile scrollbar styles */
@media (max-width: 768px) {
    .custom-scrollbar::-webkit-scrollbar,
    .custom-scrollbar-main::-webkit-scrollbar {
      width: 4px;
    }
  }

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideInFromBottom {
    from { 
      opacity: 0; 
      transform: translateY(50px) scale(0.9);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
  }

.animate-in {
  animation: fadeIn 0.2s ease-out;


.slide-in-from-bottom-8 {
    animation: slideInFromBottom 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Mobile-specific styles */
@media (max-width: 768px) {
    .mobile-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.75rem !important;
    }
    
    .mobile-card-height {
      height: 240px !important;
    }
    
    .mobile-text-sm {
      font-size: 0.75rem !important;
    }
    
    .mobile-text-xs {
      font-size: 0.625rem !important;
    }
  }

  @media (max-width: 480px) {
    .mobile-grid {
      grid-template-columns: repeat(1, 1fr) !important;
      gap: 0.5rem !important;
    }
  }
`

interface Movie {
  id: number
  title: string
  description: string
  imdb: number
  year: number
  duration: number
  genre: string[]
  thumbnail: string
  type?: string
  imdbId?: string
  countryOfOrigin?: string
}

interface ApiResponse {
  imdb_id: string
  poster_url: string
  title: string
  year: number
  runtime_minutes: number
  type: string
  rating: number
  votes: number
  genres: string | string[]
  similarity: string
  hybrid_score: string
  overview: string
  final_score: string
  genre_score: string
  country_of_origin: string
}

interface NextApiResponse {
  success: boolean
  data: {
    recommendations: ApiResponse[]
    prompt_title: string
  }
  count: number
  error?: string
}

interface MovieCardProps {
  movie: Movie
  index?: number
}

interface Session {
  id: number
  query: string
  results: Movie[]
  title: string
  isStreaming?: boolean
}

const typeMap: Record<string, string> = {
  movie: "Movie",
  tvSeries: "TV Series",
  tvMiniSeries: "TV Mini Series",
  tvMovie: "TV Movie",
  video: "Video Movie",
}



function StreamingTitle({
  finalTitle,
  onComplete,
}: {
  finalTitle: string
  onComplete?: () => void
}) {
  const [displayedTitle, setDisplayedTitle] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < finalTitle.length) {
      const timer = setTimeout(() => {
        setDisplayedTitle((prev) => prev + finalTitle[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 50)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, finalTitle, onComplete])

  return (
    <span>
      {displayedTitle}
      {currentIndex < finalTitle.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

function IMDbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 32" fill="currentColor">
      <rect width="64" height="32" rx="6" fill="#F5C518" />
      <g fill="#000000">
        <rect x="8" y="8" width="3" height="16" />
        <path d="M15 8h4l2 10 2-10h4v16h-3V12l-2 12h-2l-2-12v12h-3V8z" />
        <path d="M35 8h6c2 0 3 1 3 3v10c0 2-1 3-3 3h-6V8zm3 3v10h3V11h-3z" />
        <path d="M48 8h6c2 0 3 1 3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v4c0 2-1 3-3 3h-6V8zm3 3v4h3v-4h-3zm0 7v3h3v-3h-3z" />
      </g>
    </svg>
  )
}

function MovieCard({ movie, index = 0 }: MovieCardProps & { index?: number }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { currentTheme } = useTheme()
  const isMobile = useIsMobile()
  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className={`group relative cursor-pointer transition-all duration-500 hover:scale-105 animate-in fade-in-0 slide-in-from-bottom-8`}
        style={{
          animationDelay: `${index * 50}ms`,
          animationFillMode: "both",
        }}
      >
        <div className={`relative overflow-hidden rounded-lg ${currentTheme.tertiary} shadow-lg transform transition-all duration-300`}>
          <img
            src={movie.thumbnail || "/placeholder.svg"}
            alt={movie.title}
            className={`${isMobile ? "mobile-card-height" : "h-80"} w-full object-cover transition-transform duration-300 group-hover:scale-110`}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <div
            className={`absolute inset-0 ${currentTheme.overlay} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          >
            <div className={`flex h-full flex-col justify-between ${isMobile ? "p-2" : "p-4"}`}>
              <div>
                <h3
                  className={`${isMobile ? "text-sm mobile-text-sm" : "text-lg"} font-bold ${currentTheme.text} mb-2 line-clamp-3`}
                >
                  {movie.title}
                </h3>
                <p className={`${isMobile ? "text-xs mobile-text-xs" : "text-xs"} ${currentTheme.textMuted} mb-2`}>
                  {movie.type}
                </p>
                <p
                  className={`${isMobile ? "text-xs mobile-text-xs" : "text-sm"} ${currentTheme.textSecondary} mb-3 line-clamp-3`}
                >
                  {movie.description}
                </p>
              </div>
              <div className="space-y-2">
                <div
                  className={`flex items-center ${isMobile ? "gap-2" : "gap-4"} ${isMobile ? "text-xs mobile-text-xs" : "text-sm"} ${currentTheme.textSecondary}`}
                >
                  <div className="flex items-center gap-1">
                    <Star className={`${isMobile ? "h-3 w-3" : "h-4 w-4"} fill-yellow-400 text-yellow-400`} />
                    <span className="font-semibold">{movie.imdb || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
                    <span>{movie.year || "N/A"}</span>
                  </div>
                  {!isMobile && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{movie.duration || "N/A"}</span>
                  </div>)}
                </div>
                <div className="flex flex-wrap gap-1">
                   {movie.genre.slice(0, isMobile ? 2 : 4).map((g) => (
                    <span
                      key={g}
                      className={`px-2 py-1 ${isMobile ? "text-xs mobile-text-xs" : "text-xs"} ${currentTheme.tertiary} ${currentTheme.textSecondary} rounded`}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`${currentTheme.secondary} rounded-lg ${isMobile ? "max-w-full w-full max-h-[95vh]" : "max-w-4xl w-full max-h-[90vh]"} overflow-hidden flex flex-col shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300`}
          >
            <div
              className={`flex justify-between items-start ${isMobile ? "p-4" : "p-6"} border-b ${currentTheme.borderLight}`}
            >
              <h2 className={`${isMobile ? "text-lg" : "text-2xl"} font-bold ${currentTheme.text} pr-4`}>
                {movie.title}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className={`${currentTheme.textMuted} ${currentTheme.text} p-2 rounded-full ${currentTheme.hover} transition-colors`}
              >
                <X className={`${isMobile ? "w-5 h-5" : "w-6 h-6"}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className={`${isMobile ? "p-4" : "p-6"}`}>
                <div className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"} gap-6`}>
                  <div className={`${isMobile ? "flex justify-center" : "md:col-span-1"}`}>
                    <img
                      src={movie.thumbnail || "/placeholder.svg"}
                      alt={movie.title}
                      className={`${isMobile ? "w-48 h-72" : "w-full"} rounded-lg shadow-lg`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <div className={`${isMobile ? "col-span-1" : "md:col-span-2"} space-y-4`}>
                    <div
                      className={`flex flex-wrap items-center gap-4 text-sm ${currentTheme.textSecondary} ${isMobile ? "justify-center" : "justify-between"}`}
                    >
                      <div className={`flex flex-wrap items-center ${isMobile ? "gap-2 justify-center" : "gap-4"}`}>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{movie.imdb || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{movie.year || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{movie.duration || "N/A"} min</span>
                        </div>
                        {movie.countryOfOrigin && (
                          <div className="flex items-center gap-1">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span>{movie.countryOfOrigin}</span>
                          </div>
                        )}
                        <div className={`px-2 py-1 ${currentTheme.tertiary} rounded text-xs`}>
                          {movie.type || "Unknown"}
                        </div>
                      </div>

                      {movie.imdbId && (
                        <a
                          href={`https://www.imdb.com/title/${movie.imdbId}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${isMobile ? "text-xs" : "text-xs"}`}
                        >
                          <IMDbIcon className="w-6 h-3" />
                          <span>View on IMDb</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className={`flex flex-wrap gap-2 ${isMobile ? "justify-center" : ""}`}>
                      {movie.genre.map((g) => (
                        <span key={g} className={`px-3 py-1 text-sm ${currentTheme.accent} text-white rounded-full`}>
                          {g}
                        </span>
                      ))}
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold ${currentTheme.text} mb-2 ${isMobile ? "text-center" : ""}`}
                      >
                        Overview
                      </h3>
                      <div
                        className={`${currentTheme.textSecondary} leading-relaxed whitespace-pre-wrap break-words ${isMobile ? "text-sm text-center" : ""}`}
                      >
                        {movie.description || "No description available."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`border-t ${currentTheme.borderLight} ${isMobile ? "p-4" : "p-6"}`}>
              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className={`${currentTheme.accent} ${currentTheme.accentHover} text-white px-6 py-2 rounded-lg transition-colors`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme, currentTheme } = useTheme()

  return (
    <Tooltip content={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"} side="bottom">
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${currentTheme.hover}`}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-white-400 transition-transform duration-300 rotate-0" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 transition-transform duration-300 rotate-0" />
        )}
      </button>
    </Tooltip>
  )
}

function HowToUseModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { currentTheme } = useTheme()
  const isMobile = useIsMobile()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div
      className={`${currentTheme.primary} rounded-lg shadow-xl ${isMobile ? "max-w-full w-full max-h-[95vh]" : "max-w-2xl w-full max-h-[80vh]"} overflow-hidden border ${currentTheme.border}`}
      onClick={(e) => e.stopPropagation()}
    >
        {/* Header */}
        <div className={`${isMobile ? "p-4" : "p-6"} border-b ${currentTheme.borderLight}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div
                  className={`${isMobile ? "w-8 h-8" : "w-10 h-10"} rounded-full ${currentTheme.accent} flex items-center justify-center`}
                >
                  <HelpCircle className={`${isMobile ? "w-4 h-4" : "w-5 h-5"} text-white`} />
                </div>
              </div>
              <div>
                <h3 className={`${isMobile ? "text-lg" : "text-xl"} font-semibold ${currentTheme.text}`}>
                  How to Use Recommender
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`${currentTheme.textMuted} ${currentTheme.text} p-2 rounded-full ${currentTheme.hover} transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-y-auto custom-scrollbar ${isMobile ? "p-4" : "p-6"}`}>
          <div className="space-y-6">
            {/* Getting Started */}
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Search className="w-5 h-5" />
                Getting Started
              </h4>
              <div className={`${currentTheme.textSecondary} space-y-2`}>
                <p>• Type your movie or TV show preferences in the search box</p>
                <p>• Use natural language like "action movies with superheroes" or "romantic comedies from the 90s"</p>
                <p>• Press Enter or click the send button to get recommendations</p>
              </div>
            </div>

            {/* Features */}
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Star className="w-5 h-5" />
                Key Features
              </h4>
              <div className={`${currentTheme.textSecondary} space-y-2`}>
                <p>
                  • <strong>Era-Based Filtering:</strong> Search by specific time periods like "80s action movies" or "classic 70s thrillers".
                </p>
                <p>
                  • <strong>Region-Based Filtering:</strong> Get results tailored to or excluding specific regions (e.g., "European detective films", "Nordic noir", or "Japanese anime" "Turkish television drama").
                </p>
                <p>
                  • <strong>Quality Tags:</strong> Filter by content types such as "mainstream", "cult", "niche", "popular", "classic", or "legendary".
                </p>
                <p>
                  • <strong>Negative Theme Filtering:</strong> Exclude unwanted elements from your search. For example, "space movies without aliens".
                </p>
                <p>
                  • <strong>Franchise-Aware Suggestions:</strong> Get recommendations based on major franchises like Marvel, DC, Harry Potter, or Star Wars etc. or discover similar universes.
                </p>  
                <p>
                  • <strong>Duration-Based Filtering:</strong> Search based on runtime short or long movies, or TV series with short or long episodes.
                </p>
              </div>
            </div>

            {/* Tips */}
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <AlertCircle className="w-5 h-5" />
                Pro Tips
              </h4>
              <div className={`${currentTheme.textSecondary} space-y-2`}>
                <p>• Be specific about genres, time periods, or themes for better results</p>
                <p>• Try different phrasings if you don't get the results you want</p>
                <p>• Click on movie posters to view detailed information</p>
                <p>• Use the IMDb links to read reviews and find more information</p>
              </div>
            </div>

            {/* Example Queries */}
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-3`}>Example Queries</h4>
              <div
                className={`${currentTheme.tertiary} rounded-lg p-4 space-y-2 text-sm ${currentTheme.textSecondary}`}
              >
                <p>• "Sci-fi movies like Blade Runner"</p>
                <p>• "Comedy series similar to The Office"</p>
                <p>• "Horror movies from the 1980s"</p>
                <p>• "Feel-good movies for family night"</p>
                <p>• "Thriller series with complex plots"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`border-t ${currentTheme.borderLight} ${isMobile ? "p-4" : "p-6"}`}>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`${currentTheme.accent} ${currentTheme.accentHover} text-white px-6 py-2 rounded-lg transition-colors`}
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  sessionTitle,
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  sessionTitle: string
}) {
  const { currentTheme } = useTheme()
  const isMobile = useIsMobile()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${currentTheme.secondary} rounded-lg shadow-xl max-w-md w-full border ${currentTheme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b ${currentTheme.borderLight} flex-shrink-0`}>
          <span className="text-lg font-bold">Delete chat?</span>
        </div>

        {/* Content */}
        <div className={`${isMobile ? "p-4" : "p-6"}`}>
          <p className={`${currentTheme.textSecondary} mb-4`}>
            This will delete <span className={`font-medium ${currentTheme.text}`}>"{sessionTitle}"</span>.
          </p>
          <p className={`text-sm ${currentTheme.textMuted}`}>This action cannot be undone.</p>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 ${isMobile ? "p-4" : "p-6"} border-t ${currentTheme.borderLight}`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg border ${currentTheme.border} ${currentTheme.text} ${currentTheme.hover} transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

function SessionItem({
  session,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: {
  session: Session
  isActive: boolean
  onSelect: () => void
  onRename: (id: number, newTitle: string) => void
  onDelete: (id: number, title: string) => void
}) {
  const { currentTheme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(session.title)
  const [showActions, setShowActions] = useState(false)
  const [isStreaming, setIsStreaming] = useState(session.isStreaming || false)
  const isMobile = useIsMobile()


  const handleSave = () => {
    if (editTitle.trim() && editTitle !== session.title) {
      onRename(session.id, editTitle.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(session.title)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(session.id, session.title)
  }

  return (
    <div
      className={`group relative p-3 rounded-lg cursor-pointer border transition-colors duration-300 ${
        isActive ? `${currentTheme.tertiary} ${currentTheme.border}` : `${currentTheme.hover} border-transparent`
      }`}
      onMouseEnter={() => !isMobile && setShowActions(true)}
      onMouseLeave={() => !isMobile && setShowActions(false)}
      onClick={!isEditing ? onSelect : undefined}
    >
      {isEditing ? (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSave()
              if (e.key === "Escape") handleCancel()
            }}
            className={`flex-1 bg-transparent border ${currentTheme.border} rounded px-2 py-1 text-sm ${currentTheme.text} focus:outline-none focus:ring-1 focus:ring-${currentTheme.ring}-500`}
            autoFocus
          />
          <Tooltip content="Save changes" side="top">
            <button onClick={handleSave} className={`p-1 rounded ${currentTheme.hover} ${currentTheme.textSecondary}`}>
              <Check className="h-3 w-3" />
            </button>
          </Tooltip>
          <Tooltip content="Cancel editing" side="top">
            <button
              onClick={handleCancel}
              className={`p-1 rounded ${currentTheme.hover} ${currentTheme.textSecondary}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Tooltip>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className={`truncate text-sm ${currentTheme.text}`} title={session.title}>
              {isStreaming ? (
                <StreamingTitle finalTitle={session.title} onComplete={() => setIsStreaming(false)} />
              ) : (
                session.title
              )}
            </div>
            <div className={`text-xs ${currentTheme.textMuted} mt-1`} style={{visibility: 'hidden'}}>
            placeholder
            </div>
          </div>

         {(showActions || isMobile) && !isEditing && !isStreaming && (
            <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
              <Tooltip content="Rename chat" side="top">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`p-1 rounded ${currentTheme.hover} ${currentTheme.textMuted} ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </Tooltip>
              <Tooltip content="Delete chat" side="top">
                <button
                  onClick={handleDelete}
                  className={`p-1 rounded ${currentTheme.hover} text-red-400 hover:text-red-300 ${isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function MovieRecommendationApp() {
  const [theme, setTheme] = useState<keyof typeof themes>("dark")
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Array<{ type: "user" | "system"; content: string }>>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [howToUseModalOpen, setHowToUseModalOpen] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState<{ id: number; title: string } | null>(null)

  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const containerClasses = sidebarOpen && !isMobile ? "max-w-4xl translate-x-0" : "max-w-4xl -translate-x-16"

  const currentTheme = themes[theme]

  const createNewChat = () => {
    setActiveSessionId(null)
    setMovies([])
    setMessages([])
    setError(null)
    setQuery("")
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const renameSession = (id: number, newTitle: string) => {
    setSessions((prev) => prev.map((session) => (session.id === id ? { ...session, title: newTitle } : session)))
  }

  const handleDeleteRequest = (id: number, title: string) => {
    setSessionToDelete({ id, title })
    setDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (sessionToDelete) {
      setSessions((prev) => prev.filter((session) => session.id !== sessionToDelete.id))
      if (activeSessionId === sessionToDelete.id) {
        setActiveSessionId(null)
        setMovies([])
        setMessages([])
        setError(null)
      }
    }
    setDeleteModalOpen(false)
    setSessionToDelete(null)
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setSessionToDelete(null)
  }

  const generateSessionTitle = (query: string): string => {
    const words = query.trim().split(" ")
    if (words.length <= 15) {
      return query
    }
    return words.slice(0, 4).join(" ") + "..."
  }

  const handleSubmit = async (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    setMessages((prev) => [...prev, { type: "user", content: query }])
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: NextApiResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || "API request failed")
      }

      const recommendations = result.data?.recommendations || []
      const promptTitle = result.data?.prompt_title || generateSessionTitle(query)
      console.log("Recommendations:", recommendations) 
      console.log("PromptTitle:", promptTitle) 
      console.log
      const moviesFromApi: Movie[] = Array.isArray(recommendations)
        ? recommendations.map((item, index) => ({
            id: index,
            title: item.title || `Movie ${index + 1}`,
            description: item.overview || "No description available.",
            imdb: Number(item.rating) || 0,
            year: Number(item.year) || 0,
            duration: Number(item.runtime_minutes) || 0,
            genre: Array.isArray(item.genres)
              ? item.genres
              : typeof item.genres === "string"
                ? item.genres.split(",").map((g) => g.trim())
                : [],
            thumbnail: item.poster_url || "/placeholder.svg",
            type: typeMap[item.type] || "Unknown",
            imdbId: item.imdb_id,
            countryOfOrigin: item.country_of_origin || "Unknown"
          }))
        : []

      setMovies(moviesFromApi)

      const newSession: Session = {
        id: Date.now(),
        query,
        results: moviesFromApi,
        title: promptTitle,
        isStreaming: true,
      }

      setSessions((prev) => [newSession, ...prev])
      setActiveSessionId(newSession.id)

      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: `Found ${moviesFromApi.length} recommendations for "${query}".`,
        },
      ])
    } catch (error) {
      console.error("API error:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
      setError(errorMessage)
      setMessages((prev) => [
        ...prev,
        {
          type: "system",
          content: "❌ Failed to get recommendations. Please check if the API is running.",
        },
      ])
    } finally {
      setLoading(false)
      setQuery("")
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, toggleTheme }}>
      <div
        className={`flex h-screen ${currentTheme.primary} ${currentTheme.text} transition-colors duration-300 ${isMobile ? "flex-col" : ""}`}
      >
        <style dangerouslySetInnerHTML={{ __html: createScrollbarStyles(currentTheme) }} />


        {/* Mobile Header */}
        {isMobile && (
          <div
            className={`${currentTheme.secondary} border-b ${currentTheme.borderLight} p-4 flex items-center justify-between`}
          >
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${currentTheme.textMuted} ${currentTheme.text} p-2 rounded-lg ${currentTheme.hover} transition-colors`}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold">Movie Recommender</h1>
            <ThemeToggle />
          </div>
        )}

        {/* Sidebar */}
        <div
          className={`${
            isMobile
              ? `fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
              : `${sidebarOpen ? "w-72" : "w-16"} transition-all duration-300`
          } ${currentTheme.secondary} border-r ${currentTheme.borderLight} ${isMobile ? "" : "rounded-r-3xl"} flex flex-col overflow-hidden shadow-xl`}
        >
          {/* Sidebar Header */}
          {!isMobile && (
          <div className={`p-4 flex items-center justify-between border-b ${currentTheme.borderLight} flex-shrink-0`}>
            <span className="text-lg font-bold">{sidebarOpen ? "Chats" : ""}</span>
            <div className="flex items-center gap-2">
              {sidebarOpen && <ThemeToggle />}
              <Tooltip content={sidebarOpen ? "Close sidebar" : "Open sidebar"} side="right">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`${currentTheme.textMuted} ${currentTheme.text} p-2 rounded-lg ${currentTheme.hover} transition-colors`}
                >
                  {sidebarOpen ? <PanelLeftClose className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </Tooltip>
            </div>
          </div>)}

          {/* Mobile Sidebar Header */}
          {isMobile && (
            <div className={`p-4 flex items-center justify-between border-b ${currentTheme.borderLight} flex-shrink-0`}>
              <span className="text-lg font-bold">Chats</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`${currentTheme.textMuted} ${currentTheme.text} p-2 rounded-lg ${currentTheme.hover} transition-colors`}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          )}


          {/* How to Use Button */}
          {(sidebarOpen || isMobile) && (
            <div className="p-4 border-b border-gray-700 space-y-2">
              <button
                onClick={() => {
                  setHowToUseModalOpen(true)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${currentTheme.hover} transition-colors ${currentTheme.textSecondary} text-sm mb-3`}
              >
                <HelpCircle className="h-4 w-4" />
                <span>How to use?</span>
              </button>
              <button
                onClick={createNewChat}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${currentTheme.hover} transition-colors ${currentTheme.text}`}
              >
                <Plus className="h-4 w-4" />
                <span>New Chat</span>
              </button>
            </div>
          )}

          {/* Sidebar List */}
          <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${sidebarOpen || isMobile ? "" : "hidden"}`}>
            <div className="space-y-2">
              {sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => {
                    setActiveSessionId(session.id)
                    setMovies(session.results)
                    if (isMobile) setSidebarOpen(false)
                  }}
                  onRename={renameSession}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobile && sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <div className={`flex flex-col flex-1 h-full ${isMobile ? "min-h-0" : ""}`}>
          {error && (
            <div className="mx-auto max-w-7xl p-4">
              <div
                className={`bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg p-4 flex items-center gap-2`}
              >
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300">Error: {error}</span>
              </div>
            </div>
          )}

          {/* Movies grid */}
          <div className={`relative flex-1 overflow-y-auto ${isMobile ? "p-3" : "p-6"} custom-scrollbar-main`}>
            <div className="h-full overflow-y-auto p-6 custom-scrollbar-main pb-[120px]">
              <div className="mx-auto">
                {loading ? (
                  <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                    <span className={currentTheme.textMuted}>Getting recommendations...</span>
                  </div>
                ) : movies.length > 0 ? (
                  <div className={`grid ${isMobile ? "mobile-grid grid-cols-2" : "grid-cols-10"} gap-4`}>
                  {movies.slice(0, 40).map((movie, index) => (
                    <MovieCard key={movie.id} movie={movie} index={index}/>
                    ))}
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none transition-all duration-300">
                    <div
                      className={`flex flex-col items-center text-center px-4 transform transition-all duration-300 ${isMobile ? "max-w-sm" : containerClasses}`}
                    >
                      <div className="mb-8 opacity-50 flex items-center justify-center transition-all duration-300">
                        <Search size={isMobile ? 60 : 80} className={currentTheme.textMuted} />
                      </div>
                      <h1 className={`${isMobile ? "text-2xl" : "text-4xl"} font-light ${currentTheme.text} mb-4 transition-all duration-300`}>
                        What you looking for?
                      </h1>
                      <p className={`${isMobile ? "text-base" : "text-lg"} ${currentTheme.textMuted} transition-all duration-300 max-w-md`}>
                        Discover your next favorite movie or TV show with AI-powered recommendations
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Fade overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
              style={{ background: `linear-gradient(to top, ${currentTheme.primaryColorValue} 0%, transparent 100%)` }}
            />
          </div>

          {/* Chat input */}
          <div   className={`fixed bottom-2 ${isMobile ? "left-0 right-0 px-3" : "left-20 right-0 px-4"} z-10`}
                  style={isMobile ? { bottom: `calc(0.5rem + env(safe-area-inset-bottom))` } : {}}>
            <div
              className={`mx-auto ${isMobile ? "px-0" : "px-4"} transform transition-all duration-300 ${isMobile ? "max-w-full" : containerClasses}`}
            >
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${currentTheme.textMuted}`} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  placeholder="Ask for recommendations..."
                  className={`w-full ${currentTheme.secondary} ${currentTheme.text} rounded-lg pl-10 pr-14 ${isMobile ? "py-2 text-base" : "py-5 text-lg"} shadow-sm focus:outline-none transition-colors`}
                  disabled={loading}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!query.trim() || loading}
                  className={`${currentTheme.accent} ${currentTheme.accentHover} disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors shadow-lg absolute right-2 top-1/2 -translate-y-1/2`}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          sessionTitle={sessionToDelete?.title || ""}
        />
        <HowToUseModal isOpen={howToUseModalOpen} onClose={() => setHowToUseModalOpen(false)} />
      </div>
    </ThemeContext.Provider>
  )
}
