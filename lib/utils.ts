import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNow, format } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatMessageTime(date: Date): string {
  const now = new Date()
  const messageDate = new Date(date)
  const diffInMinutes = Math.floor((now.getTime() - messageDate.getTime()) / 60000)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  
  const diffInDays = Math.floor(diffInMinutes / 1440)
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return format(messageDate, 'MMM d')
}

export function formatLastSeen(date: Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function createAvatarUrl(name: string, color: string = '#ff3c78'): string {
  const initial = name.charAt(0).toUpperCase()
  const encodedColor = encodeURIComponent(color.replace('#', ''))
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle fill="#${encodedColor}" cx="50" cy="50" r="50"/>
      <text x="50%" y="50%" font-size="50" text-anchor="middle" dy=".35em" fill="white" font-family="Arial">${initial}</text>
    </svg>
  `)}`
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase()
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)
}

export function isVideoFile(filename: string): boolean {
  const ext = getFileExtension(filename).toLowerCase()
  return ['mp4', 'webm', 'ogg', 'mov'].includes(ext)
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function compressImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }))
            } else {
              reject(new Error('Canvas to Blob conversion failed'))
            }
          },
          file.type,
          0.85
        )
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
