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
  const { customApiCall } = useAuth()

  const quizzes: Quiz[] = [
    { id: 1, title: 'Quiz 1', courseName: 'Course A' },
    { id: 2, title: 'Quiz 2', courseName: 'Course B' },
    { id: 3, title: 'Quiz 3', courseName: 'Course C' },
    { id: 4, title: 'Quiz 4', courseName: 'Course D' }
  ]

  return (
    <Container style={{ marginTop: '2rem', height: '100vh' }}>
      <Typography variant='h4' gutterBottom>
        Student Quiz
      </Typography>

      <Grid container spacing={3}>
        {quizzes.map(quiz => (
          <Grid item xs={12} sm={6} md={4} key={quiz.id}>
            <Card>
              <CardContent>
                <Typography variant='h4' component='div'>
                  {quiz.title}
                </Typography>
              </CardContent>
              <Button
                onClick={() => {
                  router.push(`/student-quiz/${quiz.id}`)
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
