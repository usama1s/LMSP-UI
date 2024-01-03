import React, { useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField
} from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

const StudentList = () => {
  const { customApiCall } = useAuth()
  const [courseFilter, setCourseFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [students, setStudents] = useState([])

  const courses = [...new Set(students.map(student => student.course_name))]
  const handleFilterChange = (event, filterType) => {
    const value = event.target.value
    if (filterType === 'course') {
      setCourseFilter(value)
    } else if (filterType === 'status') {
      setStatusFilter(value)
    }
  }

  const getAllEnrolledStudents = async () => {
    await customApiCall('get', 'admin/get-all-students-with-enrollment')
      .then(r => {
        setStudents(r?.students)
      })
      .catch(err => {
        alert('Some error occured')
      })
  }

  const deleteStudentEnrollment = async (enrollment_id: any) => {
    await customApiCall('post', 'admin/delete-student-enrollment', {
      student_enrollment_id: enrollment_id
    })
      .then(r => {
        getAllEnrolledStudents()
        alert(r?.message)
      })
      .catch(err => {
        alert('Some error occured')
      })
  }

  const updateStudentEnrollmentStatus = async (status, enrollment_id: any) => {
    await customApiCall('put', 'admin/update-student-enrollment-status', {
      status: status,
      student_enrollment_id: enrollment_id
    })
      .then(r => {
        getAllEnrolledStudents()
        alert(r?.message)
      })
      .catch(err => {
        alert('Some error occured')
      })
  }
  const clearFilters = () => {
    setCourseFilter('')
    setStatusFilter('')
  }

  const filteredStudents = students.filter(student => {
    const courseMatch = !courseFilter || student.course_name === courseFilter
    const statusMatch = !statusFilter || student.enrollment_status === (statusFilter === '1' ? '1' : '0')
    return courseMatch && statusMatch
  })

  useEffect(() => {
    getAllEnrolledStudents()
  }, [])
  return (
    <div>
      <TableContainer component={Paper}>
        <Paper style={{ padding: '1rem', marginTop: '1rem', flexDirection: 'row', display: 'flex', columnGap: 10 }}>
          <FormControl size='medium'>
            <InputLabel>Course</InputLabel>
            <Select
              label='Course'
              value={courseFilter}
              // defaultValue='single'
              onChange={e => setCourseFilter(e.target.value)}
            >
              {courses?.map((item, index) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size='medium'>
            <InputLabel id='statusFilterLabel'>Status</InputLabel>
            <Select
              labelId='statusFilterLabel'
              id='statusFilter'
              label='Status'
              value={statusFilter}
              onChange={e => handleFilterChange(e, 'status')}
            >
              <MenuItem value=''>All Status</MenuItem>
              <MenuItem value='active'>Active</MenuItem>
              <MenuItem value='inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
          <Button variant='contained' onClick={clearFilters}>
            Clear Filters
          </Button>
        </Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Enrollment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map(student => (
              <TableRow key={student.student_enrollment_id}>
                <TableCell>{`${student.first_name} ${student.last_name}`}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.course_name}</TableCell>
                <TableCell>{new Date(student.enrollment_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span className={`status-${student.enrollment_status}`}>
                    {student.enrollment_status === '1' ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      updateStudentEnrollmentStatus(
                        student?.enrollment_status == '1' ? '0' : '1',
                        student.student_enrollment_id
                      )
                    }}
                  >
                    Edit Status
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    sx={{ marginLeft: 2 }}
                    onClick={() => {
                      deleteStudentEnrollment(student.student_enrollment_id)
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default StudentList
