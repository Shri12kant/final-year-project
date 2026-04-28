import React, { useState, useRef } from 'react'

interface ProfilePictureUploadProps {
  currentImage?: string
  onImageChange: (file: File) => void
}

export const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({
  currentImage,
  onImageChange
}) => {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.onerror = (error) => {
        console.error('Error reading file:', error)
      }
      reader.readAsDataURL(file)
      onImageChange(file)
    } else {
      console.error('Invalid file type:', file?.type)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const displayImage = preview || currentImage

  console.log('Display image:', displayImage ? 'Set' : 'Not set')
  console.log('Preview:', preview ? 'Set' : 'Not set')
  console.log('Current image:', currentImage ? 'Set' : 'Not set')

  return (
    <div className="relative group">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          w-20 h-20 rounded-full cursor-pointer transition-all duration-300
          ${isDragging ? 'ring-4 ring-blue-400 scale-105' : 'hover:ring-2 hover:ring-blue-300 hover:scale-105'}
        `}
        style={{
          backgroundColor: displayImage ? 'transparent' : undefined,
          border: displayImage ? '2px solid #3b82f6' : undefined
        }}
      >
        {displayImage ? (
          <img 
            src={displayImage} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover"
            style={{ position: 'relative', zIndex: 1 }}
          />
        ) : (
          <div 
            className="w-full h-full rounded-full flex items-center justify-center text-white"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
        
        {/* Upload overlay */}
        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0118 7h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Upload hint */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded whitespace-nowrap">
          Click to upload
        </span>
      </div>
    </div>
  )
}
