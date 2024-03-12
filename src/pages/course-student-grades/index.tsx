import { useEffect, useState } from 'react'
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
import useAuth from 'src/@core/utils/useAuth'
import TableStickyHeader from 'src/views/tables/TableStickyHeader'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CourseGradeTable from 'src/views/tables/courseGradeTable'


const CourseGrades: React.FC = () => {
    const { customApiCall } = useAuth()
    const [course, setCourse] = useState('')
    const [courses, setCourses] = useState([])
    const[students,setStudents]=useState([])
    const getAllCourses = async () => {
        await customApiCall('get', '/admin/getAllCourses')
          .then(r => {
            setCourses(r?.courses)
          })
          .catch(err => {
            console.log(err)
          })
      }

      // const getStudentsByCourseId = async (courseId: number) => {
      //   await customApiCall('get', `/instructor/students-by-courseId/${courseId}`)
      //     .then(r => {
      //       console.log(r?.students)
      //       setStudents(r?.students)
      //     })
      //     .catch(err => {
      //       console.log(err)
      //     })
      // }

      const getStudentsByCourseId = async (courseId: number) => {
        await customApiCall('get', `/instructor/students-marks-by-course-id/${courseId}`)
          .then(r => {
            console.log(r)
            setStudents(r)
          })
          .catch(err => {
            console.log(err)
          })
      }

      useEffect(() => {
        getAllCourses()
      }, [])

      console.log(students)
    return(
    <Grid container spacing={3}>
        <Grid item xs={12}>
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
                <MenuItem value={course?.course_id}>{course?.course_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <br/>
       {course? <Grid item xs={20}>
        <Card>
          <CardHeader title='Courses' titleTypographyProps={{ variant: 'h6' }} />
          <CourseGradeTable students={students} />
        </Card>
      </Grid>:null}
        </Grid>
    )
}

export default CourseGrades