// pages/quiz.tsx
import React, { ElementType, useState, forwardRef, useEffect } from 'react'
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
  ButtonProps,
  TextFieldProps
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import useAuth from 'src/@core/utils/useAuth'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import 'react-datepicker/dist/react-datepicker.css'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
interface Question {
  question: string
  options: string[]
  correctOption: string | null
  image?: string | undefined
}

const QuizPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [quizDaate, setQuizDate] = useState<Date | null>(null)
  const [quizTime,setQuizTime]=useState<Date | null>(null)
  const [questions, setQuestions] = useState<Question[]>([
    // { question: '', options: ['', '', '', ''], correctOption: null, image: '/images/avatars/placeholder.png' }
  ])
  const [img, setImg] = useState<string | null>(null)
  const [programPlanId, setProgramPlanId] = useState<string | null>(null)
  const [subjects, setSubjects] = useState([])

  const [user, setUser] = useState(null)

  useEffect(() => {
    var user = localStorage.getItem('user')
    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      getAllsubjects(loggedInUser?.instructor_id)
      setUser(loggedInUser)
    }
  }, [])
  const getAllsubjects = async instructorId => {
    await customApiCall('get', `instructor/${instructorId}/subjects`).then(r => {
      setSubjects(r?.subjects)
    })
  }

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

  const handleImageChange = (index: number) => (file: File) => {
    const updatedQuestions = [...questions]
    const reader = new FileReader()

    reader.onload = e => {
      if (e.target?.result) {
        updatedQuestions[index].image = e.target.result.toString()
        setQuestions(updatedQuestions)
      }
    }

    reader.readAsDataURL(file)
  }

  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: ['', '', '', ''], correctOption: null, image: '' }])
  }

  const deleteQuestion = (index: number) => {
    if (questions.length > 0) {
      const updatedQuestions = [...questions]
      updatedQuestions.splice(index, 1)
      setQuestions(updatedQuestions)
    }
  }

  const handleCancel = () => {
    setQuizDate(null)
    setQuizTime(null)
    setProgramPlanId(null)
    setQuestions([])
  }

  const handleSubmit = async () => {
    if (!quizDaate || !programPlanId || questions.length == 0) {
      alert('Please fill all details')
    } else {
      const selectedSubject = subjects.find(subject => subject.subject_id === programPlanId)
      const requestData = {
        subject_id: programPlanId,
        quiz_date: quizDaate.toISOString().split('T')[0],
        quiz_time:quizTime?.$d?.toLocaleTimeString()?.substring(2,7),
        quiz_questions: questions,
        instructor_id: user?.instructor_id,
        section: selectedSubject.section
      }
      console.log('data to send', requestData)
      await customApiCall('post', '/instructor/add-quiz', requestData)
        .then(r => {
          console.log(r)
          alert(r)
          handleCancel()
        })
        .catch(err => {
          console.log(err)
          alert(err)
        })
    }
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
  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' style={{ backgroundColor: 'white' }} />
  })
  return (
    <DatePickerWrapper>
      <Container maxWidth='lg' style={{ marginTop: '2rem', backgroundColor: 'white', padding: 30, borderRadius: 10 }}>
        <Typography variant='h4' gutterBottom>
          Quiz
        </Typography>
        <Grid item xs={12} sm={6} mt={3}>
          <DatePicker
            selected={quizDaate}
            showYearDropdown
            showMonthDropdown
            placeholderText='MM-DD-YYYY'
            customInput={<CustomInput label={'Quiz Date'} />}
            id='form-layouts-separator-date'
            onChange={(date: Date) => {
              setQuizDate(date)
            }}
          />
        </Grid>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid item xs={12} sm={6} mt={3}>
        <TimePicker
       
         value={quizTime}
         label={'Quiz Time'} 
          ampm={false}
          format='mm:ss'
          onChange={(newTime:Date | null)=>setQuizTime(newTime)}
        />
        </Grid>
        </LocalizationProvider>
        <Grid item xs={12} sm={6} mt={3}>
          <FormControl fullWidth style={{ backgroundColor: 'white' }}>
            <InputLabel>Subject</InputLabel>
            <Select label='Subject' value={programPlanId} onChange={e => setProgramPlanId(e.target.value as string)}>
              {subjects?.map((item, index) => (
                <MenuItem value={item?.subject_id}>{item?.subject_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
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
              <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImgStyled src={q.image || '/images/avatars/placeholder.png'} alt='Question Pic' />

                  <Box>
                    <ButtonStyled
                      component='label'
                      variant='contained'
                      htmlFor={`account-settings-upload-image${index}`}
                    >
                      Upload Photo
                      <input
                        hidden
                        type='file'
                        onChange={e => handleImageChange(index)(e.target.files?.[0] as File)}
                        accept='image/png, image/jpeg'
                        id={`account-settings-upload-image${index}`}
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
    </DatePickerWrapper>
  )
}

export default QuizPage
