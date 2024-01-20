// StudentAssignmentPage.tsx
import React, { useState, ElementType, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Paper,
  Box,
  ButtonProps,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import { styled } from '@mui/material/styles'
import useAuth from 'src/@core/utils/useAuth'
import { useRouter } from 'next/router'
import { getFile } from 'src/@core/utils/general'

const StudentAssignmentPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [user, setUser] = useState(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [assignmentDetails, setAssignmentDetails] = useState({
    answerFile: null as string | null
  })
  const [assignmentQuestion, setAssignmentQuestion] = useState(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const downloadFile = (path: string) => {
    // Replace the file path with the correct path on your server
    const filePath = path
    const link = document.createElement('a')
    link.href = filePath
    link.download = 'downloaded_file.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setPdfFile(file)
    setAssignmentDetails({
      ...assignmentDetails,
      answerFile: await toBase64(file)
    })
  }

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  function isValidBase64(str) {
    try {
      // Attempt to decode the base64 string
      atob(str)
      return true
    } catch (e) {
      // If an error occurs, the string is not valid base64
      return false
    }
  }

  const handleDownload = async path => {
    const base64 = await getFile(path)

    if (base64) {
      const a = document.createElement('a')
      a.href = `data:application/pdf;base64,${base64}`
      a.download = 'assignment.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }
  const downloadQuestionFile = async () => {
    const path = assignmentQuestion?.assignment_file
    // console.log('Questionnnnnnnnnnnnnn', questionFileBase64)
    // downloadFile(questionFileBase64)
    const base = await getFile(path).then(r => {
      return r
    })
    console.log('BASEE', base)
    if (base) {
      const a = document.createElement('a')
      a.href = `data:application/pdf;base64,${base}`
      a.download = 'assignment.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      // console.log(base)

      // const blob = dataURItoBlob(base)
      // const url = URL.createObjectURL(blob)
      // const a = document.createElement('a')
      // a.href = url
      // a.download = `${assignmentQuestion?.assignment_title}.pdf`
      // document.body.appendChild(a)
      // a.click()
      // document.body.removeChild(a)
    }
  }

  const handleSubmit = async () => {
    // Logic to submit assignment answer (answerFile)
    const dataToSend = {
      student_id: user?.student_id,
      assignment_id: id,
      submitted_file: assignmentDetails.answerFile,
      marks: 0,
      grade: ''
    }
    await customApiCall('post', 'student/submit-assignment', dataToSend).then(r => {
      setShowSuccessDialog(true)
    })
  }

  const handleCloseSuccessDialog = () => {
    setShowSuccessDialog(false)
    router.back()
  }

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  useEffect(() => {
    var user = localStorage.getItem('user')

    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      setUser(loggedInUser)
    }
    var retrievedDataJSON = localStorage.getItem('assignmentData')
    var retrievedData = JSON.parse(retrievedDataJSON)

    setAssignmentQuestion(retrievedData)
  }, [])

  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem', height: '100vh' }}>
      <Button variant='outlined' color='secondary' onClick={downloadQuestionFile} style={{ marginTop: '1rem' }}>
        Download Assignment
      </Button>
      <Paper style={{ padding: '2rem', marginTop: '1rem' }}>
        <Box key={'pdffile'} display='flex' alignItems='center' mt={4}>
          <ButtonStyled
            component='label'
            variant='contained'
            htmlFor={`file-upload`}
            sx={{ marginRight: 3, minWidth: 150 }}
          >
            Upload File
            <input
              hidden
              type='file'
              onChange={handleFileChange}
              accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
              id={`file-upload`}
            />
          </ButtonStyled>
          <Box sx={{ marginLeft: 2 }}>Selected File : {pdfFile?.name}</Box>
        </Box>

        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          disabled={!assignmentDetails.answerFile}
          style={{ marginTop: '1rem' }}
        >
          Submit Answer
        </Button>
      </Paper>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onClose={handleCloseSuccessDialog}>
        <DialogTitle>Assignment Submitted Successfully!</DialogTitle>
        <DialogContent>
          <Typography variant='body1'>Your assignment has been submitted successfully.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color='primary' variant='contained'>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default StudentAssignmentPage
