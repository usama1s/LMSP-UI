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

import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'
import useAuth from 'src/@core/utils/useAuth'
import { getFile } from 'src/@core/utils/general'

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
  const { customApiCall } = useAuth()
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  const router = useRouter()
  const { id } = router.query as { id: string }
  const [info, setInfo] = useState<any>(null)
  const [video, setVideo] = useState<any>(null)
  const [infoImage, setInfoImage] = useState<any>(null)

  const [details, setDetails] = useState<Details | null>(null)
  useEffect(() => {
    const fetchDetails = async () => {
      console.log('id', id)
      await customApiCall('get', `/admin/get-item/${id}`).then(async r => {
        console.log('Article Inventoty', r)
        var infoImage = await getFile(r?.image_1)
        var infoFile = await getFile(r.information_file)
        var videoFile = await getFile(r.video_file)
        // datavideo / quicktimebase64
        setInfoImage(`data:image/png;base64,${infoImage}`)
        const indexOf4Video = videoFile.indexOf('4')

        var secondPartOfVideo
        if (indexOf4Video !== -1) {
          secondPartOfVideo = videoFile.substring(indexOf4Video + 1)
        }
        setVideo(`data:video/quicktime;base64,${secondPartOfVideo}`)

        const indexOf4 = infoFile.indexOf('4')

        var secondPart
        if (indexOf4 !== -1) {
          const firstPart = infoFile.substring(0, indexOf4 + 1)
          secondPart = infoFile.substring(indexOf4 + 1)
        }
        setInfo(`data:application/pdf;base64,${secondPart}`)

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
      })
    }

    if (id) {
      fetchDetails()
    }
  }, [id])

  const renderCarousel = () => {
    if (details && details.images && details.images.length > 0) {
      return <img src={infoImage} alt={`nonex`} style={{ width: '50%', height: '50%', margin: '0 25%' }} />
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
          <ReactPlayer url={video} width='100%' height='400px' controls />
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
              fileUrl={info}
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
