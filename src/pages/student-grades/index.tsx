import React, { useState, useEffect } from 'react'

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
  Paper,
  Grid
} from '@mui/material'

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
  const getAllCourses = async () => {
    await customApiCall('get', '/admin/getAllCourses')
      .then(r => {
        setCourses(r?.courses)
      })
      .catch(err => {
        console.log(err)
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
                <MenuItem value={student.student_id}>{student.first_name + ' ' + student.last_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Typography variant='h5' gutterBottom mt={10}>
        Average
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ width: '100%' }}>
          <ApexCharts options={areaChartData.options} series={areaChartData.series} type='area' height={300} />
        </div>
      </div>
    </div>
  )
}

export default GradesComponent
