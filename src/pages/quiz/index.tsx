// // pages/quiz.tsx
// import React, { useState } from 'react'
// import {
//   Container,
//   Typography,
//   TextField,
//   Button,
//   IconButton,
//   Paper,
//   Grid,
//   FormControlLabel,
//   Radio,
//   RadioGroup
// } from '@mui/material'
// import DeleteIcon from '@mui/icons-material/Delete'

// interface Question {
//   question: string
//   options: string[]
//   correctOption: string
// }

// const QuizPage: React.FC = () => {
//   const [questions, setQuestions] = useState<Question[]>([
//     { question: '', options: ['', '', '', ''], correctOption: '0' }
//   ])

//   const handleQuestionChange = (index: number, value: string) => {
//     const updatedQuestions = [...questions]
//     updatedQuestions[index].question = value
//     setQuestions(updatedQuestions)
//   }

//   const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
//     const updatedQuestions = [...questions]
//     updatedQuestions[questionIndex].options[optionIndex] = value
//     setQuestions(updatedQuestions)
//   }

//   const handleCorrectOptionChange = (questionIndex: number, value: string) => {
//     const updatedQuestions = [...questions]
//     updatedQuestions[questionIndex].correctOption = value
//     setQuestions(updatedQuestions)
//   }

//   const addQuestion = () => {
//     setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '0' }])
//   }

//   const deleteQuestion = (index: number) => {
//     if (questions.length > 1) {
//       const updatedQuestions = [...questions]
//       updatedQuestions.splice(index, 1)
//       setQuestions(updatedQuestions)
//     }
//   }

//   const handleCancel = () => {
//     setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '0' }])
//   }
//   const handleSubmit = () => {
//     console.log(questions)
//   }

//   return (
//     <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
//       <Typography variant='h4' gutterBottom>
//         Quiz
//       </Typography>

//       {questions.map((q, index) => (
//         <Paper key={index} style={{ padding: '1rem', marginTop: '1rem' }}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 label={`Question ${index + 1}`}
//                 fullWidth
//                 multiline
//                 variant='outlined'
//                 value={q.question}
//                 onChange={e => handleQuestionChange(index, e.target.value)}
//               />
//             </Grid>

//             <Grid item xs={12}>
//               <RadioGroup
//                 name={`options-${index}`}
//                 value={q.correctOption}
//                 onChange={e => handleCorrectOptionChange(index, e.target.value)}
//               >
//                 {q.options.map((option, optionIndex) => (
//                   <FormControlLabel
//                     key={optionIndex}
//                     value={optionIndex.toString()}
//                     control={<Radio />}
//                     style={{ marginTop: 10 }}
//                     label={
//                       <TextField
//                         variant='outlined'
//                         fullWidth
//                         value={option}
//                         onChange={e => handleOptionChange(index, optionIndex, e.target.value)}
//                       />
//                     }
//                   />
//                 ))}
//               </RadioGroup>
//             </Grid>

//             <Grid item xs={12} textAlign='right'>
//               <IconButton color='error' onClick={() => deleteQuestion(index)}>
//                 <DeleteIcon />
//               </IconButton>
//             </Grid>
//           </Grid>
//         </Paper>
//       ))}
//       <Grid container spacing={2} mt={3}>
//         <Button variant='contained' color='primary' onClick={addQuestion} style={{ marginTop: '1rem' }}>
//           Add Question
//         </Button>
//       </Grid>

//       <Grid container spacing={2} mt={2}>
//         <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: '1rem' }}>
//           Submit
//         </Button>
//         <Button
//           variant='outlined'
//           color='error'
//           style={{ marginTop: '1rem', marginLeft: '1rem' }}
//           onClick={handleCancel}
//         >
//           Cancel
//         </Button>
//       </Grid>
//     </Container>
//   )
// }

// export default QuizPage

// pages/quiz.tsx
import React, { ElementType, useState } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  ButtonProps
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'

interface Question {
  question: string
  options: string[]
  correctOption: string
  image?: string | undefined // Add image property to the Question interface
}

const QuizPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { question: '', options: ['', '', '', ''], correctOption: '0', image: '/images/avatars/placeholder.png' }
  ])
  const [img, setImg] = useState<string | null>(null)

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].question = value
    setQuestions(updatedQuestions)
  }

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const handleCorrectOptionChange = (questionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].correctOption = value
    setQuestions(updatedQuestions)
  }

  const handleImageChange = (questionIndex: number, file: File) => {
    const updatedQuestions = [...questions]
    const reader = new FileReader()

    reader.onload = e => {
      if (e.target?.result) {
        updatedQuestions[questionIndex + 1].image = e.target.result.toString()
        setQuestions(updatedQuestions)
      }
    }

    reader.readAsDataURL(file)
  }

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: '0' }])
  }

  const deleteQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions]
      updatedQuestions.splice(index, 1)
      setQuestions(updatedQuestions)
    }
  }

  const handleCancel = () => {
    setQuestions([{ question: '', options: ['', '', '', ''], correctOption: '0' }])
  }

  const handleSubmit = () => {
    console.log(questions)
    // Include logic to submit data, e.g., send to server
  }

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius
  }))

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      textAlign: 'center',
      marginTop: theme.spacing(4)
    }
  }))
  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Quiz
      </Typography>

      {questions.map((q, index) => (
        <Paper key={index} style={{ padding: '1rem', marginTop: '1rem' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label={`Question ${index + 1}`}
                fullWidth
                multiline
                variant='outlined'
                value={q.question}
                onChange={e => handleQuestionChange(index, e.target.value)}
              />
            </Grid>
            {/*
            <Grid item xs={12}>
              <input
                type='file'
                accept='image/*'
                onChange={e => handleImageChange(index, e.target.files?.[0] as File)}
                style={{ margin: '1rem 0' }}
              />
            </Grid> */}
            <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ImgStyled src={q.image || '/images/avatars/placeholder.png'} alt='Question Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload Photo
                    <input
                      hidden
                      type='file'
                      onChange={e => handleImageChange(index, e.target.files?.[0] as File)}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => {
                      const dummy = [...questions]
                      dummy[index].image = '/images/avatars/placeholder.png'
                      setQuestions(dummy)
                    }}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG. Max size of 800K.
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <RadioGroup
                name={`options-${index}`}
                value={q.correctOption}
                onChange={e => handleCorrectOptionChange(index, e.target.value)}
              >
                {q.options.map((option, optionIndex) => (
                  <FormControlLabel
                    key={optionIndex}
                    value={optionIndex.toString()}
                    control={<Radio />}
                    style={{ marginTop: 10 }}
                    label={
                      <TextField
                        variant='outlined'
                        fullWidth
                        value={option}
                        onChange={e => handleOptionChange(index, optionIndex, e.target.value)}
                      />
                    }
                  />
                ))}
              </RadioGroup>
            </Grid>

            <Grid item xs={12} textAlign='right'>
              <IconButton color='error' onClick={() => deleteQuestion(index)}>
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Grid container spacing={2} mt={3}>
        <Button variant='contained' color='primary' onClick={addQuestion} style={{ marginTop: '1rem' }}>
          Add Question
        </Button>
      </Grid>

      <Grid container spacing={2} mt={2}>
        <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: '1rem' }}>
          Submit
        </Button>
        <Button
          variant='outlined'
          color='error'
          style={{ marginTop: '1rem', marginLeft: '1rem' }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </Grid>
    </Container>
  )
}

export default QuizPage
