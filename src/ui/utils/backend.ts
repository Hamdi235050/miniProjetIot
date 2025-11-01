export const uploadImageForDetection = async (imageData: string) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

  const response = await fetch(`${BACKEND_URL}/api/detect`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ image: imageData }),
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`Failed to upload image: ${response.status} ${text}`)
  }

  return response.json()
}
