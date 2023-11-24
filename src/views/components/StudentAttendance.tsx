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
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [filterOption, setFilterOption] = useState<string>('currentMonth')
  const [attendanceData, setAttendanceData] = useState<{ absents: number; presents: number }>({
    absents: 40,
    presents: 80
  })

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
    // Fetch attendance data when the selected program or filter option changes
    if (selectedProgram) {
      //   getAttendanceData()
    }
  }, [selectedProgram, filterOption])

  return (
    <div style={{ margin: 20, height: '100%', backgroundColor: 'white', padding: 20 }}>
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
