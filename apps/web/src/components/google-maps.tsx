import { ExternalLink } from 'lucide-react'

interface GoogleMapsCardProps {
  locationURL: string
  locationName?: string
}

function GoogleMaps({ locationURL, locationName }: GoogleMapsCardProps) {
  // Convert Google Maps URL to embeddable format (no API key required)
  const getEmbedUrl = (url: string): string => {
    // Use the simple embed format that doesn't require an API key
    let query = locationName || ''

    if (url.includes('/maps/place/')) {
      const placeMatch = url.match(/place\/([^/@]+)/)
      if (placeMatch) {
        query = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '))
      }
    } else if (url.includes('q=')) {
      const urlObj = new URL(url)
      query = urlObj.searchParams.get('q') || query
    }

    // Use the output=embed format which doesn't require API key
    return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
  }

  const embedUrl = getEmbedUrl(locationURL)

  return (
    <div className="mt-4 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900/50">
      <div className="relative aspect-video w-full">
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={locationName || 'Event location'}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-neutral-900/80 border-t border-neutral-800">
        {locationName && (
          <span className="text-sm text-neutral-300 font-medium truncate">
            {locationName}
          </span>
        )}
        <a
          href={locationURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[--color-accent] transition-colors ml-auto"
        >
          Open in Maps
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  )
}

export default GoogleMaps
