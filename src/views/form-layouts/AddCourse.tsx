import React, { useState, ChangeEvent, ElementType, useEffect, useRef, useMemo } from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button, { ButtonProps } from '@mui/material/Button'
import styled from '@emotion/styled'
import { CardHeader, Typography } from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'
import { FormControl, InputLabel, Select, MenuItem, ListItemText } from '@mui/material'
import dynamic from 'next/dynamic'
import JoditEditor from 'jodit-react'
import 'react-quill/dist/quill.snow.css'

const sectionsList = ['A', 'B', 'C', 'D', 'E', 'F']
interface Subject {
  subject_name: string
  topics: Topic[]
  teachers: { teacherID: number; section: string }[]
}

interface Module {
  module_name: string
  subjects: Subject[]
}

interface Topic {
  topic_name: string
  lecture_file: string
  lecture_file_type: string
  lecture_file_name: string
}

interface CourseData {
  course_name: string
  course_description: string
  outline_file: string
  prerequisites: string
  learning_outcomes: string
  classroom_material: string
  reference_books: string
  modules: Module[]
}

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    matchVisual: false
  }
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
]

var courseDescription = null
const CourseDetails: React.FC = ({ courseToEdit }: any) => {
  const editorRef = useRef(null)
  const { customApiCall } = useAuth()
  const [courseData, setCourseData] = useState<CourseData>({
    course_name: '',
    course_description: '',
    outline_file: '',
    prerequisites: '',
    learning_outcomes: '',
    classroom_material: '',
    reference_books: '',
    modules: []
  })
  const [instructors, setInstructors] = useState([])
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  useEffect(() => {
    if (courseToEdit) {
      setCourseData(courseToEdit)
    }
  }, [])

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const handleCourseNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseData(prevData => ({ ...prevData, course_name: event.target.value }))
  }

  //handle module change
  const handleModuleChange = (moduleIndex: number, module_name: string) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], module_name }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleSubjectChange = (moduleIndex: number, subjectIndex: number, subject_name: string) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]
      updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], subject_name }
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], subjects: updatedSubjects }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleTeacherChange = (
    moduleIndex: number,
    subjectIndex: number,
    subject_name: string,
    selectedTeachers: string[]
  ) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]
      var teachers: { teacherID: number; section: string }[] = []
      selectedTeachers.map((teacher: any) => {
        teachers.push({ teacherID: teacher, section: '' })
      })
      updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], subject_name, teachers: teachers }
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], subjects: updatedSubjects }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleSectionChange = (moduleIndex: number, subjectIndex: number, teacherId: number, section: string) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]

      const teacherSectionToChange = updatedSubjects[subjectIndex].teachers.findIndex(
        teacher => teacher.teacherID == teacherId
      )

      const updatedTeacherSection = {
        ...updatedSubjects[subjectIndex].teachers[teacherSectionToChange],
        section: section
      }
      const newArr = [...updatedSubjects]
      newArr[subjectIndex].teachers[teacherSectionToChange] = updatedTeacherSection
      return { ...prevData, modules: updatedModules }
    })
  }
  const handleTopicChange = (moduleIndex: number, subjectIndex: number, topicIndex: number, topic_name: string) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]
      const updatedTopics = [...updatedSubjects[subjectIndex].topics]
      updatedTopics[topicIndex] = { ...updatedTopics[topicIndex], topic_name }
      updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], topics: updatedTopics }
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], subjects: updatedSubjects }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleAddModule = () => {
    setCourseData(prevData => ({
      ...prevData,
      modules: [
        ...prevData.modules,
        {
          module_name: '',
          subjects: [
            {
              subject_name: '',
              teachers: [],
              topics: [
                {
                  topic_name: '',
                  lecture_file_name: '',
                  lecture_file_type: 'application/pdf',
                  lecture_file: ''
                }
              ]
            }
          ]
        }
      ]
    }))
  }

  const handleAddSubject = (moduleIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      updatedModules[moduleIndex].subjects.push({
        subject_name: '',
        teachers: [],
        topics: [
          {
            topic_name: '',
            lecture_file_name: '',
            lecture_file_type: 'application/pdf',
            lecture_file: ''
          }
        ]
      })
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleAddTopic = (moduleIndex: number, subjectIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]
      updatedSubjects[subjectIndex].topics.push({
        topic_name: '',
        lecture_file_name: '',
        lecture_file_type: 'application/pdf',
        lecture_file: ''
      })
      updatedModules[moduleIndex].subjects = updatedSubjects
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleDeleteModule = (moduleIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      updatedModules.splice(moduleIndex, 1)
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleDeleteSubject = (moduleIndex: number, subjectIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]
      updatedSubjects.splice(subjectIndex, 1)
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], subjects: updatedSubjects }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleDeleteTopic = (moduleIndex: number, subjectIndex: number, topicIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedSubjects = [...updatedModules[moduleIndex].subjects]
      const updatedTopics = [...updatedSubjects[subjectIndex].topics]
      updatedTopics.splice(topicIndex, 1)
      updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], topics: updatedTopics }
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], subjects: updatedSubjects }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleFileChange = async (moduleIndex: number, subjectIndex: number, topicIndex: number, file: File) => {
    try {
      const lectureFileName = file.name // Get the full file name
      const extensionIndex = lectureFileName.lastIndexOf('.')
      const shortFileName = extensionIndex !== -1 ? lectureFileName.substring(0, extensionIndex) : lectureFileName

      const lectureFileType = file.type // Get the file type
      const lectureFileBase64 = await toBase64(file)

      setCourseData(prevData => {
        const updatedModules = [...prevData.modules]
        const updatedSubjects = [...updatedModules[moduleIndex].subjects]
        const updatedTopics = [...updatedSubjects[subjectIndex].topics]

        updatedTopics[topicIndex] = {
          ...updatedTopics[topicIndex],
          lecture_file_name: shortFileName,
          lecture_file_type: lectureFileType,
          lecture_file: lectureFileBase64
        }

        updatedSubjects[subjectIndex] = { ...updatedSubjects[subjectIndex], topics: updatedTopics }
        updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], subjects: updatedSubjects }

        return { ...prevData, modules: updatedModules }
      })
    } catch (error) {
      console.error('Error reading file:', error)
    }
  }

  const readFileAsBase64 = file => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        resolve(reader.result)
      }
    })
  }

  const handleSubmit = async () => {
    await customApiCall('post', 'admin/addCourse', courseData)
      .then(r => {
        if (r?.error) {
          alert(r?.error)
          return
        }
        alert(r?.message)

        setCourseData({
          course_name: '',
          course_description: '',
          outline_file: '',
          prerequisites: '',
          learning_outcomes: '',
          classroom_material: '',
          reference_books: '',
          modules: []
        })
        setCurrentFile(null)
      })
      .catch(err => {
        alert(err?.message)
        console.log(err)
      })
  }

  const getTeacherName = (teacherId: number): string => {
    const teacher = instructors.find(t => t.id === teacherId)
    return teacher ? teacher.first_name + ' ' + teacher.last_name : ''
  }
  const handleCancel = () => {
    setCourseData({
      course_name: '',
      course_description: '',
      outline_file: '',
      prerequisites: '',
      learning_outcomes: '',
      classroom_material: '',
      reference_books: '',
      modules: []
    })
    setCurrentFile(null)
  }

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      textAlign: 'center',
      marginTop: theme.spacing(4)
    }
  }))

  const DeleteButton = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    marginLeft: theme.spacing(2)
  }))

  const JoditNoSSRWrapper = dynamic(() => import('jodit-react'), {
    ssr: false,
    loading: () => <p>Loading ...</p>
  })

  const onChangeFile = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    console.log(files)
    if (files && files.length !== 0) {
      setCurrentFile(files[0])
      reader.onload = () =>
        setCourseData(prev => {
          return { ...prev, outline_file: files[0] }
        })

      reader.readAsDataURL(files[0])
    }
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
    getAllInstructors()
  }, [])

  return (
    <Card>
      <CardHeader title='Course Details' titleTypographyProps={{ variant: 'h6' }} />

      <Box p={3}>
        <Box mt={5}>
          <Typography variant='body2' sx={{ fontWeight: 600 }}>
            {currentFile?.name}
          </Typography>
          <ButtonStyled component='label' variant='contained' htmlFor='article-inventory-upload-file'>
            Upload Course File
            <input
              hidden
              type='file'
              onChange={onChangeFile}
              accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
              id='article-inventory-upload-file'
            />
          </ButtonStyled>
          <ResetButtonStyled color='error' variant='outlined' onClick={() => setCurrentFile(null)}>
            Reset
          </ResetButtonStyled>
        </Box>
        <TextField
          fullWidth
          label='Course Name'
          variant='outlined'
          value={courseData.course_name}
          onChange={handleCourseNameChange}
          margin='normal'
        />

        <JoditNoSSRWrapper
          ref={editorRef.current}
          config={{
            readonly: false
          }}
          value={courseData.course_description}
          onBlur={e => {
            setCourseData({ ...courseData, course_description: e })
          }}
        />

        <JoditNoSSRWrapper
          ref={editorRef.current}
          value={courseData.prerequisites}
          onBlur={e => {
            setCourseData({ ...courseData, prerequisites: e })
          }}
        />

        <JoditNoSSRWrapper
          ref={editorRef.current}
          value={courseData.learning_outcomes}
          onBlur={e => {
            setCourseData({ ...courseData, learning_outcomes: e })
          }}
        />

        <JoditNoSSRWrapper
          ref={editorRef.current}
          value={courseData.classroom_material}
          onBlur={e => {
            setCourseData({ ...courseData, classroom_material: e })
          }}
        />

        {/* <QuillNoSSRWrapper
          theme='snow'
          modules={modules}
          formats={formats}
          placeholder='Reference Books'
          onChange={e => {
            setCourseData({ ...courseData, reference_books: e })
          }}
          value={courseData.reference_books}
          style={{ marginTop: 15 }}
        /> */}

        <JoditNoSSRWrapper
          ref={editorRef.current}
          value={courseData.reference_books}
          onBlur={e => {
            setCourseData({ ...courseData, reference_books: e })
          }}
        />

        {courseData.modules.map((module, moduleIndex) => (
          <Box key={moduleIndex} mt={3}>
            <Box textAlign='center' mb={2}>
              <Typography variant='h4'>Module {moduleIndex + 1}</Typography>
            </Box>
            <DeleteButton variant='contained' color='error' onClick={() => handleDeleteModule(moduleIndex)}>
              Delete Module
            </DeleteButton>
            <TextField
              fullWidth
              label={`Module ${moduleIndex + 1} Name`}
              variant='outlined'
              value={module.module_name}
              onChange={e => handleModuleChange(moduleIndex, e.target.value)}
              margin='normal'
            />

            {module.subjects.map((subject, subjectIndex) => (
              <Box key={subjectIndex} mt={3}>
                <Box textAlign='center' mb={2}>
                  <Typography variant='h5'>Subject {subjectIndex + 1}</Typography>
                </Box>
                <DeleteButton
                  variant='contained'
                  color='error'
                  onClick={() => handleDeleteSubject(moduleIndex, subjectIndex)}
                >
                  Delete Subject
                </DeleteButton>
                <TextField
                  fullWidth
                  label={`Subject ${subjectIndex + 1} Name`}
                  variant='outlined'
                  value={subject.subject_name}
                  onChange={e => handleSubjectChange(moduleIndex, subjectIndex, e.target.value)}
                  margin='normal'
                />

                <FormControl fullWidth variant='outlined' margin='normal'>
                  <InputLabel id={`teachers-dropdown-${moduleIndex}-${subjectIndex}`}>Teachers</InputLabel>
                  <Select
                    labelId={`teachers-dropdown-${moduleIndex}-${subjectIndex}`}
                    id={`teachers-dropdown-${moduleIndex}-${subjectIndex}`}
                    multiple
                    value={subject.teachers.map(teacher => teacher.teacherID) || []}
                    onChange={e => {
                      const selectedTeachers = e.target.value as number[]
                      handleTeacherChange(moduleIndex, subjectIndex, subject.subject_name, selectedTeachers)
                    }}
                    label='Teachers'
                    renderValue={selected =>
                      (selected as number[])
                        .map(
                          teacherId =>
                            instructors.find(teacher => teacher?.instructor_id === teacherId)?.first_name +
                              ' ' +
                              instructors.find(teacher => teacher?.instructor_id === teacherId)?.last_name || ''
                        )
                        .join(', ')
                    }
                  >
                    {instructors.map(teacher => (
                      <MenuItem key={teacher?.instructor_id} value={teacher?.instructor_id}>
                        <ListItemText primary={teacher?.first_name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {subject.teachers.map(teacher => (
                  <Box style={{ display: 'flex', marginTop: 20 }}>
                    {console.log(teacher)}

                    <Typography ml={10} variant='h6'>
                      {getTeacherName(teacher.teacherID)}
                    </Typography>
                    <FormControl fullWidth sx={{ marginLeft: 1 }}>
                      <InputLabel>Section</InputLabel>
                      <Select
                        label='Section'
                        value={teacher.section}
                        defaultValue={sectionsList[0]}
                        onChange={e => {
                          handleSectionChange(moduleIndex, subjectIndex, teacher.teacherID, e.target.value as string)
                        }}
                      >
                        {sectionsList?.map((item, index) => (
                          <MenuItem value={item}>{item}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ))}
                {subject.topics.map((topic, topicIndex) => (
                  <Box key={topicIndex} display='flex' alignItems='center' mt={4} ml={30}>
                    <TextField
                      fullWidth
                      label={`Topic ${moduleIndex + 1}.${subjectIndex + 1}.${topicIndex + 1} Name`}
                      variant='outlined'
                      value={topic.topic_name}
                      onChange={e => handleTopicChange(moduleIndex, subjectIndex, topicIndex, e.target.value)}
                      margin='normal'
                      style={{ width: '55%', marginRight: 20 }}
                    />
                    <ButtonStyled component='label' variant='contained' htmlFor='article-inventory-upload-file'>
                      Upload File
                      <input
                        hidden
                        type='file'
                        onChange={e =>
                          handleFileChange(moduleIndex, subjectIndex, topicIndex, e.target.files?.[0] || null)
                        }
                        accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
                      />
                    </ButtonStyled>

                    {topic.lecture_file_name && (
                      <Typography variant='body2' color='textSecondary' ml={2}>
                        {topic.lecture_file_name.substring(0, 10)}
                      </Typography>
                    )}
                    <DeleteButton
                      variant='contained'
                      color='error'
                      onClick={() => handleDeleteTopic(moduleIndex, subjectIndex, topicIndex)}
                    >
                      Delete Topic
                    </DeleteButton>
                  </Box>
                ))}

                <ButtonStyled
                  variant='contained'
                  sx={{ marginTop: 2, marginRight: 3.5 }}
                  onClick={() => handleAddTopic(moduleIndex, subjectIndex)}
                >
                  Add Topic
                </ButtonStyled>
              </Box>
            ))}

            <ButtonStyled
              variant='contained'
              sx={{ marginTop: 2, marginRight: 3.5 }}
              onClick={() => handleAddSubject(moduleIndex)}
            >
              Add Subject
            </ButtonStyled>
            {moduleIndex < courseData.modules.length - 1 && (
              <Box mb={10} mt={15}>
                <hr style={{ border: '1px dashed grey', width: '100%' }} />
              </Box>
            )}
          </Box>
        ))}

        <Box mb={10} mt={15}>
          <hr style={{ border: '1px dashed grey', width: '100%' }} />
        </Box>

        <Box display='flex' justifyContent='space-between' mt={3}>
          <Button variant='contained' color='primary' onClick={handleAddModule}>
            Add Module
          </Button>
          <Box>
            <Button variant='outlined' color='error' onClick={handleCancel}>
              Reset
            </Button>
            <Button variant='contained' color='primary' onClick={handleSubmit} sx={{ marginLeft: 2 }}>
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

export default CourseDetails
