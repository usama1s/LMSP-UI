// pages/studentQuiz.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup
} from '@mui/material'
import { useRouter } from 'next/router'
import useAuth from 'src/@core/utils/useAuth'
import SuccessModal from 'src/views/components/SuccessModel'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

interface Question {
  question: string
  options: string[]
  correctOption: string
  selectedOption?: string | null
  isCorrect?: boolean | null
}

const StudentFeedback: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [user, setUser] = useState(null)
  const [courseFeedbackId, setCourseFeedbackId] = useState()
  const [courses, setCourses] = useState()

  const [multipleChoiceOptions] = useState(['Poor', 'Average', 'Good', 'Excellent'])

  const getFeedbackCreatedCourses = () => {
    customApiCall('get', `/student/get-course-feedback-by-student/${user?.student_id}`)
      .then(r => {
        setCourses(r)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSubmit = async () => {
    if (questions.find(question => question?.answer === undefined)) alert('Answer All Questions')
    else {
      const dataToSend = {
        student_id: user?.student_id,
        feedback_questions: questions
      }

      await customApiCall('post', 'student/submit-course-feedback', dataToSend)
        .then(r => {
          console.log(r)
          alert(r)
        })
        .catch(err => {
          console.log(err)
          alert(err)
        })
      setCourseFeedbackId(null)
    }
  }

  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (questions.some(q => q.selectedOption === null)) {
      const message = 'You have unsaved changes. Are you sure you want to leave?'
      event.returnValue = message
      return message
    }
  }

  //   const handleRouteChange = (url: string) => {
  //     if (questions.some(q => q.selectedOption === null)) {
  //       const confirmNavigation = window.confirm(
  //         `You can't open the quiz again if you leave. Are you sure you want to leave?`
  //       )
  //       if (!confirmNavigation) {
  //         router.events.emit('routeChangeError')
  //         throw 'routeChange aborted.'
  //       } else {
  //         window.removeEventListener('beforeunload', handleBeforeUnload)
  //         document.removeEventListener('visibilitychange', handleVisibilityChange)

  //         handleSubmit()
  //       }
  //     }
  //   }

  //   const handleVisibilityChange = () => {
  //     if (questions.some(q => q.selectedOption === null && !document.hidden)) {
  //       const confirmNavigation = window.confirm('You have unsaved changes. Are you sure you want to leave?')
  //       if (!confirmNavigation) {
  //         router.events.emit('routeChangeError')
  //         throw 'routeChange aborted.'
  //       } else {
  //         router.events.off('beforeHistoryChange', handleRouteChange)
  //         window.removeEventListener('beforeunload', handleBeforeUnload)

  //         handleSubmit()
  //       }
  //     }
  //   }

  //   useEffect(() => {
  //     router.events.on('beforeHistoryChange', handleRouteChange)
  //     window.addEventListener('beforeunload', handleBeforeUnload)
  //     document.addEventListener('visibilitychange', handleVisibilityChange)

  //     return () => {
  //       router.events.off('beforeHistoryChange', handleRouteChange)
  //       window.removeEventListener('beforeunload', handleBeforeUnload)
  //       document.removeEventListener('visibilitychange', handleVisibilityChange)
  //     }
  //   }, [questions, router])

  const getCourseFeedback = courseFeedbackId => {
    customApiCall('get', `/admin/get-course-feedback-to-update/${courseFeedbackId}`)
      .then(r => {
        setQuestions(r)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleFeedbackAnswer = (index: int, value: string) => {
    const updatedQuestions = [...questions]

    updatedQuestions[index].answer = value
    setQuestions(updatedQuestions)
  }

  const handleCourseFeedback = value => {
    setCourseFeedbackId(value)
    getCourseFeedback(value)
  }

  useEffect(() => {
    var user = localStorage.getItem('user')

    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      setUser(loggedInUser)
    }
    getFeedbackCreatedCourses()
  }, [])

  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Student Feedback
      </Typography>
      <Grid item xs={12} sm={6} mt={3}>
        <FormControl fullWidth style={{ backgroundColor: 'white' }}>
          <InputLabel>Course Title</InputLabel>
          <Select label='courses' value={courseFeedbackId} onChange={e => handleCourseFeedback(e.target.value)}>
            {courses?.map((item, index) => (
              <MenuItem value={item?.course_feedback_id}>{item?.course_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {courseFeedbackId ? (
        <>
          {questions.map((q, index) => (
            <Paper
              key={index}
              style={{
                padding: '1rem',
                marginTop: '1rem'
                // backgroundColor: q.isCorrect === true ? '#aed581' : q.isCorrect === false ? '#ef5350' : 'inherit'
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='body1'>{q.question}</Typography>
                </Grid>
                {q.question_type_id === 1 ? (
                  <Grid item xs={12}>
                    <RadioGroup
                      name={`feedbackAnswer`}
                      value={q?.answer}
                      onChange={e => handleFeedbackAnswer(index, e.target.value)}
                    >
                      {multipleChoiceOptions.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={option}
                          control={<Radio />}
                          style={{ marginTop: 10 }}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </Grid>
                ) : (
                  <TextField
                    style={{ marginTop: 10 }}
                    variant='outlined'
                    fullWidth
                    value={q?.answer}
                    onChange={e => handleFeedbackAnswer(index, e.target.value)}
                    required
                  />
                )}
                {/* {q.options.map((option, optionIndex) => (
              <Grid item xs={12} key={optionIndex}>
                <Radio
                  checked={q.selectedOption === optionIndex.toString()}
                  onChange={() => handleOptionChange(index, optionIndex)}
                  disabled={q.selectedOption !== null}
                />
                <span>{option}</span>
              </Grid>
            ))} */}
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
        </>
      ) : null}
    </Container>
  )
}

export default StudentFeedback
