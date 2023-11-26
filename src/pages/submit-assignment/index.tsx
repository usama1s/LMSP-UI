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
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [user, setUser] = useState(null)
  const [assignments, setAssignments] = useState([])

  const getAssignments = async () => {
    await customApiCall('get', `student/get-assignment/${user?.student_id}/${id}`).then(r => {
      setAssignments(r?.assignmentData)
    })
  }
  useEffect(() => {
    var loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      var parsedUser = JSON.parse(loggedInUser)

      setUser(parsedUser)
    }
    getAssignments()
  }, [])
  return (
    <Container style={{ marginTop: '2rem', height: '100vh' }}>
      <Typography variant='h4' gutterBottom>
        Student Assignment
      </Typography>

      <Grid container spacing={3}>
        {Object.keys(assignments).map((assignment, index) => (
          <Grid item xs={12} sm={6} md={4} key={assignment}>
            <Card>
              <CardContent>
                <Typography variant='h4' component='div'>
                  {assignments[assignment][0]?.assignment_title}
                </Typography>
                <Typography variant='h6' component='div'>
                  {assignments[assignment][0]?.assignment_instruction}
                </Typography>
              </CardContent>
              <Button
                onClick={() => {
                  let assignmentDataJSON = JSON.stringify(assignments[assignment])
                  localStorage.setItem('assignmentData', assignmentDataJSON)
                  router.push(`/submit-assignment/${assignment}`)
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
