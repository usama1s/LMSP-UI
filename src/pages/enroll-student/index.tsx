// EnrollStudent.tsx
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

import useAuth from 'src/@core/utils/useAuth'
import { gridColumnDefinitionsSelector } from '@mui/x-data-grid'

const EnrollStudent: React.FC = () => {
  const { customApiCall } = useAuth()
  const [enrollmentDate, setEnrollmentDate] = useState<Date | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [students, setStudents] = useState([])
  const [enrollmentDetails, setenrollmentDetails] = useState({
    enrollment_date: '',
    student_id: '',
    course_id: '',
    enrollment_status: 1
  })

  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setenrollmentDetails({
      ...enrollmentDetails,
      [event.target.name]: event.target.value
    })
  }

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const getAllStudents = async () => {
    await customApiCall('get', 'general/get-all-students').then(r => {
      setStudents(r)
    })
  }

  const getAllProgramPlans = async () => {
    await customApiCall('get', 'admin/get-all-program_plan').then(r => {
      setPrograms(r)
    })
  }

  const getAllCoursesNamesWithIds = async () => {
    await customApiCall('get', 'admin/getAllCoursesNamesWithIds').then(r => {
      setCourses(r?.courses)
    })
  }

  const handleSubmit = async () => {
    console.log(enrollmentDetails)

    if (
      !enrollmentDetails.student_id ||
      !enrollmentDetails.enrollment_date ||
      !enrollmentDetails.enrollment_status ||
      !enrollmentDetails.course_id
    ) {
      alert('Please fill all details')
    } else {
      await customApiCall('post', 'admin/enroll-student', enrollmentDetails)
        .then(r => {
          alert(r?.message)
          setenrollmentDetails({
            enrollment_date: '',
            student_id: '',
            course_id: '',
            enrollment_status: 1
          })
          setEnrollmentDate(null)
        })
        .catch(e => {
          alert(e)
        })
    }
  }
  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
  })

  useEffect(() => {
    getAllCoursesNamesWithIds()

    getAllStudents()
    getAllProgramPlans()
  }, [])
  return (
    <DatePickerWrapper>
      <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
        <Typography variant='h4' gutterBottom>
          Enroll Student
        </Typography>
        <Paper style={{ padding: '2rem', marginTop: '1rem' }}>
          <FormControl fullWidth>
            <InputLabel>Course</InputLabel>
            <Select
              label='Course'
              value={enrollmentDetails.course_id}
              // defaultValue='single'
              onChange={e => setenrollmentDetails({ ...enrollmentDetails, course_id: e.target.value as string })}
            >
              {courses?.map((item, index) => (
                <MenuItem value={item?.course_id}>{item?.course_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth style={{ marginTop: '2rem' }}>
            <InputLabel>Student</InputLabel>
            <Select
              label='Student'
              value={enrollmentDetails.student_id}
              // defaultValue='single'
              onChange={e => setenrollmentDetails({ ...enrollmentDetails, student_id: e.target.value as string })}
            >
              {students?.map((item, index) => (
                <MenuItem value={item?.student_id}>{item?.first_name + ' ' + item?.last_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <InputLabel>Status</InputLabel>
            <Select
              label='Status'
              value={enrollmentDetails.enrollment_status}
              // defaultValue='single'
              onChange={e =>
                setenrollmentDetails({ ...enrollmentDetails, enrollment_status: e.target.value as string })
              }
            >
              <MenuItem value='1'>Active</MenuItem>
              <MenuItem value='0'>InActive</MenuItem>
            </Select>
          </FormControl>

          <DatePicker
            selected={enrollmentDate}
            showYearDropdown
            showMonthDropdown
            placeholderText='MM-DD-YYYY'
            customInput={<CustomInput label={'Enrollment Date'} />}
            id='form-layouts-separator-date'
            onChange={(date: Date) => {
              setEnrollmentDate(date)
              setenrollmentDetails({
                ...enrollmentDetails,
                enrollment_date: date.toISOString().split('T')[0]
              })
            }}
          />

          <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: 15 }}>
            Enroll Student
          </Button>
        </Paper>
      </Container>
    </DatePickerWrapper>
  )
}

export default EnrollStudent
