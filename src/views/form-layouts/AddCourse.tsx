import React, { useState, ChangeEvent, ElementType, useEffect } from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button, { ButtonProps } from '@mui/material/Button'
import styled from '@emotion/styled'
import { CardHeader, Typography } from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

interface Topic {
  topic_name: string
  lecture_file: string
  lecture_file_type: string
  lecture_file_name: string
}

interface Module {
  module_name: string
  topics: Topic[]
}

interface CourseData {
  course_name: string
  course_description: string
  modules: Module[]
}

const CourseDetails: React.FC = ({ courseToEdit }: any) => {
  const { customApiCall } = useAuth()
  const [courseData, setCourseData] = useState<CourseData>({
    course_name: '',
    course_description: '',
    modules: []
  })

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

  const handleCourseDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCourseData(prevData => ({ ...prevData, course_description: event.target.value }))
  }

  const handleModuleChange = (index: number, module_name: string) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      updatedModules[index] = { ...updatedModules[index], module_name }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleTopicChange = (moduleIndex: number, topicIndex: number, topic_name: string) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      const updatedTopics = [...updatedModules[moduleIndex].topics]
      updatedTopics[topicIndex] = { ...updatedTopics[topicIndex], topic_name }
      updatedModules[moduleIndex] = { ...updatedModules[moduleIndex], topics: updatedTopics }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleAddModule = () => {
    setCourseData(prevData => ({
      ...prevData,
      modules: [...prevData.modules, { module_name: '', topics: [] }]
    }))
  }

  const handleAddTopic = (moduleIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      if (updatedModules[moduleIndex] && updatedModules[moduleIndex].module_name.trim() !== '') {
        updatedModules[moduleIndex].topics.push({
          topic_name: '',
          lecture_file_name: '',
          lecture_file_type: 'application/pdf',
          lecture_file: ''
        })
      }
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleRemoveModule = (moduleIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      updatedModules.splice(moduleIndex, 1)
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleRemoveTopic = (moduleIndex: number, topicIndex: number) => {
    setCourseData(prevData => {
      const updatedModules = [...prevData.modules]
      updatedModules[moduleIndex].topics.splice(topicIndex, 1)
      return { ...prevData, modules: updatedModules }
    })
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>, moduleIndex: number, topicIndex: number) => {
    const files = event.target.files

    if (files && files.length > 0) {
      const selectedFile = files[0]
      const base64 = await toBase64(selectedFile)
      var splitted = base64 as string
      setCurrentFile(selectedFile)

      setCourseData(prevData => {
        const updatedModules = [...prevData.modules]
        const updatedModule = { ...updatedModules[moduleIndex] }
        const updatedTopics = [...updatedModule.topics]
        updatedTopics[topicIndex] = {
          ...updatedTopics[topicIndex],
          lecture_file_name: selectedFile.name,
          lecture_file: splitted.split(',')[1]
        }

        updatedModule.topics = updatedTopics
        updatedModules[moduleIndex] = updatedModule

        return { ...prevData, modules: updatedModules }
      })
    }
  }

  const handleSubmit = async () => {
    // Log the entire data on submit
    // console.log(courseData)
    await customApiCall('post', 'admin/add-full-course-details', courseData)
      .then(r => {
        console.log(r)
        alert(r)

        setCourseData({ course_name: '', course_description: '', modules: [] })
        setCurrentFile(null)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleCancel = () => {
    // Reset the array to empty on cancel
    setCourseData({ course_name: '', course_description: '', modules: [] })
    setCurrentFile(null)
  }

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  return (
    <Card>
      <CardHeader title='Course Details' titleTypographyProps={{ variant: 'h6' }} />
      <Box p={3}>
        <TextField
          fullWidth
          label='Course Name'
          variant='outlined'
          value={courseData.course_name}
          onChange={handleCourseNameChange}
          margin='normal'
        />
        <TextField
          fullWidth
          label='Course Description'
          variant='outlined'
          multiline
          rows={4}
          value={courseData.course_description}
          onChange={handleCourseDescriptionChange}
          margin='normal'
        />

        {courseData.modules.map((module, moduleIndex) => (
          <Box key={moduleIndex} mt={3}>
            <Box textAlign='center' mb={2}>
              <Typography variant='h4'>Module {moduleIndex + 1}</Typography>
            </Box>
            <TextField
              fullWidth
              label={`Module ${moduleIndex + 1} Name`}
              variant='outlined'
              value={module.module_name}
              onChange={e => handleModuleChange(moduleIndex, e.target.value)}
              margin='normal'
            />

            {module.topics.map((topic, topicIndex) => (
              <Box key={topicIndex} display='flex' alignItems='center' mt={4} ml={15}>
                <TextField
                  fullWidth
                  label={`Topic ${moduleIndex + 1}.${topicIndex + 1} Name`}
                  variant='outlined'
                  value={topic.topic_name}
                  onChange={e => handleTopicChange(moduleIndex, topicIndex, e.target.value)}
                  margin='normal'
                />
                <ButtonStyled
                  component='label'
                  variant='contained'
                  htmlFor={`file-upload-${moduleIndex}-${topicIndex}`}
                  sx={{ marginLeft: 14, marginRight: 3, minWidth: 150 }}
                >
                  Upload File
                  <input
                    hidden
                    type='file'
                    onChange={e => handleFileChange(e, moduleIndex, topicIndex)}
                    accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
                    id={`file-upload-${moduleIndex}-${topicIndex}`}
                  />
                </ButtonStyled>
                <Box sx={{ marginLeft: 2 }}>
                  {topic?.lecture_file_name && `Selected File: ${topic?.lecture_file_name}`}
                </Box>
                <Button
                  type='reset'
                  variant='outlined'
                  color='error'
                  onClick={() => handleRemoveTopic(moduleIndex, topicIndex)}
                >
                  Delete
                </Button>
              </Box>
            ))}

            <ButtonStyled
              variant='contained'
              sx={{ marginTop: 2, marginRight: 3.5 }}
              onClick={() => handleAddTopic(moduleIndex)}
            >
              Add Topic
            </ButtonStyled>
            <Button
              variant='outlined'
              sx={{ marginTop: 2 }}
              color='error'
              onClick={() => handleRemoveModule(moduleIndex)}
            >
              Delete Module
            </Button>
            <Box mt={2} borderBottom={2} borderColor='grey.300' />
          </Box>
        ))}

        <Box mt={2} borderBottom={1} borderColor='grey.300' />

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
