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
  TextField,
  InputLabel,
  FormControl
} from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'
import { getFile } from 'src/@core/utils/general'

interface Subject {
  subject_id: number
  subject_name: string
}

interface Assignment {
  assignment_id: number
  assignment_title: string
}

interface SubmittedAssignment {
  student_id: number
  student_name: string
  regId: string
  submitted_file: string
  grade: string
  date: string
  marks: number
  assignment_id: number
}

const SubmittedAssignmentsPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [assignments, setAssignments] = useState<any>(null)
  const [submittedAssignments, setSubmittedAssignments] = useState<SubmittedAssignment[]>([])

  const handleSubjectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const subjectId = event.target.value as number
    setSelectedSubject(subjectId)
    setSelectedAssignment(null) // Reset assignment when subject changes
    setAssignments([]) // Clear assignments array
    setSubmittedAssignments([]) // Clear submitted assignments array
  }

  const handleFetchAssignments = () => {
    customApiCall('get', `instructor/get-submitted-assignments/${user?.instructor_id}/${selectedSubject}`).then(r => {
      console.log('Submitted Assignments', r)
      setAssignments(r?.allSubmittedAssignments?.assignments)
    }).catch((err)=>{console.log(err)
    alert("Something Unexpected Happened")
    })
  }

  const handleAssignmentChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const assignmentId = event.target.value as number
    setSelectedAssignment(assignmentId)
    assignments?.forEach(assignment => {
      if (assignment.assignment_id === assignmentId) {
        setSubmittedAssignments(assignment.submitted_by)
      }
    })
  }

  const handleGradeChange = (studentId: number, grade: string) => {
    setSubmittedAssignments(prevAssignments =>
      prevAssignments.map(student => (student.student_id === studentId ? { ...student, grade } : student))
    )
  }

  const handleMarksChange = (studentId: number, marks: number) => {
    setSubmittedAssignments(prevAssignments =>
      prevAssignments.map(student => (student.student_id === studentId ? { ...student, marks } : student))
    )
  }

  const handleSubmitGrades = async () => {
    try {
      var cloned = [...submittedAssignments]
      cloned.forEach(student => {
        student.assignment_id = selectedAssignment
      })
      console.log('Grades submitted:', cloned)
      await customApiCall('post', 'instructor/mark-assignment', { assignments: cloned }).then(r => {
        alert(r?.message)
      })
    } catch (err) {
      alert('Some error occured')
    }
    // Implement your logic to submit grades to the server
  }
  const [user, setUser] = useState(null)

  useEffect(() => {
    var user = localStorage.getItem('user')
    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      getAllsubjects(loggedInUser?.instructor_id)
      setUser(loggedInUser)
    }
  }, [])

  const getAllsubjects = async (instructorId: any) => {
    await customApiCall('get', `instructor/${instructorId}/subjects`).then(r => {
      setSubjects(r?.subjects || [])
    })
  }

  const handleDownload = async path => {
    const base = await getFile(path)
    const indexOf4 = base.indexOf('4')

    var secondPart
    if (indexOf4 !== -1) {
      const firstPart = base.substring(0, indexOf4 + 1)
      secondPart = base.substring(indexOf4 + 1)

      console.log('First part:', firstPart)
      console.log('Second part:', secondPart)
    }
    if (base) {
      const a = document.createElement('a')
      a.href = `data:application/pdf;base64,${secondPart}`
      a.download = 'assignment.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem', height: '100vh', backgroundColor: 'white', padding: 20 }}>
      <Typography variant='h4' gutterBottom>
        Submitted Assignments
      </Typography>
      <Container style={{ flexDirection: 'row', display: 'flex', columnGap: 20 }}>
        <FormControl fullWidth>
          <InputLabel>Select Subject</InputLabel>
          <Select
            value={selectedSubject}
            onChange={handleSubjectChange}
            style={{ marginBottom: '1rem' }}
            label='Select Subject'
          >
            <MenuItem disabled>Select Subject</MenuItem>
            {subjects.map(subject => (
              <MenuItem key={subject.subject_id} value={subject.subject_id}>
                {subject.subject_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          onClick={handleFetchAssignments}
          disabled={!selectedSubject}
          style={{ marginBottom: '1rem' }}
        >
          Fetch Assignments
        </Button>
      </Container>
      <FormControl sx={{ width: 300, ml: 3 }}>
        <InputLabel>Select Assignment</InputLabel>
        <Select value={selectedAssignment} onChange={handleAssignmentChange} style={{ marginBottom: '1rem' }}>
          <MenuItem disabled>Select Assignment</MenuItem>
          {assignments?.map(assignment => (
            <MenuItem key={assignment.assignment_id} value={assignment.assignment_id}>
              {console.log('Ass', assignment)}

              {assignment.assignment_title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedAssignment && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student Name</TableCell>
              <TableCell>Registration ID</TableCell>
              <TableCell>Submitted File</TableCell>
              <TableCell>Marks</TableCell>

              <TableCell>Grade</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submittedAssignments.map(student => (
              <TableRow key={student.student_id}>
                <TableCell>{student.student_name}</TableCell>
                <TableCell>{student.regId}</TableCell>
                <TableCell>
                  <Button
                    variant='outlined'
                    color='primary'
                    onClick={() => {
                      // Implement your logic to download the submitted file
                      console.log('Download submitted file:', student.submitted_file)
                      // handleDownload(student.submitted_file)
                    }}
                  >
                    Download
                  </Button>
                </TableCell>
                <TableCell>
                  <TextField
                    value={student.marks || ''}
                    type='number'
                    onChange={e => handleMarksChange(student.student_id, parseInt(e.target.value))}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={student.grade || ''}
                    type='text'
                    onChange={e => handleGradeChange(student.student_id, e.target.value)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedAssignment && (
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmitGrades}
          disabled={submittedAssignments.some(student => !student.grade)}
          style={{ marginTop: '1rem' }}
        >
          Submit Grades
        </Button>
      )}
    </Container>
  )
}

export default SubmittedAssignmentsPage
