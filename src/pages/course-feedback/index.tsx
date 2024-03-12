// pages/quiz.tsx
import React, { ElementType, useState, forwardRef, useEffect, useMemo } from 'react'
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
import StudentSubmittedFeedbackTable from 'src/views/tables/StudentSubmittedFeedbackTable'
interface Question {
  question: string
  options: string[]
  correctOption: string | null
  image?: string | undefined
}

const FeedbackPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([
  ])
  const [img, setImg] = useState<string | null>(null)
  const [courseId,setCourseId]=useState<int | null>()
  const [questionType,setQuestionType]=useState([])
  const [courses,setCourses]=useState()
  const [updateFeedbackId,setUpdateFeedbackId]=useState()
  const [FeedbackOption,setFeedbackOption]=useState<string | null>(null)

  useEffect(() => {
      getCourses()
      getQuestionTypes()
    
  }, [])

  function getCourses(){
    customApiCall('get', '/admin/get-courses-whose-feedback-is-not-created')
    .then(r => {
     setCourses(r)
    })
    .catch(err => {
      console.log(err)
    })
  }

function getQuestionTypes(){
  customApiCall('get', '/admin/get-question-type')
      .then(r => {
       setQuestionType(r)
      })
      .catch(err => {
        console.log(err)
      })
}

const getFeedbackCreatedCourses=()=>{
  customApiCall('get', '/admin/get-courses-whose-feedback-is-created')
  .then(r => {
   setCourses(r)
  })
  .catch(err => {
    console.log(err)
  })
}

const getCourseFeedbackToUpdate=(courseFeedbackId)=>{
  customApiCall('get', `/admin/get-course-feedback-to-update/${courseFeedbackId}`)
  .then(r => {
   setQuestions(r)
  })
  .catch(err => {
    console.log(err)
  })
}

const handleFeedbackOptions=(value:string)=>{
  setUpdateFeedbackId(null)
  setCourseId(null)
  setQuestions([])
  setFeedbackOption(value)
  if(value==="Create")
  {
    getCourses()
    handleCancel()
  }
  
else 
getFeedbackCreatedCourses()

}

const handleCourseFeedbackToUpdate=(value)=>{
setUpdateFeedbackId(value)
if(FeedbackOption==="Update")
getCourseFeedbackToUpdate(value)

}



  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].question = value
    setQuestions(updatedQuestions)
  }

  const handleQuestionTypeChange=(questionIndex:number,value:string)=>{
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].question_type_id = value
    setQuestions(updatedQuestions)
  }


  const addQuestion = () => {
    setQuestions([...questions, { question: '',question_type_id:''}])
  }

  const deleteQuestion = (index: number) => {
    if (questions.length > 0) {
      const updatedQuestions = [...questions]
      updatedQuestions.splice(index, 1)
      setQuestions(updatedQuestions)
    }
  }

  const handleCancel = () => {
    setCourseId(null)
    setUpdateFeedbackId(null)
    setQuestions([])
  }

  const handleSubmit = async () => {
    console.log(questions,courseId)
    if (  questions.length == 0) {
      alert('Please fill all details')
    } else {
      const requestData = {
        course_feedback_questions: questions,
        course_id:courseId
      }
      console.log('data to send', requestData)
      if(FeedbackOption==="Create"){
    customApiCall('post', '/admin/add-course-feedback', requestData)
        .then(r => {
          console.log(r)
          alert(r)
          handleCancel()
          getCourses()
        })
        .catch(err => {
          console.log(err)
          alert(err)
        })}
        else{
          customApiCall('post', '/admin/update-course-feedback', requestData)
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
        
    }
    // Include logic to submit data, e.g., send to server
  }
console.log(questions)
  return (
    <DatePickerWrapper>

      <Container maxWidth='lg' style={{ marginTop: '2rem', backgroundColor: 'white', padding: 30, borderRadius: 10 }}>
        <Typography variant='h4' gutterBottom>
          Feedback
        </Typography>
        <Grid item xs={12}>
                <RadioGroup row
                  name="FeedbackOptions"
                  value={FeedbackOption}
                  onChange={e => handleFeedbackOptions(e.target.value)}
                >
              
                    <FormControlLabel
                      key="FeedbackOptions"
                      value="Create"
                      
                      control={<Radio />}
                      style={{ marginTop: 10 }}
                      label="Create Feedback"
                    />
                     <FormControlLabel
                      key="FeedbackOptions"
                      value="Update"
                      control={<Radio />}
                      style={{ marginTop: 10 }}
                      label="Update Feedback"
                    />
                     <FormControlLabel
                      key="FeedbackOptions"
                      value="View"
                      control={<Radio />}
                      style={{ marginTop: 10 }}
                      label="View Submitted Feedback"
                    />
                
                </RadioGroup>
              </Grid>
       { FeedbackOption?<>{FeedbackOption==="Create"?<Grid item xs={12} sm={6} mt={3}>
          <FormControl fullWidth style={{ backgroundColor: 'white' }}>
            <InputLabel>Course Title</InputLabel>
            <Select label='courses' value={courseId} onChange={e => setCourseId(e.target.value as int)}>
              {courses?.map((item, index) => (
                <MenuItem value={item?.course_id}>{item?.course_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>:<Grid item xs={12} sm={6} mt={3}>
          <FormControl fullWidth style={{ backgroundColor: 'white' }}>
            <InputLabel>Course Title</InputLabel>
            <Select label='courses' value={updateFeedbackId} onChange={e => handleCourseFeedbackToUpdate(e.target.value)}>
              {courses?.map((item, index) => (
                <MenuItem value={item?.course_feedback_id}>{item?.course_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>}
      
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
                  required
                />
              </Grid>


<Grid item xs={12} sm={6} mt={3}>
          <FormControl fullWidth style={{ backgroundColor: 'white' }}>
            <InputLabel>Question Type</InputLabel>
            <Select label='questionType' value={q.question_type_id} onChange={e => handleQuestionTypeChange(index, e.target.value)} required>
              {questionType?.map((item, index) => (
                <MenuItem value={item?.question_type_id}>{item?.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>


            { FeedbackOption==="Create"? <Grid item xs={12} textAlign='right'>
                <IconButton color='error' onClick={() => deleteQuestion(index)}>
                  <DeleteIcon />
                </IconButton>
              </Grid>:null}
            </Grid>
          </Paper>
        ))}
      { courseId || updateFeedbackId && FeedbackOption!=="View"?<> {FeedbackOption==="Create" ?<Grid container spacing={2} mt={3}>
          <Button variant='contained' color='primary' onClick={addQuestion} style={{ marginTop: '1rem' }}>
            Add Question
          </Button>
        </Grid>:null}

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
        </Grid></>:null}</>:null}
        <br/>
        {FeedbackOption==="View" && updateFeedbackId?<StudentSubmittedFeedbackTable students={[]} />:null}
      </Container>
    </DatePickerWrapper >
  )
}

export default FeedbackPage
