import React, { useState } from 'react'
import { Container, Typography, TextField, Button } from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

const AddFAQPage = () => {
  const { customApiCall } = useAuth()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const handleQuestionChange = event => {
    setQuestion(event.target.value)
  }

  const handleAnswerChange = event => {
    setAnswer(event.target.value)
  }

  const handleAddFAQ = async () => {
    await customApiCall('post', 'admin/addFaq', {
      question,
      answer
    }).then(res => {
      if (res.error) {
        alert(res.error)
      } else {
        alert(res?.message)
      }
      console.log(res)
    })

    setQuestion('')
    setAnswer('')
  }

  return (
    <Container maxWidth='xl' style={{ marginTop: '2rem', backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
      <Typography variant='h4' gutterBottom>
        Add FAQ
      </Typography>
      <form>
        <TextField
          label='Question'
          fullWidth
          multiline
          rows={3}
          variant='outlined'
          value={question}
          onChange={handleQuestionChange}
          margin='normal'
        />
        <TextField
          label='Answer'
          fullWidth
          multiline
          rows={5}
          variant='outlined'
          value={answer}
          onChange={handleAnswerChange}
          margin='normal'
        />
        <Button variant='contained' color='primary' onClick={handleAddFAQ} style={{ marginTop: 15 }}>
          Add FAQ
        </Button>
      </form>
    </Container>
  )
}

export default AddFAQPage
