import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Grid, Button, Card, CardContent } from '@mui/material'
import { useRouter } from 'next/router'
import useAuth from 'src/@core/utils/useAuth'

interface Quiz {
  id: number
  title: string
  courseName: string
}

const StudentQuizPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query as { id: string }
  const { customApiCall } = useAuth()
  const [quizes, setQuizes] = useState([])
  const [user, setUser] = useState(null)

  const getQuizes = async () => {
    await customApiCall('get', `student/get-quiz/${user?.student_id}/${id}`).then(r => {
      setQuizes(r?.quizData)
    })
  }
  // const quizzes: Quiz[] = [
  //   { id: 1, title: 'Quiz 1', courseName: 'Course A' },
  //   { id: 2, title: 'Quiz 2', courseName: 'Course B' },
  //   { id: 3, title: 'Quiz 3', courseName: 'Course C' },
  //   { id: 4, title: 'Quiz 4', courseName: 'Course D' }
  // ]

  useEffect(() => {
    var loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      var parsedUser = JSON.parse(loggedInUser)

      setUser(parsedUser)
    }
    getQuizes()
  }, [])

  return (
    <Container style={{ marginTop: '2rem', height: '100vh' }}>
      <Typography variant='h4' gutterBottom>
        Student Quiz
      </Typography>

      <Grid container spacing={3}>
        {Object.keys(quizes).map((quiz, index) => (
          <Grid item xs={12} sm={6} md={4} key={quiz}>
            <Card>
              <CardContent>
                <Typography variant='h4' component='div'>
                  Quiz {index + 1}
                </Typography>
              </CardContent>
              <Button
                onClick={() => {
                  let quizDataJSON = JSON.stringify(quizes[quiz])
                  localStorage.setItem('quizData', quizDataJSON)
                  router.push(`/student-quiz/${quiz}`)
                }}
                fullWidth
                variant='contained'
                color='primary'
              >
                Attempt Quiz
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default StudentQuizPage
