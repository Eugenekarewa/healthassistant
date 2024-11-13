import React from 'react'

interface AvatarProps {
  src?: string
  alt?: string
  fallback?: string
  children?: React.ReactNode
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback = 'U', children }) => {
  return (
    <div className="relative inline-block h-10 w-10 overflow-hidden rounded-full">
      {children ? children : (
        src ? (
          <img className="h-full w-full object-cover" src={src} alt={alt || fallback} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600">
            {fallback.slice(0, 2).toUpperCase()}
          </div>
        )
      )}
    </div>
  )
}

export const AvatarImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => {
  return <img className="h-full w-full object-cover" {...props} />
}

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-600" {...props}>
      {children}
    </div>
  )
}