import { useState, useEffect } from 'react'

interface PhotoGalleryProps {
  onReset: () => void
}

// Placeholder photos - replace these paths with real photos
const PHOTOS = [
  { src: '/photos/1.png', caption: 'LasVegas ✨' },
  { src: '/photos/2.png', caption: 'Sequoia 🎉' },
  { src: '/photos/3.png', caption: 'GoldenState 💫' },
  { src: '/photos/4.png', caption: 'AntelopeCanyon 🥂' },
  { src: '/photos/5.png', caption: 'DeathValley 🌟' },
  { src: '/photos/6.png', caption: 'VeniceBeach 💖' },
]

export function PhotoGallery({ onReset }: PhotoGalleryProps) {
  const [visible, setVisible] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  useEffect(() => {
    // Delay entrance for the celebration confetti to play
    const timer = setTimeout(() => setVisible(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`gallery-overlay ${visible ? 'visible' : ''}`}>
      {/* Header */}
      <div className="gallery-header">
        <h1 className="gallery-title">
          <span className="title-line1">Happy Birthday</span>
          <span className="title-line2">Luo Kingfung</span>
          <span className="title-date">March 28, 2026 · Los Angeles</span>
        </h1>
      </div>

      {/* Photo grid */}
      <div className="gallery-grid">
        {PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="gallery-card"
            style={{ animationDelay: `${0.3 + i * 0.15}s` }}
            onClick={() => setSelectedIndex(i)}
          >
            <div className="card-image">
              <img
                src={photo.src}
                alt={photo.caption}
                onError={(e) => {
                  // Show a colorful placeholder if image doesn't exist
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.parentElement!.classList.add('placeholder')
                }}
              />
              <div className="placeholder-icon">📸</div>
            </div>
            <div className="card-caption">{photo.caption}</div>
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="gallery-message">
        <p>Wishing you the happiest of birthdays! 🎂</p>
        <p className="gallery-sub">May this year bring you endless joy and laughter.</p>
      </div>

      {/* Reset button */}
      <button className="reset-btn" onClick={onReset} title="再来一次">
        🔄
      </button>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div className="lightbox" onClick={() => setSelectedIndex(null)}>
          <img
            src={PHOTOS[selectedIndex].src}
            alt={PHOTOS[selectedIndex].caption}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
          <div className="lightbox-caption">{PHOTOS[selectedIndex].caption}</div>
          <div className="lightbox-nav">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((selectedIndex - 1 + PHOTOS.length) % PHOTOS.length)
              }}
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setSelectedIndex((selectedIndex + 1) % PHOTOS.length)
              }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
