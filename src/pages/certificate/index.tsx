import React, { useState, useRef, useEffect } from 'react'
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
import html2canvas from 'html2canvas'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import useAuth from 'src/@core/utils/useAuth'
const theme = createTheme()

const CertificateGenerator = () => {
  const { customApiCall } = useAuth()
  const certificateRef = useRef(null)
  const [course, setCourse] = useState('')
  const [courses, setCourses] = useState([])
  const [students, setStudents] = useState([])

  const [student, setStudent] = useState('')
  const [title, setTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showPreview, setShowPreview] = useState(false)
  const [user, setUser] = useState(null)
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

  const handlePreview = () => {
    if (course === '' || student === '' || title === '') {
      alert('Please fill all the fields')
      return
    }
    setShowPreview(!showPreview)
  }

  const handleDownloadCertificate = () => {
    if (certificateRef.current) {
      html2canvas(certificateRef.current).then(canvas => {
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'certificate.png'
        link.click()
      })
    }
  }
  const handleGenerateCertificate = async () => {
    if (!course || !student || !title) {
      alert('Fill all details')
    } else {
      await customApiCall('post', 'admin/generateCertificate', {
        course_id: course,
        student_id: student,
        title: title,
        date: selectedDate.toDateString(),
        issued_by: user?.admin_id
      }).then(r => {
        alert(r?.message)
        setCourse('')
        setTitle('')
        setStudent('')
        setShowPreview(false)
      })
    }
  }

  function CertificatePreview({ name, course, date, title }) {
    return (
      <div className='generator'>
        <Icon />
        <p className='byline'>{title}</p>

        <div className='content'>
          <p>Awarded to</p>
          <h1>{name}</h1>
          <p>for completing:</p>
          <h2>{course}</h2>
        </div>

        <p className='issuedBy'>
          Issued by{' '}
          <span className='bold'>
            {user?.first_name ? user?.first_name : '' + ' ' + user?.last_name ? user?.last_name : ''}
          </span>
        </p>
        {date && (
          <p className='date'>
            Issued on <span className='bold'>{date}</span>
          </p>
        )}
      </div>
    )
  }

  const Icon = () => (
    <svg
      width='99'
      height='139'
      viewBox='0 0 99 139'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='certificateSvg'
    >
      <path d='M0 0H99V138.406L52.1955 118.324L0 138.406V0Z' fill='white' />
      <path
        d='M25.4912 83.2515C25.4912 79.4116 27.0222 75.7289 29.7474 73.0137C32.4727 70.2985 36.1689 68.7731 40.0229 68.7731C43.877 68.7731 47.5732 70.2985 50.2984 73.0137C53.0236 75.7289 54.5546 79.4116 54.5546 83.2515M40.0229 59.724C40.0229 55.8841 41.5539 52.2014 44.2791 49.4862C47.0044 46.7709 50.7006 45.2455 54.5546 45.2455C58.4087 45.2455 62.1049 46.7709 64.8301 49.4862C67.5553 52.2014 69.0863 55.8841 69.0863 59.724V83.2515'
        stroke='#0379FF'
        strokeWidth='10.6193'
      />
    </svg>
  )

  useEffect(() => {
    var user = localStorage.getItem('user')
    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      console.log('HI USER', loggedInUser)
      setUser(loggedInUser)
    }
  }, [])
  useEffect(() => {
    getAllCourses()
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Paper elevation={3} style={{ padding: 20, marginTop: 20 }}>
          <Typography variant='h4' gutterBottom>
            Certificate Generator
          </Typography>
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
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Title of the Certificate'
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Select Date'
                type='date'
                value={selectedDate.toISOString().split('T')[0]}
                onChange={e => setSelectedDate(new Date(e.target.value))}
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button variant='contained' color='primary' onClick={handlePreview}>
                Preview Certificate
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' color='primary' onClick={handleGenerateCertificate}>
                Generate Certificate
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button variant='contained' color='primary' onClick={handleDownloadCertificate}>
                Download Certificate
              </Button>
            </Grid>
          </Grid>
        </Paper>
        {showPreview && (
          <div ref={certificateRef}>
            <CertificatePreview
              title={title}
              name={
                students?.find(s => s.student_id === student)?.first_name +
                ' ' +
                students?.find(s => s.student_id === student)?.last_name
              }
              course={courses.find(c => c.course_id === course)?.course_name}
              date={selectedDate.toDateString()}
            />
          </div>
        )}
      </Container>
    </ThemeProvider>
  )
}

export default CertificateGenerator
