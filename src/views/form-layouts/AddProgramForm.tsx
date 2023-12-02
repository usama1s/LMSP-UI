// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState, ElementType, SyntheticEvent, useEffect } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

// ** Third Party Imports
import DatePicker from 'react-datepicker'
import CardWithCollapse from '../cards/CardWithCollapse'
import EditModal from '../components/EditArticleModal'
import useAuth from 'src/@core/utils/useAuth'

interface FormData {
  programName: string
  startDate: Date | null
  endDate: Date | null
}

const AddProgramForm = ({ editedProgram, setEditModalOpen, setAllPrograms }: any) => {
  const { customApiCall } = useAuth()
  // ** States
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [courseData, setCourseData] = useState<Array<{ course_id: number | string; instructor_id: number | string }>>(
    []
  )
  const [formData, setFormData] = useState<FormData>({
    programName: '',
    startDate: null,
    endDate: null
  })
  const [courses, setCourses] = useState([])
  const [instructors, setInstructors] = useState([])

  useEffect(() => {
    // If editedProgram is provided, set the form fields
    if (editedProgram) {
      setFormData({
        programName: editedProgram.program_name,
        startDate: new Date(editedProgram.start_date),
        endDate: new Date(editedProgram.end_date)
      })

      // Set the courseData based on editedProgram's courses
      setCourseData(
        editedProgram.courses.map((course: any) => ({
          course_id: course.course_id,
          instructor_id: course.instructor_id
        }))
      )
    }
  }, [editedProgram])

  const handleSave = async () => {
    if (courseData.length === 0) {
      alert('Error: At least one course must be selected.')
      return
    }

    // Check if each selected course has an instructor
    const missingInstructor = courseData.find(course => !course.instructor_id)

    if (missingInstructor) {
      alert('Please select instructor agains all selected courses')
      return
    }

    const programData = {
      program_name: formData.programName,
      start_date: formData.startDate?.toISOString().slice(0, 19).replace('T', ' '),
      end_date: formData.endDate?.toISOString().slice(0, 19).replace('T', ' '),
      courses: courseData
    }

    await customApiCall('post', 'admin/add-program_plan', programData)
      .then(r => {
        alert(r.message)
        setCourseData([])
        setFormData({
          programName: '',
          startDate: null,
          endDate: null
        })
        setCourseData([])
        setDate(null)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const reset = (e: SyntheticEvent) => {
    e.preventDefault()
    setFormData({
      programName: '',
      startDate: null,
      endDate: null
    })
  }
  const handleCheckboxChange = (course_id: number | string) => {
    const existingCourseIndex = courseData.findIndex(course => course.course_id === course_id)

    if (existingCourseIndex !== -1) {
      setCourseData(prevData => prevData.filter(course => course.course_id !== course_id))
    } else {
      setCourseData(prevData => [...prevData, { course_id, instructor_id: '' }])
    }
  }

  const handleInstructorChange = (instructor_id: number | string, course_id: number | string) => {
    setCourseData(prevData =>
      prevData.map(course => (course.course_id === course_id ? { ...course, instructor_id } : course))
    )
  }

  const getAllCourses = async () => {
    await customApiCall('get', 'admin/get-all-courses').then(r => {
      console.log('courses', r)
      setCourses(r)
    })
  }
  const getAllInstructors = async () => {
    await customApiCall('get', 'admin/get-all-instructors')
      .then(r => {
        setInstructors(r?.instructors)
        //  setCourses(r?.result)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    getAllCourses()
    getAllInstructors()
  }, [])
  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
  })
  return (
    <Card>
      <CardHeader title='Add Program' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <TextField
            fullWidth
            label='Program Name'
            placeholder='Program Name'
            value={formData.programName}
            onChange={e =>
              setFormData({
                ...formData,
                programName: e.target.value
              })
            }
          />

          <Grid item xs={12} sm={6} mt={3}>
            <DatePicker
              selected={formData.startDate}
              showYearDropdown
              showMonthDropdown
              placeholderText='MM-DD-YYYY'
              customInput={<CustomInput label={'Start Date'} />}
              id='form-layouts-separator-date'
              onChange={(date: Date) => {
                setDate(date)
                setFormData({
                  ...formData,
                  startDate: date
                })
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} mt={3}>
            <DatePicker
              selected={formData.endDate}
              showYearDropdown
              showMonthDropdown
              placeholderText='MM-DD-YYYY'
              customInput={<CustomInput label={'End Date'} />}
              id='form-layouts-separator-date'
              onChange={(date: Date) => {
                setDate(date)
                setFormData({
                  ...formData,
                  endDate: date
                })
              }}
            />
          </Grid>
        </CardContent>
        <Grid container spacing={6} justifyContent={'center'} mt={10}>
          {courses &&
            courses.length > 0 &&
            courses.map((item, index) => (
              <Grid item xs={12} sm={6} md={3.5} key={index}>
                <CardWithCollapse
                  onCheckboxChange={() => handleCheckboxChange(index + 1)} // Assuming course_ids start from 1
                  onInstructorChange={(instructor_id: string | number) =>
                    handleInstructorChange(instructor_id, index + 1)
                  }
                  name={item?.course_name}
                  description={item?.course_description}
                  instructors={instructors}
                />
              </Grid>
            ))}
        </Grid>
        <Divider sx={{ marginTop: 10 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSave}>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={reset}>
            Reset
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddProgramForm
