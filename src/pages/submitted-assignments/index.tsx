import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField
} from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

interface Course {
  id: number
  name: string
}

interface Student {
  id: number
  name: string
  regId: string
  submittedFile: string
  grade: number | null
}

const SubmittedAssignmentsPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [programs, setPrograms] = useState([])
  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const courseId = event.target.value as number
    setSelectedCourse(courseId)
    const studentsForCourse: Student[] = [
      { id: 1, name: 'Student 1', regId: 'REG001', submittedFile: '...', grade: null },
      { id: 2, name: 'Student 2', regId: 'REG002', submittedFile: '...', grade: null }
    ]

    setStudents(studentsForCourse)
  }

  const handleGradeChange = (studentId: number, grade: number) => {
    setStudents(prevStudents =>
      prevStudents.map(student => (student.id === studentId ? { ...student, grade } : student))
    )
  }

  const handleSubmitGrades = () => {
    console.log('Grades submitted:', students)
  }

  // const getCourses = async () => {
  //   await customApiCall('get', 'admin/get-all-courses').then(r => {
  //     console.log('courses', r)
  //     setCourses(r)
  //   })
  // }

  const getAllProgramPlans = async () => {
    await customApiCall('get', 'admin/get-all-program_plan').then(r => {
      console.log('programs', r)
      setPrograms(r)
    })
  }

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
      setSubjects(r?.subjects)
    })
  }

  useEffect(() => {
    getAllProgramPlans()
    // getCourses()
  }, [])
  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem', height: '100vh', backgroundColor: 'white', padding: 20 }}>
      <Typography variant='h4' gutterBottom>
        Submitted Assignments
      </Typography>
      <Container style={{ flexDirection: 'row', display: 'flex', columnGap: 20 }}>
        <Select value={selectedCourse} onChange={handleCourseChange} style={{ marginBottom: '1rem' }}>
          <MenuItem value={null} disabled>
            Select Subject
          </MenuItem>
          {subjects.map(course => (
            <MenuItem key={course.subject_id} value={course.subject_id}>
              {course.subject_name}
            </MenuItem>
          ))}
        </Select>
        <Select value={selectedCourse} onChange={handleCourseChange} style={{ marginBottom: '1rem' }}>
          <MenuItem value={null} disabled>
            Select Assignment
          </MenuItem>
          {subjects.map(course => (
            <MenuItem key={course.subject_id} value={course.subject_id}>
              {course.subject_name}
            </MenuItem>
          ))}
        </Select>
      </Container>
      {selectedCourse && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Registration ID</TableCell>
              <TableCell>Submitted File</TableCell>
              <TableCell>Grade (%)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map(student => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.regId}</TableCell>
                <TableCell>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => {
                      // Implement your logic to download the submitted file
                      console.log('Download submitted file:', student.submittedFile)
                    }}
                  >
                    Download
                  </Button>
                </TableCell>
                <TableCell>
                  <TextField
                    type='number'
                    value={student.grade || ''}
                    onChange={e => handleGradeChange(student.id, +e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedCourse && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmitGrades}
          disabled={students.some(student => student.grade === null)}
          style={{ marginTop: '1rem' }}
        >
          Submit Grades
        </Button>
      )}
    </Container>
  )
}

export default SubmittedAssignmentsPage
