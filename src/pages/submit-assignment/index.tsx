// StudentAssignmentPage.tsx
import React, { useState, ElementType } from 'react'
import { Container, Typography, Button, Paper, Box, ButtonProps } from '@mui/material'

import { styled } from '@mui/material/styles'

const StudentAssignmentPage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [assignmentDetails, setAssignmentDetails] = useState({
    answerFile: null as string | null
  })

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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setPdfFile(file)
    setAssignmentDetails({
      ...assignmentDetails,
      answerFile: await toBase64(file)
    })
  }
  const handleSubmit = () => {
    // Logic to submit assignment answer (answerFile)
    console.log(assignmentDetails.answerFile)
  }
  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))
  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Submit Assignment
      </Typography>

      <Paper style={{ padding: '2rem', marginTop: '1rem' }}>
        {/* <label htmlFor='answer-file'>
          <Typography variant='body1' style={{ marginBottom: '1rem' }}>
            Upload Answer (PDF)
          </Typography>
          <input type='file' id='answer-file' onChange={handleFileChange} accept='.pdf' />
        </label> */}
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
    </Container>
  )
}

export default StudentAssignmentPage
