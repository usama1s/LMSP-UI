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

  const getQuizes = async userId => {
    await customApiCall('get', `student/get-quiz/${userId}/${id}`).then(r => {
      console.log(r?.quizData)
      setQuizes(r?.quizData)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      var loggedInUser = localStorage.getItem('user')
      if (loggedInUser) {
        var parsedUser = JSON.parse(loggedInUser)
        setUser(parsedUser)
        await getQuizes(parsedUser.student_id) // Move the getQuizes call here
      }
    }

    fetchData()
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
