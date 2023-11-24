import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import Chart from 'react-apexcharts' // Import Chart from react-apexcharts (apexcharts-clevision)
import useAuth from 'src/@core/utils/useAuth'

type AttendanceData = {
  id: number
  date: string
  day: string
  status: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'date', headerName: 'Date', width: 120 },
  { field: 'day', headerName: 'Day', width: 120 },
  { field: 'status', headerName: 'Status', width: 120 }
]

const dummyAttendanceData: AttendanceData[] = [
  { id: 1, date: '2023-11-01', day: 'Monday', status: 'Present' },
  { id: 2, date: '2023-11-05', day: 'Friday', status: 'Absent' },
  { id: 3, date: '2023-11-10', day: 'Wednesday', status: 'Present' }
  // Add more dummy data as needed
]

const AttendanceComponent: React.FC = () => {
  const { customApiCall } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [courses, setCourses] = useState([])
  const [filterOption, setFilterOption] = useState<string>('currentMonth')
  const [attendanceData, setAttendanceData] = useState<{ absents: number; presents: number }>({
    absents: 40,
    presents: 80
  })
  const [programs, setPrograms] = useState([])

  const handleProgramChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProgram(event.target.value as string)
  }
  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourse(event.target.value as string)
  }

  const getCourses = async () => {
    await customApiCall('get', 'admin/get-all-courses').then(r => {
      console.log('courses', r)
      setCourses(r)
    })
  }
  const getAllProgramPlans = async () => {
    await customApiCall('get', 'admin/get-all-program_plan').then(r => {
      setPrograms(r)
    })
  }

  const getAttendanceData = async () => {
    const response = await customApiCall('get', 'attendance/get-student-attendance', {
      courseId: selectedProgram,
      filterOption
    })

    // Update attendanceData with the actual data from the API response
    setAttendanceData({
      absents: 20,
      presents: 80
    })
  }

  useEffect(() => {
    getCourses()
    getAllProgramPlans()
  }, [selectedProgram, filterOption])

  useEffect(() => {
    // Fetch attendance data when the selected program or filter option changes
    if (selectedProgram) {
      //   getAttendanceData()
    }
  }, [selectedProgram, filterOption])

  return (
    <div style={{ margin: 20, height: '100%', backgroundColor: 'white', padding: 20 }}>
      <FormControl fullWidth style={{ marginBottom: '1rem' }}>
        <InputLabel>Program</InputLabel>
        <Select label='Program' value={selectedProgram} onChange={handleProgramChange}>
          {programs.map((item, index) => (
            <MenuItem value={item?.program_id} key={index}>
              {item?.program_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth style={{ marginBottom: '1rem' }}>
        <InputLabel>Courses</InputLabel>
        <Select label='Courses' value={selectedCourse} onChange={handleCourseChange}>
          {courses.map((item, index) => (
            <MenuItem value={item?.course_id} key={index}>
              {item?.course_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display total absents and presents */}
      <Typography variant='h6'>Total Absents: {attendanceData.absents}</Typography>
      <Typography variant='h6'>Total Presents: {attendanceData.presents}</Typography>

      {/* Display Pie Chart */}
      <Box style={{ marginTop: 20 }} />
      <Chart
        options={{
          labels: ['Absents', 'Presents'],
          colors: ['#FF0000', '#00FF00']
        }}
        series={[attendanceData.absents, attendanceData.presents]}
        type='donut'
        width={'380'}
      />

      <Box style={{ height: 40 }} />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid rows={dummyAttendanceData} columns={columns} pageSize={5} disableSelectionOnClick />
      </div>
    </div>
  )
}

export default AttendanceComponent
