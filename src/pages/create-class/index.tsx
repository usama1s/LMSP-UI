// CreateClass.tsx
import React, { useState, forwardRef, ElementType, ChangeEvent, useEffect } from 'react'
import {
  Container,
  Typography,
  TextField,
  Button,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Paper,
  ButtonProps,
  TextFieldProps,
  Box,
  Grid
} from '@mui/material'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

import 'react-datepicker/dist/react-datepicker.css'
import { styled } from '@mui/material/styles'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'

import useAuth from 'src/@core/utils/useAuth'

const CreateClass: React.FC = () => {
  const { customApiCall } = useAuth()
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [classDetails, setclassDetails] = useState({
    classeLink: '',
    subject_id: '',
    classDate: '',
    classTime: ''
  })

  const [programs, setPrograms] = useState([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setclassDetails({
      ...classDetails,
      [event.target.name]: event.target.value
    })
  }

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setPdfFile(file)
    setclassDetails({
      ...classDetails,
      pdfFile: await toBase64(file)
    })
  }

  const getAllProgramPlans = async () => {
    await customApiCall('get', 'admin/get-all-program_plan').then(r => {
      setPrograms(r)
    })
  }

  const handleSubmit = async () => {
    console.log(classDetails)

    if (!classDetails.classDate || !classDetails.classTime || !classDetails.classeLink || !classDetails.subject_id) {
      alert('Please fill all details')
    } else {
      const assignmentData = {
        subject_id: classDetails.subject_id,
        classDate: classDetails.classDate,
        classTime: classDetails.classTime.toString(),
        classeLink: classDetails.classeLink
      }
      console.log(classDetails)
      await customApiCall('post', 'instructor/schedule-class', assignmentData)
        .then(r => {
          if (r?.error) {
            alert(r?.error)
          } else {
            alert(r?.response)
          }
          setclassDetails({
            classeLink: '',
            subject_id: '',
            classDate: '',
            classTime: ''
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
  })

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
      console.log('subjects', r)
      setSubjects(r?.subjects)
    }).catch((err)=>console.log(err))
  }

  useEffect(() => {
    getAllProgramPlans()
  }, [])
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePickerWrapper>
        <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
          <Typography variant='h4' gutterBottom>
            Schedule Class
          </Typography>
          <Paper style={{ padding: '2rem', marginTop: '1rem' }}>
            <FormControl fullWidth>
              <InputLabel>Select Subject</InputLabel>
              <Select
                label='Select Subject'
                value={classDetails.subject_id}
                // defaultValue='single'
                onChange={e => setclassDetails({ ...classDetails, subject_id: e.target.value as string })}
              >
                {subjects?.map((item, index) => (
                  <MenuItem value={item?.subject_id}>{item?.subject_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label='Class Link'
              fullWidth
              variant='outlined'
              name='classeLink'
              value={classDetails.classeLink}
              onChange={handleInputChange}
              style={{ marginBottom: '1rem', marginTop: '1rem' }}
            />

            <DatePicker
              selected={dueDate}
              showYearDropdown
              showMonthDropdown
              placeholderText='MM-DD-YYYY'
              customInput={<CustomInput label={'Class Date'} />}
              id='form-layouts-separator-date'
              onChange={(date: Date) => {
                setDueDate(date)
                setclassDetails({
                  ...classDetails,
                  classDate: date.getDate() + '/' + (parseInt(date.getMonth()) + 1) + '/' + date.getFullYear()
                })
              }}
            />
            <Box style={{ marginTop: '1rem', width: '100%' }}>
              <TimePicker
                label='Class Time'
                className='classTime'
                value={classDetails.classTime}
                onChange={(time: any) => {
                  setclassDetails({
                    ...classDetails,
                    classTime: time
                  })
                }}
                renderInput={params => <CustomInput label={'Class Time'} {...params} />}
              />
            </Box>

            <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: 15 }}>
              Schedule Class
            </Button>
          </Paper>
        </Container>
      </DatePickerWrapper>
    </LocalizationProvider>
  )
}

export default CreateClass
