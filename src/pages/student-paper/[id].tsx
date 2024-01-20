// pages/studentQuiz.tsx
import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Grid, Radio, Button } from '@mui/material'
import { useRouter } from 'next/router'
import useAuth from 'src/@core/utils/useAuth'
import SuccessModal from 'src/views/components/SuccessModel'

interface Question {
  question: string
  options: string[]
  correctOption: string
  selectedOption?: string | null
  isCorrect?: boolean | null
}

const StudentPaperPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [user, setUser] = useState(null)

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [totalMarks, setTotalMarks] = useState(0)
  const [obtainedMarks, setObtainedMarks] = useState(0)

  const handleOptionChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions]
    if (updatedQuestions[questionIndex].selectedOption === null) {
      updatedQuestions[questionIndex].selectedOption = optionIndex.toString()
      setQuestions(updatedQuestions)
    }
  }

  const getGrade = (obtainedMarks: number, totalMarks: number): string => {
    const percentage = (obtainedMarks / totalMarks) * 100
    if (percentage >= 80) {
      return 'A'
    } else if (percentage >= 70) {
      return 'B'
    } else if (percentage >= 60) {
      return 'C'
    } else if (percentage >= 50) {
      return 'D'
    } else {
      return 'F'
    }
  }

  const handleSubmit = async () => {
    let obtained = 0
    questions.forEach(q => {
      if (q.selectedOption === q.correctOption) {
        obtained++
        q.isCorrect = true
      } else {
        q.isCorrect = false
      }
    })

    setObtainedMarks(obtained)
    setTotalMarks(questions.length)

    const grade = getGrade(obtained, questions.length)

    const dataToSend = {
      student_id: user?.student_id,
      paper_id: id,
      total_marks: questions.length,
      obtained_marks: obtained,
      grade: grade,
      percentage: (obtainedMarks / totalMarks) * 100
    }

    await customApiCall('post', 'student/submit-paper', dataToSend).then(() => {
      setShowSuccessModal(true)
      localStorage.removeItem('paperData')
    })
  }

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (questions.some(q => q.selectedOption === null)) {
      const message = 'You have unsaved changes. Are you sure you want to leave?'
      event.returnValue = message
      return message
    }
  }

  const handleRouteChange = (url: string) => {
    if (questions.some(q => q.selectedOption === null)) {
      const confirmNavigation = window.confirm(
        `You can't open the paper again if you leave. Are you sure you want to leave?`
      )
      if (!confirmNavigation) {
        router.events.emit('routeChangeError')
        throw 'routeChange aborted.'
      } else {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('visibilitychange', handleVisibilityChange)

        handleSubmit()
      }
    }
  }

  const handleVisibilityChange = () => {
    if (questions.some(q => q.selectedOption === null && !document.hidden)) {
      const confirmNavigation = window.confirm('You have unsaved changes. Are you sure you want to leave?')
      if (!confirmNavigation) {
        router.events.emit('routeChangeError')
        throw 'routeChange aborted.'
      } else {
        router.events.off('beforeHistoryChange', handleRouteChange)
        window.removeEventListener('beforeunload', handleBeforeUnload)

        handleSubmit()
      }
    }
  }

  useEffect(() => {
    router.events.on('beforeHistoryChange', handleRouteChange)
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      router.events.off('beforeHistoryChange', handleRouteChange)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [questions, router])

  useEffect(() => {
    var user = localStorage.getItem('user')

    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      setUser(loggedInUser)
    }
    var retrievedDataJSON = localStorage.getItem('paperData')
    var retrievedData = JSON.parse(retrievedDataJSON)
    const updatedQuestions = retrievedData.map((question: Question) => ({
      ...question,
      selectedOption: null
    }))
    setQuestions(updatedQuestions)
  }, [])

  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Student Paper
      </Typography>

      {questions.map((q, index) => (
        <Paper
          key={index}
          style={{
            padding: '1rem',
            marginTop: '1rem',
            backgroundColor: q.isCorrect === true ? '#aed581' : q.isCorrect === false ? '#ef5350' : 'inherit'
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body1'>{q.question}</Typography>
            </Grid>
            {q.options.map((option, optionIndex) => (
              <Grid item xs={12} key={optionIndex}>
                <Radio
                  checked={q.selectedOption === optionIndex.toString()}
                  onChange={() => handleOptionChange(index, optionIndex)}
                  disabled={q.selectedOption !== null}
                />
                <span>{option}</span>
              </Grid>
            ))}
          </Grid>
        </Paper>
      ))}

      <Grid container spacing={2} mt={3}>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          style={{ marginTop: '1rem' }}
          disabled={questions.some(q => q.selectedOption === null)}
        >
          Submit
        </Button>
      </Grid>
      <SuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          router.back()
        }}
        obtainedMarks={obtainedMarks}
        totalMarks={totalMarks}
      />
    </Container>
  )
}

export default StudentPaperPage
