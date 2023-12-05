import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import useAuth from 'src/@core/utils/useAuth'
import { useRouter } from 'next/router'

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'CID', headerName: 'CID', width: 70 },
  { field: 'courseName', headerName: 'Course Name', width: 200 },
  { field: 'instructorName', headerName: 'Instructor Name', width: 200 }
]

const Courses: React.FC = () => {
  const router = useRouter()
  const { customApiCall } = useAuth()

  const [user, setUser] = useState(null)
  const [courseData, setCourseData] = useState<[]>([])
  const [selectedProgram, setSelectedProgram] = useState<string>('')
  const [filterOption, setFilterOption] = useState<string>('currentMonth')

  const handleProgramChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedProgram(event.target.value as string)
  }

  const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setFilterOption(event.target.value as string)
  }

  const getCoursesByUserId = async () => {
    await customApiCall('get', `student/get-course/${13}`).then(r => {
      const updatedCourses = r.map((course: any, index) => ({
        ...r,
        id: index,
        CID: course?.course_id,
        courseName: course?.course_name,
        instructorName: course?.first_name + ' ' + course?.last_name
      }))
      console.log(updatedCourses)
      setCourseData(updatedCourses)
    })
  }
  useEffect(() => {
    var user = localStorage.getItem('user')

    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      setUser(loggedInUser)
    }
    getCoursesByUserId()
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