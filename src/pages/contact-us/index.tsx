import React, { useState } from 'react'
import { Container, Typography, TextField, Button } from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

const ContactUsForm = () => {
  const { customApiCall } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleNameChange = event => {
    setName(event.target.value)
  }

  const handleEmailChange = event => {
    setEmail(event.target.value)
  }

  const handleSubjectChange = event => {
    setSubject(event.target.value)
  }

  const handleMessageChange = event => {
    setMessage(event.target.value)
  }

  const handleSubmit = async () => {
    // Implement logic to handle the form submission (e.g., send the data to a server)

    await customApiCall('post', 'admin/addContactUs', {
      name: name,
      email: email,
      subject: subject,
      message: message
    }).then(res => {
      if (res.error) {
        alert(res.error)
      } else {
        alert(res?.message)
      }
      console.log(res)
    })
    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
  }

  return (
    <Container maxWidth='md' style={{ marginTop: '2rem', backgroundColor: 'white', padding: 10 }}>
      <Typography variant='h4' gutterBottom>
        Contact Us
      </Typography>
      <form>
        <TextField
          label='Your Name'
          fullWidth
          variant='outlined'
          value={name}
          onChange={handleNameChange}
          margin='normal'
        />
        <TextField
          label='Your Email'
          fullWidth
          type='email'
          variant='outlined'
          value={email}
          onChange={handleEmailChange}
          margin='normal'
        />
        <TextField
          label='Subject'
          fullWidth
          variant='outlined'
          value={subject}
          onChange={handleSubjectChange}
          margin='normal'
        />
        <TextField
          label='Your Message'
          fullWidth
          multiline
          rows={5}
          variant='outlined'
          value={message}
          onChange={handleMessageChange}
          margin='normal'
        />
        <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: 15 }}>
          Submit
        </Button>
      </form>
    </Container>
  )
}

export default ContactUsForm
