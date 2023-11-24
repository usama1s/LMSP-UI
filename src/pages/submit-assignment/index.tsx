import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Grid, Button, Card, CardContent } from '@mui/material'
import { useRouter } from 'next/router'
import useAuth from 'src/@core/utils/useAuth'

interface Quiz {
  id: number
  title: string
}

const StudentQuizPage: React.FC = () => {
  const router = useRouter()
  const { customApiCall } = useAuth()

  const quizzes: Quiz[] = [
    { id: 1, title: 'Assignment 1' },
    { id: 2, title: 'Assignment 2' },
    { id: 3, title: 'Assignment 3' },
    { id: 4, title: 'Assignment 4' }
  ]

  return (
    <Container style={{ marginTop: '2rem', height: '100vh' }}>
      <Typography variant='h4' gutterBottom>
        Student Assignment
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
                  router.push(`/submit-assignment/${quiz.id}`)
                }}
                fullWidth
                variant='contained'
                color='primary'
              >
                View Assignment
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default StudentQuizPage
