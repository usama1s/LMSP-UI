import path from 'path'
import api from './api'
export const getFile = async (filename: string) => {
  try {
    const lastIndex = filename.lastIndexOf('\\')
    const result = filename.substring(lastIndex + 1)
    const response = await api.get(`/general/uploads/${path.basename(result)}`)
    return response?.data?.base64File
  } catch (error) {
    console.error('Failed to fetch image:', error)
  }
}

export const downloadFileFromBase64 = (base64String: string, fileName: string) => {
  // Convert the base64 string to a Blob
  const byteCharacters = atob(base64String)
  const byteNumbers = new Array(byteCharacters.length)

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  const byteArray = new Uint8Array(byteNumbers)
  const blob = new Blob([byteArray], { type: 'application/octet-stream' })

  // Create a download link
  const downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = fileName + '.pdf'

  // Append the link to the body and click it to trigger the download
  document.body.appendChild(downloadLink)
  downloadLink.click()

  // Remove the link from the DOM
  document.body.removeChild(downloadLink)
}
