import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { FormControl, InputLabel, MenuItem, Select, Typography, LinearProgress, Box } from '@mui/material'

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

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 120 },
  { field: 'grade', headerName: 'Grade', width: 120 },
  {
    field: 'progress',
    headerName: 'Progress',
    width: 200,
    renderCell: params => (
      <LinearProgress
        variant='determinate'
        value={params.value as number}
        color={getColorForGrade(params.value as number)}
        sx={{ height: 10, width: 100, borderRadius: 5 }}
      />
    )
  }
]

const getColorForGrade = (grade: number): 'primary' | 'secondary' | 'error' => {
  // Adjust the grade ranges and colors as needed
  if (grade >= 90) {
    return 'primary' // Green color for high grades
  } else if (grade >= 70) {
    return 'secondary' // Yellow color for moderate grades
  } else {
    return 'error' // Red color for low grades
  }
}

const GradesComponent: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [quizGrades, setQuizGrades] = useState<QuizGrade[]>([])
  const [assignmentGrades, setAssignmentGrades] = useState<AssignmentGrade[]>([])

  const handleCourseChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const courseId = event.target.value as string
    const selectedCourse = courses.find(course => course.id === courseId) || null
    setSelectedCourse(selectedCourse)
  }

  useEffect(() => {
    const dummyQuizGrades: QuizGrade[] = [
      { id: 1, quizName: 'Quiz 1', grade: 90 },
      { id: 2, quizName: 'Quiz 2', grade: 60 }
    ]

    const dummyAssignmentGrades: AssignmentGrade[] = [
      { id: 1, assignmentTitle: 'Assignment 1', grade: 70 },
      { id: 2, assignmentTitle: 'Assignment 2', grade: 30 }
    ]

    setQuizGrades(dummyQuizGrades)
    setAssignmentGrades(dummyAssignmentGrades)
  }, [selectedCourse])

  const courses: Course[] = [
    { id: 'course1', name: 'Course 1' },
    { id: 'course2', name: 'Course 2' }
    // Add more courses as needed
  ]

  return (
    <div style={{ margin: 20 }}>
      <FormControl fullWidth style={{ marginBottom: '1rem' }}>
        <InputLabel>Course</InputLabel>
        <Select label='Course' value={selectedCourse?.id || ''} onChange={handleCourseChange}>
          {courses.map(course => (
            <MenuItem key={course.id} value={course.id}>
              {course.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Display quiz grades with heading */}
      <Typography variant='h5' gutterBottom>
        Quizes
      </Typography>
      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          rows={quizGrades.map(grade => ({ ...grade, name: grade.quizName, progress: grade.grade }))}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
      <Box style={{ height: 20 }} />
      {/* Display assignment grades with heading */}
      <Typography variant='h5' gutterBottom>
        Assignments
      </Typography>
      <div style={{ height: 200, width: '100%' }}>
        <DataGrid
          rows={assignmentGrades.map(grade => ({ ...grade, name: grade.assignmentTitle, progress: grade.grade }))}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
        />
      </div>
    </div>
  )
}

export default GradesComponent
