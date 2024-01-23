import React, { useState, useEffect } from 'react'
import { FormControl, InputLabel, MenuItem, Select, Typography, Box } from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'
import ApexCharts from 'react-apexcharts'

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
  const [averageMarks, setAverageMarks] = useState<{
    avgAssignmentMarks: string
    avgQuizMarks: string
    avgAttendance: string
  } | null>(null)

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const courseId = event.target.value as string
    const selectedCourse = courses.find(course => course.id === courseId) || null
    setSelectedCourse(selectedCourse)
  }

  useEffect(() => {
    const user = localStorage.getItem('user')

    if (user && user !== undefined) {
      const loggedInUser = JSON.parse(user)

      getGradesOfStudent(loggedInUser?.student_id)
    }
  }, [])

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

  const courses: Course[] = [
    { id: 'course1', name: 'Course 1' },
    { id: 'course2', name: 'Course 2' }
    // Add more courses as needed
  ]

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
      {/* <FormControl fullWidth style={{ marginBottom: '1rem' }}>
        <InputLabel>Subjects</InputLabel>
        <Select label='Course' value={selectedCourse?.id || ''} onChange={handleCourseChange}>
          {courses.map(course => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      {/* Display charts */}
      <Typography variant='h5' gutterBottom>
        Average Marks
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {/* <div style={{ width: '45%' }}>
          <ApexCharts
            options={quizChartData.options}
            series={quizChartData.series}
            type='bar'
            height={300}
            width={300} // Add width to make sure the chart is visible
          />
        </div> */}
        <div style={{ width: '100%' }}>
          <ApexCharts options={areaChartData.options} series={areaChartData.series} type='area' height={300} />
        </div>
      </div>
    </div>
  )
}

export default GradesComponent
