import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

const ContactUsMessagesPage = () => {
  const { customApiCall } = useAuth()
  const [contactMessages, setContactMessages] = useState([])

  const fetchQuestions = async () => {
    await customApiCall('get', `admin/getContactUs`).then(r => {
      setContactMessages(r?.contactUs)
    }).catch(err => {
      console.log(err)
    })
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Contact Us Messages
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactMessages.map(message => (
              <TableRow key={message.id}>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.email}</TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell>{message.message}</TableCell>
                <TableCell>{new Date(message.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}

export default ContactUsMessagesPage
