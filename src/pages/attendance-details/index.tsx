import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import Chart from 'react-apexcharts'
import useAuth from 'src/@core/utils/useAuth'

type AttendanceData = {
  student_attendence_id: number
  student_id: number
  attendence_status: number
  attendence_date: string
  subject_id: number
  subject_name?: string
}

const columns: GridColDef[] = [
  { field: 'attendence_date', headerName: 'Date', width: 120 },
  {
    field: 'day',
    headerName: 'Day',
    width: 120,
    valueGetter: params => {
      const date = new Date(params.row.attendence_date)
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      return days[date.getDay()]
    }
  },
  {
    field: 'attendence_status',
    headerName: 'Status',
    width: 120,
    valueGetter: params => {
      console.log('Params', params)
      return params.value
    }
  }
]

type AttendanceComponentProps = {
  attendanceDataProp: AttendanceData[]
}

const AttendanceComponent: React.FC<AttendanceComponentProps> = ({ attendanceDataProp }) => {
  const { customApiCall } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<number | string>('')
  const [courses, setCourses] = useState<AttendanceData[]>([])
  const [attendanceData, setAttendanceData] = useState<{ absents: number; presents: number }>({
    absents: 0,
    presents: 0
  })

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCourse(event.target.value as number | string)
  }

  const getCourses = async () => {
    try {
      const response = await customApiCall('get', 'admin/get-all-courses')
      setCourses(response)
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  useEffect(() => {
    getCourses()
  }, [])

  useEffect(() => {
    // Filter the attendance data based on the selected subject
    const filteredData = selectedCourse
      ? attendanceDataProp.filter(data => data.subject_id === selectedCourse)
      : attendanceDataProp

    setAttendanceData({
      absents: filteredData.filter(data => data.attendence_status === 0).length,
      presents: filteredData.filter(data => data.attendence_status === 1).length
    })
  }, [attendanceDataProp, selectedCourse])

  const getUniqueSubjects = (data: AttendanceData[]) => {
    const uniqueSubjects: AttendanceData[] = []
    const subjectIdsSet = new Set<number>()

    data.forEach(item => {
      if (!subjectIdsSet.has(item.subject_id)) {
        subjectIdsSet.add(item.subject_id)
        uniqueSubjects.push(item)
      }
    })

    return uniqueSubjects
  }

  return (
    <div style={{ margin: 20, height: '100%', backgroundColor: 'white', padding: 20 }}>
      <FormControl fullWidth style={{ marginBottom: '1rem' }}>
        <InputLabel>Subjects</InputLabel>
        <Select label='Subjects' value={selectedCourse} onChange={handleCourseChange}>
          {getUniqueSubjects(attendanceDataProp).map(item => (
            <MenuItem key={item.subject_id} value={item.subject_id}>
              {item.subject_name}
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
        <DataGrid
          rows={
            selectedCourse
              ? attendanceDataProp
                  .filter(data => data.subject_id === selectedCourse)
                  .map(data => ({ ...data, attendence_status: data.attendence_status == 1 ? 'Present' : 'Absent' }))
              : []
          }
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          getRowId={row => row.student_attendence_id}
        />
      </div>
    </div>
  )
}

export default AttendanceComponent
