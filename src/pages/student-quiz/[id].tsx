// pages/studentQuiz.tsx
import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Grid, Radio, Button, Snackbar, Alert } from '@mui/material'
import { useRouter } from 'next/router'
import useAuth from 'src/@core/utils/useAuth'

interface Question {
  question: string
  options: string[]
  correctOption: string
  selectedOption?: string | null
  isCorrect?: boolean | null
}

var mockData: Question[] = [
  {
    question: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctOption: '2',
    selectedOption: null
  },
  {
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctOption: '1',
    selectedOption: null
  },
  {
    question: 'What is the largest mammal?',
    options: ['Elephant', 'Blue Whale', 'Giraffe', 'Lion'],
    correctOption: '1',
    selectedOption: null
  },
  {
    question: 'In which year did Christopher Columbus reach the Americas?',
    options: ['1492', '1505', '1510', '1485'],
    correctOption: '0',
    selectedOption: null
  },
  {
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus'],
    correctOption: '1',
    selectedOption: null
  },
  {
    question: 'Who wrote "Romeo and Juliet"?',
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctOption: '1',
    selectedOption: null
  },
  {
    question: 'What is the currency of Japan?',
    options: ['Won', 'Yuan', 'Yen', 'Ringgit'],
    correctOption: '2',
    selectedOption: null
  },
  {
    question: 'Which ocean is the largest?',
    options: ['Atlantic Ocean', 'Indian Ocean', 'Southern Ocean', 'Pacific Ocean'],
    correctOption: '3',
    selectedOption: null
  },
  {
    question: 'What is the main ingredient in guacamole?',
    options: ['Tomato', 'Onion', 'Avocado', 'Cilantro'],
    correctOption: '2',
    selectedOption: null
  },
  {
    question: 'What is the speed of light?',
    options: [
      '299,792,458 meters per second',
      '300,000,000 meters per second',
      '200,000,000 meters per second',
      '400,000,000 meters per second'
    ],
    correctOption: '0',
    selectedOption: null
  }
]
const StudentQuizPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [questions, setQuestions] = useState<Question[]>(mockData)

  const [openSnackbar, setOpenSnackbar] = useState(false)
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

    if (percentage >= 90) {
      return 'A+'
    } else if (percentage >= 80) {
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
    setOpenSnackbar(true)
    const grade = getGrade(obtainedMarks, totalMarks)

    const dataToSend = {
      student_id: '1',
      quiz_id: id,
      total_marks: totalMarks,
      obtained_marks: obtained,
      grade: grade
    }
    console.log(dataToSend)

    await customApiCall('post', 'student/submit-quiz', dataToSend).then(r => {
      alert(r)
      questions.forEach(q => {
        if (q.selectedOption === q.correctOption) {
          obtained++
          q.isCorrect = null
          q.selectedOption = null
        } else {
          q.isCorrect = null
          q.selectedOption = null
        }
      })
      setObtainedMarks(0)
      setTotalMarks(0)
      setQuestions(mockData)
      router.back()
    })
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false)
  }

  useEffect(() => {
    // const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    //   if (questions.some(q => q.selectedOption === null)) {
    //     const message = 'You have unsaved changes. Are you sure you want to leave?'
    //     event.returnValue = message

    //     return message
    //   }
    // }

    const handleRouteChange = (url: string) => {
      if (questions.some(q => q.selectedOption === null)) {
        const confirmNavigation = window.confirm(
          `You can't open the quiz again if you leave. Are you sure you want to leave?`
        )
        if (!confirmNavigation) {
          router.events.emit('routeChangeError')
          throw 'routeChange aborted.'
        } else {
          handleSubmit()
        }
      }
    }
    const isPageVisible = () => !document.hidden
    const handleVisibilityChange = () => {
      if (questions.some(q => q.selectedOption === null && !isPageVisible())) {
        const confirmNavigation = window.confirm('You have unsaved changes. Are you sure you want to leave?')
        if (!confirmNavigation) {
          router.events.emit('routeChangeError')
          throw 'routeChange aborted.'
        } else {
          handleSubmit()
        }
      }
    }

    // router.events.on('beforeHistoryChange', handleRouteChange)
    // window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      //   router.events.off('beforeHistoryChange', handleRouteChange)
      //   window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [questions, router])
  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Student Quiz
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
            <Grid item xs={12}>
              <Radio
                checked={q.selectedOption === '0'}
                onChange={() => handleOptionChange(index, 0)}
                disabled={q.selectedOption !== null}
              />
              <span>{q.options[0]}</span>
            </Grid>
            <Grid item xs={12}>
              <Radio
                checked={q.selectedOption === '1'}
                onChange={() => handleOptionChange(index, 1)}
                disabled={q.selectedOption !== null}
              />
              <span>{q.options[1]}</span>
            </Grid>
            <Grid item xs={12}>
              <Radio
                checked={q.selectedOption === '2'}
                onChange={() => handleOptionChange(index, 2)}
                disabled={q.selectedOption !== null}
              />
              <span>{q.options[2]}</span>
            </Grid>
            <Grid item xs={12}>
              <Radio
                checked={q.selectedOption === '3'}
                onChange={() => handleOptionChange(index, 3)}
                disabled={q.selectedOption !== null}
              />
              <span>{q.options[3]}</span>
            </Grid>
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

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity='info'>
          Result: Obtained Marks: {obtainedMarks}/{totalMarks}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default StudentQuizPage
