import React, { useState, useEffect, useRef } from 'react'

import useAuth from 'src/@core/utils/useAuth'
import ApexCharts from 'react-apexcharts'
import {
  Button,
  Container,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import htmlToImage, { toJpeg } from 'html-to-image'

type Course = {
  id: string
  name: string
}

type QuizGrade = {
  id: number
  quizName: string
  grade: number
}

type AssignmentGrade = {
  id: number
  assignmentTitle: string
  grade: number
}

const GradesComponent: React.FC = () => {
  const { customApiCall } = useAuth()
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [course, setCourse] = useState('')
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])

  const [student, setStudent] = useState('')
  const [studentQuizes, setStudentQuizes] = useState([])
  const [studentAssignments, setStudentAssignments] = useState([])
  const [studentPapers, setStudentPapers] = useState([])
  const transcriptRef = useRef()
  const [averageMarks, setAverageMarks] = useState<{
    avgAssignmentMarks: string
    avgQuizMarks: string
    avgAttendance: string
  } | null>(null)

  useEffect(() => {
    if (student) {
      getGradesOfStudent(student)
    }
  }, [student])

  const getGradesOfStudent = async (studentId: number) => {
    try {
      await customApiCall('get', `admin/get-stats/${studentId}`).then(r => {
        setAverageMarks(r)
      })
    } catch (err) {
      alert('Some error occurred')
    }
  }

  const getGradesOfStudentBySubject = async (studentId: number, subjectId: number) => {
    try {
      await customApiCall('get', `admin/get-stats/${studentId}/${subjectId}`).then(r => {
        setAverageMarks(r)
      })
    } catch (err) {
      alert('Some error occurred')
    }
  }

  const getStudentsByCourseId = async (courseId: number) => {
    await customApiCall('get', `/instructor/students-by-courseId/${courseId}`)
      .then(r => {
        console.log(r?.students)
        setStudents(r?.students)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getStudentMarksRecord = async (studentId: number) => {
    console.log('occur')
    await customApiCall('get', `/instructor/students-marks-record/${studentId}`)
      .then(r => {
        console.log(r.papers)
        setStudentQuizes(r?.quizes)
        setStudentAssignments(r?.assignments)
        setStudentPapers(r?.papers)
      })
      .catch(err => {
        console.log(err)
      })
  }
  const getAllCourses = async () => {
    await customApiCall('get', '/admin/getAllCourses')
      .then(r => {
        setCourses(r?.courses)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleDownloadTranscript = () => {
    toJpeg(transcriptRef.current, {
      quality: 1,
      style: { background: '#DADADA' }
    }).then(function (dataUrl) {
      var link = document.createElement('a')
      link.download = `${student}.jpg`
      link.href = dataUrl
      link.click()
    })
  }

  useEffect(() => {
    getAllCourses()
  }, [])

  const areaChartData = {
    options: {
      chart: {
        id: 'area-chart',
        type: 'area'
      },
      xaxis: {
        categories: ['Average Assignment Marks', 'Average Quiz Marks', 'Average Attendance']
      }
    },
    series: [
      {
        name: 'Average',
        data: [
          averageMarks?.avgAssignmentMarks ? parseFloat(averageMarks.avgAssignmentMarks) : 0,
          averageMarks?.avgQuizMarks ? parseFloat(averageMarks.avgQuizMarks) : 0
          // averageMarks?.avgAttendance ? parseFloat(averageMarks.avgAttendance) : 0
        ]
      }
    ]
  }
  return (
    <div style={{ margin: 20 }}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel htmlFor='course'>Select Course</InputLabel>
            <Select
              value={course}
              onChange={e => {
                setCourse(e.target.value)
                getStudentsByCourseId(e.target.value)
              }}
              label='Select Course'
            >
              {courses?.map(course => (
                <MenuItem value={course.course_id}>{course.course_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          {/* <TextField fullWidth label='Student Name' value={student} onChange={e => setStudent(e.target.value)} /> */}

          <FormControl fullWidth>
            <InputLabel htmlFor='student'>Select Student</InputLabel>
            <Select value={student} onChange={e => setStudent(e.target.value)} label='Select Student'>
              {students?.map(student => (
                <option value={student.student_id} onClick={() => getStudentMarksRecord(student.student_id)}>
                  {student.first_name + ' ' + student.last_name}
                </option>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {student ? (
        <>
          <Typography variant='h5' gutterBottom mt={10}>
            Average
          </Typography>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ width: '100%' }}>
              <ApexCharts options={areaChartData.options} series={areaChartData.series} type='area' height={300} />
            </div>
          </div>
          <div ref={transcriptRef}>
            <Typography variant='h5' gutterBottom mt={10}>
              <center> Quizes</center>
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Total Marks</TableCell>
                    <TableCell>Obtained Marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentQuizes.map((quiz, i) => (
                    <TableRow key={quiz.quiz_id}>
                      <TableCell>{`Quiz ${i + 1}`}</TableCell>

                      <TableCell>{quiz.total_marks}</TableCell>
                      <TableCell>{quiz.obtained_marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant='h5' gutterBottom mt={10}>
              <center> Assignments</center>
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Total Marks</TableCell>
                    <TableCell>Obtained Marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentAssignments.map((assignment, i) => (
                    <TableRow key={assignment.assignment_id}>
                      <TableCell>{`Assignment ${i + 1}`}</TableCell>
                      <TableCell>{assignment.marks}</TableCell>
                      <TableCell>{assignment.total_marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant='h5' gutterBottom mt={10}>
              <center> Papers</center>
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Total Marks</TableCell>
                    <TableCell>Obtained Marks</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentPapers.map((paper, i) => (
                    <TableRow key={paper.paper_id}>
                      <TableCell>{`Paper ${i + 1}`}</TableCell>
                      <TableCell>{paper.total_marks}</TableCell>
                      <TableCell>{paper.obtained_marks}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* <Typography variant='h5' gutterBottom mt={10}>
       <center> Final Course Marks</center>
      </Typography>
      <TableContainer component={Paper}>
          <Table>
            <TableHead>
         
              <TableRow>
                <TableCell>Total Marks</TableCell>
                <TableCell>Obtained Marks</TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
             
             {studentPapers.map((paper,i)=>  ( <TableRow key={paper.paper_id}>
                  <TableCell>{`Paper ${i+1}`}</TableCell>
                  <TableCell>{paper.total_marks}</TableCell>
                  <TableCell>{paper.obtained_marks}</TableCell>


                </TableRow>))}
              
            </TableBody>
          </Table>
        </TableContainer> */}
          <Grid spacing={2} mt={3} container direction='row' justifyContent='center' alignItems='center'>
            <Button
              variant='contained'
              color='primary'
              style={{ marginTop: '1rem' }}
              onClick={handleDownloadTranscript}
            >
              Download
            </Button>
          </Grid>
        </>
      ) : null}
    </div>
  )
}

export default GradesComponent
