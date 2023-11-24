import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import useAuth from 'src/@core/utils/useAuth'
import { useRouter } from 'next/router'

type CourseData = {
  id: number
  CID: number
  courseName: string
  instructorName: string
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'CID', headerName: 'CID', width: 70 },
  { field: 'courseName', headerName: 'Course Name', width: 200 },
  { field: 'instructorName', headerName: 'Instructor Name', width: 200 }
]

const Courses: React.FC = () => {
  const router = useRouter()
  const [courseData, setCourseData] = useState<CourseData[]>([
    { id: 1, CID: 101, courseName: 'Mathematics', instructorName: 'John Doe' },
    { id: 2, CID: 102, courseName: 'Physics', instructorName: 'Jane Smith' },
    { id: 3, CID: 103, courseName: 'History', instructorName: 'Bob Johnson' }
  ])
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [filterOption, setFilterOption] = useState<string>('currentMonth')

  const handleProgramChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProgram(event.target.value as string)
  }

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterOption(event.target.value as string)
  }

  useEffect(() => {
    // Dummy data, you can replace this with your API call
    const dummyData: CourseData[] = [
      { id: 1, CID: 101, courseName: 'Mathematics', instructorName: 'John Doe' },
      { id: 2, CID: 102, courseName: 'Physics', instructorName: 'Jane Smith' },
      { id: 3, CID: 103, courseName: 'History', instructorName: 'Bob Johnson' }
    ]

    setCourseData(dummyData)
  }, [selectedProgram, filterOption])

  return (
    <Card>
      <div style={{ margin: 20 }}>
        {/* Add any additional UI elements such as filters if needed */}
        <div>
          <Typography variant='h6'>Courses</Typography>
        </div>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={courseData}
            columns={columns}
            pageSize={5}
            disableRowSelectionOnClick
            onRowClick={({ row }) => {
              router.push(`/courses/${row.CID}`)
            }}
          />
        </div>
      </div>
    </Card>
  )
}

export default Courses
