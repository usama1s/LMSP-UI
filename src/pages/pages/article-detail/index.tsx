import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { Card, CardContent, Typography, Box, Slide, Button } from '@mui/material'
import Carousel from 'react-material-ui-carousel'
// import { Worker, Viewer } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
import { Document, pdfjs } from 'react-pdf'
import ReactPlayer from 'react-player'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import { Viewer } from '@react-pdf-viewer/core'

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

// Import your styles or any other necessary components

// Configure the PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

interface DetailPageProps {
  id: string
}

interface Details {
  title: string
  description: string
  images: string[]
  video?: string
  pdf: string
  file: string
  image: string
}

const DetailPage: React.FC = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const router = useRouter()
  const { id } = router.query as { id: string }

  const [details, setDetails] = useState<Details | null>(null)

  useEffect(() => {
    const fetchDetails = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock data - replace with your actual API call
      const mockData: Details = {
        title: `Sample Title ${id}`,
        description: `This is a sample description for item ${id}.`,
        images: [
          'https://via.placeholder.com/800x400',
          'https://via.placeholder.com/800x400',
          'https://via.placeholder.com/800x400'
        ],
        video: '/images/dummy.mp4',
        pdf: `https://drive.google.com/file/d/1anRzwK5ZJFBHAYV334i3ERvrNJdU_sh8/view?usp=sharing`,
        file: `https://drive.google.com/file/d/1anRzwK5ZJFBHAYV334i3ERvrNJdU_sh8/view?usp=sharing`,
        image: '/images/dummyImage.jpeg'
      }

      setDetails(mockData)
    }

    if (id) {
      fetchDetails()
    }
  }, [id])

  const renderCarousel = () => {
    if (details && details.images && details.images.length > 0) {
      return <img src={details.image} alt={`nonex`} style={{ width: '50%', height: '50%', margin: '0 25%' }} />
    }

    return <Typography>No images available</Typography>
  }

  const renderVideo = () => {
    if (details && details.video) {
      return (
        <Box mt={3}>
          <Typography variant='h6' gutterBottom>
            Video
          </Typography>
          <ReactPlayer url={details.video} width='100%' height='400px' controls />
        </Box>
      )
    }

    return null
  }

  const renderPDF = () => {
    if (details && details.pdf) {
      return (
        <Box mt={3} width={'100%'}>
          <Typography variant='h6' gutterBottom>
            PDF Document
          </Typography>
          <Box maxWidth={600}>
            <Viewer
              fileUrl={'/images/resume.pdf'}
              plugins={[
                // Register plugins
                defaultLayoutPluginInstance
              ]}
            />
          </Box>
        </Box>
      )
    }

    return null
  }

  const renderFile = () => {
    if (details && details.file) {
      const fileType = details.file.substring(details.file.lastIndexOf('.') + 1).toLowerCase()

      if (['ppt', 'pptx', 'docx'].includes(fileType)) {
        return (
          <Box mt={3}>
            <Typography variant='h6' gutterBottom>
              Attached File
            </Typography>
            {['ppt', 'pptx'].includes(fileType) && <Typography>{`Display PPT here: ${details.file}`}</Typography>}
            {fileType === 'docx' && <Typography>{`Display DOCX here: ${details.file}`}</Typography>}
          </Box>
        )
      }
    }

    return null
  }

  return (
    <Slide in={Boolean(details)} direction='up' mountOnEnter unmountOnExit>
      <Card>
        {details && (
          <>
            {renderCarousel()}
            {renderVideo()}
            {renderPDF()}
            <CardContent>
              {/* <Typography variant='h4' gutterBottom>
                {details.title}
              </Typography>
              <Typography variant='body1' paragraph>
                {details.description}
              </Typography> */}
              {renderFile()}
            </CardContent>
          </>
        )}
      </Card>
    </Slide>
  )
}

DetailPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>
export default DetailPage
