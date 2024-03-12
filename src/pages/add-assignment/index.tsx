// TeacherAssignmentPage.tsx
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

const TeacherAssignmentPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [assignmentDetails, setAssignmentDetails] = useState({
    title: '',
    dueDate: '',
    pdfFile: null as string | null,
    instructions: '',
    total_marks:'',
    program_plan_id: ''
  })

  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])

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
    }).catch(err => {
      console.log(err)
    })
  }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAssignmentDetails({
      ...assignmentDetails,
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
    const fileToSend = await toBase64(file)
    console.log(fileToSend)
    setPdfFile(file)
    setAssignmentDetails({
      ...assignmentDetails,
      pdfFile: fileToSend
    })
  }
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

  const handleSubmit = async () => {
    if (
      !assignmentDetails.dueDate ||
      !assignmentDetails.pdfFile ||
      !assignmentDetails.title ||
      !assignmentDetails.instructions ||
      !assignmentDetails.program_plan_id
    ) {
      alert('Please fill all details')
    } else {
      const selectedSubject = subjects.find(subject => subject.subject_id === assignmentDetails.program_plan_id)

      const assignmentData = {
        subject_id: assignmentDetails.program_plan_id,
        assignment_date: assignmentDetails.dueDate,
        assignment_file: assignmentDetails.pdfFile,
        assignment_instruction: assignmentDetails.instructions,
        assignment_total_marks:assignmentDetails.total_marks,
        assignment_title: assignmentDetails.title,
        instructor_id: user?.instructor_id
      }
      await customApiCall('post', '/instructor/add-assignment', assignmentData).then(r => {
        alert(r)
        setAssignmentDetails({
          title: '',
          dueDate: '',
          pdfFile: null as string | null,
          instructions: '',
          total_marks:'',
          program_plan_id: ''
        })
        setPdfFile(null)
      })
      console.log(assignmentDetails)
    }
  }
  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
  })

  return (
    <DatePickerWrapper>
      <Container maxWidth='lg' style={{ marginTop: '2rem' }}>
        <Typography variant='h4' gutterBottom>
          Create Assignment
        </Typography>
        <Paper style={{ padding: '2rem', marginTop: '1rem' }}>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              label='Program Plan'
              value={assignmentDetails.program_plan_id}
              // defaultValue='single'
              onChange={e => setAssignmentDetails({ ...assignmentDetails, program_plan_id: e.target.value as string })}
            >
              {subjects?.map((item, index) => (
                <MenuItem value={item?.subject_id}>{item?.subject_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label='Assignment Title'
            fullWidth
            variant='outlined'
            name='title'
            value={assignmentDetails.title}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem', marginTop: '1rem' }}
          />

          <TextField
            label='Instructions'
            fullWidth
            variant='outlined'
            name='instructions'
            value={assignmentDetails.instructions}
            onChange={handleInputChange}
            multiline
            style={{ marginBottom: '1rem' }}
          />
                    <TextField
            label='Total Marks'
            fullWidth
            variant='outlined'
            name='total_marks'
            value={assignmentDetails.total_marks}
            onChange={handleInputChange}
            multiline
            style={{ marginBottom: '1rem' }}
            required
          />

          <DatePicker
            selected={dueDate}
            showYearDropdown
            showMonthDropdown
            showTimeInput
            placeholderText='MM-DD-YYYY'
            customInput={<CustomInput label={'Due Date'} />}
            id='form-layouts-separator-date'
            onChange={(date: Date) => {
              setDueDate(date)
              setAssignmentDetails({
                ...assignmentDetails,
                dueDate: date.toISOString().split('T')[0]
              })
            }}
          />
          <Box key={'pdffile'} display='flex' alignItems='center' mt={4}>
            <ButtonStyled
              component='label'
              variant='contained'
              htmlFor={`file-upload`}
              sx={{ marginRight: 3, minWidth: 150 }}
            >
              Upload File
              <input
                hidden
                type='file'
                onChange={handleFileChange}
                accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
                id={`file-upload`}
              />
            </ButtonStyled>
            <Box sx={{ marginLeft: 2 }}>Selected File : {pdfFile?.name}</Box>
          </Box>

          <Button variant='contained' color='primary' onClick={handleSubmit} style={{ marginTop: 15 }}>
            Create Assignment
          </Button>
        </Paper>
      </Container>
    </DatePickerWrapper>
  )
}

export default TeacherAssignmentPage
