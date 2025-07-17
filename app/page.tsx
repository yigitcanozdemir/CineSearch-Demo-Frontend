"use client"

import type React from "react"
import { createPortal } from "react-dom"
import { useState, createContext, useContext,useRef,useEffect } from "react"
import {
  Search,
  Send,
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
  ArrowUp
} from "lucide-react"

const themes = {
  dark: {
    name: "Dark",
    primary: "bg-black",
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

  const arrowClasses = {
    top: "bottom-0 left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700 border-4 border-l-transparent border-r-transparent border-b-transparent",
    bottom:
      "top-0 left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700 border-4 border-l-transparent border-r-transparent border-t-transparent",
    left: "right-0 top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700 border-4 border-t-transparent border-b-transparent border-r-transparent",
    right:
      "left-0 top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700 border-4 border-t-transparent border-b-transparent border-l-transparent",
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

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .animate-in {
    animation: fadeIn 0.2s ease-out;
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
}

interface NextApiResponse {
  success: boolean
  data: ApiResponse[][]
  count: number
  error?: string
}

interface MovieCardProps {
  movie: Movie
}

interface Session {
  id: number
  query: string
  results: Movie[]
  title: string
}

const typeMap: Record<string, string> = {
  movie: "Movie",
  tvSeries: "TV Series",
  tvMiniSeries: "TV Mini Series",
  tvMovie: "TV Movie",
  video: "Video Movie",
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

function MovieCard({ movie }: MovieCardProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { currentTheme } = useTheme()

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group relative cursor-pointer transition-transform duration-300 hover:scale-105"
      >
        <div className={`relative overflow-hidden rounded-lg ${currentTheme.tertiary} shadow-lg`}>
          <img
            src={movie.thumbnail || "/placeholder.svg"}
            alt={movie.title}
            className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
          <div
            className={`absolute inset-0 ${currentTheme.overlay} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
          >
            <div className="flex h-full flex-col justify-between p-4">
              <div>
                <h3 className={`text-lg font-bold ${currentTheme.text} mb-2 line-clamp-3`}>{movie.title}</h3>
                <p className={`text-xs ${currentTheme.textMuted} mb-2`}>{movie.type}</p>
                <p className={`text-sm ${currentTheme.textSecondary} mb-3 line-clamp-3`}>{movie.description}</p>
              </div>
              <div className="space-y-2">
                <div className={`flex items-center gap-4 text-sm ${currentTheme.textSecondary}`}>
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
                    <span>{movie.duration || "N/A"}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {movie.genre.map((g) => (
                    <span
                      key={g}
                      className={`px-2 py-1 text-xs ${currentTheme.tertiary} ${currentTheme.textSecondary} rounded`}
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
            className={`${currentTheme.secondary} rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl`}
          >
            <div className={`flex justify-between items-start p-6 border-b ${currentTheme.borderLight}`}>
              <h2 className={`text-2xl font-bold ${currentTheme.text} pr-4`}>{movie.title}</h2>
              <button
                onClick={() => setModalOpen(false)}
                className={`${currentTheme.textMuted} ${currentTheme.text} p-2 rounded-full ${currentTheme.hover} transition-colors`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <img
                      src={movie.thumbnail || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full rounded-lg shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-4">
                    <div
                      className={`flex flex-wrap items-center gap-4 text-sm ${currentTheme.textSecondary} justify-between`}
                    >
                      <div className="flex flex-wrap items-center gap-4">
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
                        <div className={`px-2 py-1 ${currentTheme.tertiary} rounded text-xs`}>
                          {movie.type || "Unknown"}
                        </div>
                      </div>

                      {movie.imdbId && (
                        <a
                          href={`https://www.imdb.com/title/${movie.imdbId}/`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 text-xs"
                        >
                          <IMDbIcon className="w-6 h-3" />
                          <span>View on IMDb</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {movie.genre.map((g) => (
                        <span key={g} className={`px-3 py-1 text-sm ${currentTheme.accent} text-white rounded-full`}>
                          {g}
                        </span>
                      ))}
                    </div>
                    <div>
                      <h3 className={`text-lg font-semibold ${currentTheme.text} mb-2`}>Overview</h3>
                      <div className={`${currentTheme.textSecondary} leading-relaxed whitespace-pre-wrap break-words`}>
                        {movie.description || "No description available."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`border-t ${currentTheme.borderLight} p-6`}>
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${currentTheme.secondary} rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border ${currentTheme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${currentTheme.borderLight}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${currentTheme.accent} flex items-center justify-center`}>
                  <HelpCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${currentTheme.text}`}>How to Use Movie Recommender</h3>
                <p className={`text-sm ${currentTheme.textMuted} mt-1`}>
                  Get personalized movie and TV show recommendations
                </p>
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
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
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
                  • <strong>Smart Recommendations:</strong> AI-powered suggestions based on your preferences
                </p>
                <p>
                  • <strong>Detailed Information:</strong> View ratings, year, duration, genres, and descriptions
                </p>
                <p>
                  • <strong>IMDb Integration:</strong> Direct links to IMDb pages for more details
                </p>
                <p>
                  • <strong>Chat History:</strong> Save and revisit your previous searches
                </p>
                <p>
                  • <strong>Dark/Light Mode:</strong> Choose your preferred theme
                </p>
              </div>
            </div>

            {/* Chat Management */}
            <div>
              <h4 className={`text-lg font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Edit2 className="w-5 h-5" />
                Managing Your Chats
              </h4>
              <div className={`${currentTheme.textSecondary} space-y-2`}>
                <p>
                  • <strong>New Chat:</strong> Click "New Chat" to start a fresh conversation
                </p>
                <p>
                  • <strong>Rename:</strong> Hover over any chat and click the edit icon to rename it
                </p>
                <p>
                  • <strong>Delete:</strong> Hover over any chat and click the trash icon to delete it
                </p>
                <p>
                  • <strong>Switch Chats:</strong> Click on any chat in the sidebar to view its results
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
                <p>• Click on movie posters to view detailed information and trailers</p>
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
        <div className={`border-t ${currentTheme.borderLight} p-6`}>
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${currentTheme.secondary} rounded-lg shadow-xl max-w-md w-full border ${currentTheme.border}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b ${currentTheme.borderLight}`}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${currentTheme.text}`}>Delete chat?</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className={`${currentTheme.textSecondary} mb-4`}>
            This will delete <span className={`font-medium ${currentTheme.text}`}>"{sessionTitle}"</span>.
          </p>
          <p className={`text-sm ${currentTheme.textMuted}`}>This action cannot be undone.</p>
        </div>

        {/* Footer */}
        <div className={`flex justify-end gap-3 p-6 border-t ${currentTheme.borderLight}`}>
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
        isActive
          ? `${currentTheme.tertiary} ${currentTheme.border}`
          : `${currentTheme.hover} border-transparent`
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
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
              {session.title}
            </div>
            <div className={`text-xs ${currentTheme.textMuted} mt-1`}>{session.results.length} results</div>
          </div>

          {showActions && !isEditing && (
            <div className="flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
              <Tooltip content="Rename chat" side="top">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`p-1 rounded ${currentTheme.hover} ${currentTheme.textMuted} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </Tooltip>
              <Tooltip content="Delete chat" side="top">
                <button
                  onClick={handleDelete}
                  className={`p-1 rounded ${currentTheme.hover} text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity`}
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

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const containerClasses = sidebarOpen ? "max-w-4xl translate-x-0" : "max-w-4xl -translate-x-16"

  const currentTheme = themes[theme]

  const createNewChat = () => {
    setActiveSessionId(null)
    setMovies([])
    setMessages([])
    setError(null)
    setQuery("")
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
    if (words.length <= 4) {
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

      const recommendations = result.data || []
      const innerData = Array.isArray(recommendations[0]) ? recommendations[0] : []

      const moviesFromApi: Movie[] = Array.isArray(innerData)
        ? innerData.map((item, index) => ({
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
          }))
        : []

      setMovies(moviesFromApi)

      const sessionTitle = generateSessionTitle(query)
      const newSession: Session = {
        id: Date.now(),
        query,
        results: moviesFromApi,
        title: sessionTitle,
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
      <div className={`flex h-screen ${currentTheme.primary} ${currentTheme.text} transition-colors duration-300`}>
        <style dangerouslySetInnerHTML={{ __html: createScrollbarStyles(currentTheme) }} />

        {/* Sidebar */}
        <div
          className={`${sidebarOpen ? "w-72" : "w-16"} ${currentTheme.secondary} border-r ${currentTheme.borderLight} transition-all duration-300 rounded-r-3xl flex flex-col overflow-hidden shadow-xl`}
        >
          {/* Sidebar Header */}
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
          </div>

          {/* How to Use Button */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-700">
              <button
                onClick={() => setHowToUseModalOpen(true)}
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
          <div className={`flex-1 overflow-y-auto p-4 custom-scrollbar ${sidebarOpen ? "" : "hidden"}`}>
            <div className="space-y-2">
              {sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSessionId}
                  onSelect={() => {
                    setActiveSessionId(session.id)
                    setMovies(session.results)
                  }}
                  onRename={renameSession}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 h-full">
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
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar-main">
            <div className="mx-auto">
              {loading ? (
                <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
                  <span className={currentTheme.textMuted}>Getting recommendations...</span>
                </div>
              ) : movies.length > 0 ? (
                <div className="grid grid-cols-10 gap-4">
                  {movies.slice(0, 40).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none transition-all duration-300">
                  <div
                    className={`flex flex-col items-center text-center px-4 transform transition-all duration-300 ${containerClasses}`}
                  >
                    <div className="mb-8 opacity-50 flex items-center justify-center transition-all duration-300">
                      <Search size={80} className={currentTheme.textMuted} />
                    </div>
                    <h1 className={`text-4xl font-light ${currentTheme.text} mb-4 transition-all duration-300`}>
                      What you looking for?
                    </h1>
                    <p className={`text-lg ${currentTheme.textMuted} transition-all duration-300 max-w-md`}>
                      Discover your next favorite movie or TV show with AI-powered recommendations
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

            {/* Fade overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
              style={{ background: `linear-gradient(to top, ${currentTheme.primary} 0%, transparent 100%)` }}
            />

          {/* Chat input */}
          <div className="absolute bottom-2 left-20 right-0 p-4">
            <div className={`mx-auto px-4 transform transition-all duration-300 ${containerClasses}`}>
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 ${currentTheme.textMuted}`} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                  placeholder="Ask for recommendations..."
                  className={`w-full ${currentTheme.secondary} ${currentTheme.text} rounded-lg pl-10 pr-14 py-5 text-lg shadow-sm focus:outline-none transition-colors`}
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
