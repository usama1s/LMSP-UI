import React, { useState, useEffect, ElementType, forwardRef } from 'react'
import {
  Container,
  Typography,
  Paper,
  Button,
  ButtonProps,
  TextField,
  TextFieldProps,
  Select,
  FormControl,
  InputLabel,
  MenuItem
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { styled } from '@mui/system'
import useAuth from 'src/@core/utils/useAuth'

type Student = {
  student_id: number | string
  name: string
  attendence_status: boolean | number
}

const mockData: Student[] = Array.from({ length: 20 }, (_, index) => ({
  student_id: index + 1,
  name: `Student ${index + 1}`,
  attendence_status: false,
  id: index + 1
}))

const AttendancePage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [attendanceData, setAttendanceData] = useState<Student[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
  const [programs, setPrograms] = useState([])
  const [attendanceDetails, setAttendanceDetails] = useState({
    students: [],
    attendence_date: null as Date | null
  })

  const [selectedProgram, setSelectedProgram] = useState('')

  const fetchDataForDate = (date: Date) => {
    setAttendanceData(mockData)
  }

  const markAttendance = (studentId: number) => {
    const updatedData = attendanceData.map(student =>
      student.student_id === studentId ? { ...student, attendence_status: !student.attendence_status } : student
    )

    setAttendanceData(updatedData)
  }

  const getAllProgramPlans = async () => {
    await customApiCall('get', 'admin/get-all-program_plan').then(r => {
      setPrograms(r?.result)
    })
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Student Name', width: 200 },
    {
      field: 'attendence_status',
      headerName: 'Attendance',
      width: 150,
      type: 'actions',
      renderCell: params => (
        <ButtonStyled
          component='label'
          onClick={() => markAttendance(params.row.student_id)}
          variant={params.value ? 'contained' : 'outlined'}
          sx={{ marginLeft: '1rem' }}
        >
          {params.value ? 'Present' : 'Absent'}
        </ButtonStyled>
      )
    }
  ]

  const ButtonStyled = styled(Button, { shouldForwardProp: prop => prop !== 'theme' })<
    ButtonProps & { component?: ElementType; htmlFor?: string }
  >(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))
  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
  })

  const handleSubmit = async () => {
    if (!selectedDate || !attendanceData) {
      alert('Date not selected or students not fetched')
    } else {
      const students = [...attendanceData]
      students.map((item, index) => {
        if (item?.attendence_status == true) {
          item.attendence_status = 1
        } else {
          item.attendence_status = 0
        }
      })
      console.log(students)
      const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : null
      const dataToSend = {
        attendence_date: formattedDate,
        students: students
      }

      await customApiCall('post', 'instructor/mark-attendence', dataToSend).then(r => {
        alert(r)
      })
    }
  }
  useEffect(() => {
    fetchDataForDate(new Date())
    getAllProgramPlans()
  }, [])

  return (
    <DatePickerWrapper>
      <Container style={{ marginTop: '2rem' }}>
        <Typography variant='h4' gutterBottom>
          Mark Attendance
        </Typography>
        <Paper style={{ padding: '2rem', marginTop: '1rem' }}>
          <div style={{ marginBottom: '1rem', flexDirection: 'row', width: '100%' }}>
            <DatePicker
              selected={selectedDate}
              showYearDropdown
              showMonthDropdown
              showTimeInput
              placeholderText='MM-DD-YYYY'
              id='form-layouts-separator-date'
              onChange={date => setSelectedDate(date)}
              customInput={<CustomInput label={'Date'} />}
            />
            <FormControl fullWidth style={{ marginTop: '1rem' }}>
              <InputLabel>Program Plan</InputLabel>
              <Select
                label='Program Plan'
                value={selectedProgram}
                // defaultValue='single'
                onChange={e => setSelectedProgram(e.target.value as string)}
              >
                {programs &&
                  programs?.map((item, index) => (
                    <MenuItem value={item?.program_plan_id}>{item?.program_name}</MenuItem>
                  ))}
              </Select>
            </FormControl>
            <ButtonStyled component='label' variant='contained' sx={{ marginTop: '1rem' }}>
              Fetch Students Data
            </ButtonStyled>
          </div>

          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={attendanceData}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              // checkboxSelection
              disableSelectionOnClick={true}
              disableVirtualization
            />
          </div>
          <Button variant='contained' color='primary' style={{ marginTop: 15 }} onClick={handleSubmit}>
            Submit Attendance
          </Button>
        </Paper>
      </Container>
    </DatePickerWrapper>
  )
}

export default AttendancePage
