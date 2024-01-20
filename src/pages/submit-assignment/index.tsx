import React, { useEffect, useState } from 'react'
import { Container, Typography, Paper, Grid, Button, Card, CardContent } from '@mui/material'
import { useRouter } from 'next/router'
import useAuth from 'src/@core/utils/useAuth'

const StudentAssignmentPage: React.FC = ({ assignmentsData }) => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [user, setUser] = useState(null)
  const [assignments, setAssignments] = useState(assignmentsData || [])

  // const getAssignments = async () => {
  //   await customApiCall('get', `student/get-assignment/${user?.student_id}/${id}`).then(r => {
  //     setAssignments(r?.assignmentData)
  //   })
  // }

  useEffect(() => {
    var loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      var parsedUser = JSON.parse(loggedInUser)

      setUser(parsedUser)
    }
  }, [])
  return (
    <Container style={{ marginTop: '2rem', height: '100vh' }}>
      <Typography variant='h4' gutterBottom>
        Student Assignment
      </Typography>

      <Grid container spacing={3}>
        {assignmentsData.map((assignment, index) => (
          <Grid item xs={12} sm={6} md={4} key={assignment?.assignment_id}>
            <Card>
              <CardContent>
                <Typography variant='h4' component='div'>
                  {assignment?.assignment_title}
                </Typography>
                <Typography variant='h6' component='div'>
                  {assignment?.assignment_instruction}
                </Typography>
              </CardContent>
              <Button
                onClick={() => {
                  let assignmentDataJSON = JSON.stringify(assignment)
                  localStorage.setItem('assignmentData', assignmentDataJSON)

                  router.push(`/submit-assignment/${assignment?.assignment_id}`)
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

export default StudentAssignmentPage
