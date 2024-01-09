import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useAuth from 'src/@core/utils/useAuth'
import EditModal from './EditCourseModal'

const CourseMaterial = () => {
  const { customApiCall } = useAuth()
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [courses, setCourses] = useState([])
  const [editingCourse, setEditingCourse] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const handleAccordionChange = courseId => {
    setExpandedCourse(prevExpanded => (prevExpanded === courseId ? null : courseId))
  }

  const getAllCourses = async () => {
    try {
      const response = await customApiCall('get', 'admin/getCourses')
      setCourses(response?.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const handleEditClick = (event, course) => {
    event.stopPropagation()
    setEditingCourse(course)
    setEditModalOpen(true)
  }

  const handleEditSave = async editedCourse => {
    console.log('Saving edited course:', editedCourse)
    // You can add logic to save the edited course
  }

  useEffect(() => {
    getAllCourses()
  }, [])

  const handleDeleteClick = async (event, courseId) => {
    event.stopPropagation()

    try {
      await customApiCall('delete', `admin/deleteCourse/${courseId}`)
      // Refresh the courses after deletion
      getAllCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
    }
  }
  return (
    <div style={{ background: '#F4F5FA' }}>
      {courses.map(course => (
        <Accordion
          key={course.course_id}
          expanded={expandedCourse === course.course_id}
          onChange={() => handleAccordionChange(course.course_id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${course.course_id}-content`}
            id={`panel-${course.course_id}-header`}
          >
            <Typography variant='h5'>{course.course_name}</Typography>
            <Button variant='contained' sx={{ marginLeft: 10 }} onClick={event => handleEditClick(event, course)}>
              Edit
            </Button>
            <Button
              variant='contained'
              color='error'
              sx={{ marginLeft: 10 }}
              onClick={event => handleDeleteClick(event, course.course_id)}
            >
              Delete
            </Button>
          </AccordionSummary>
          <AccordionDetails>
            <div dangerouslySetInnerHTML={{ __html: course.description }}></div>
            <div dangerouslySetInnerHTML={{ __html: course.prerequisites }}></div>
            <div dangerouslySetInnerHTML={{ __html: course.learning_outcomes }}></div>
            <div dangerouslySetInnerHTML={{ __html: course.classroom_material }}></div>
            <div dangerouslySetInnerHTML={{ __html: course.reference_books }}></div>

            {course.modules.map(module => (
              <Accordion key={module.module_name} style={{ marginTop: 5, marginLeft: 20 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${module.module_name}-content`}
                  id={`panel-${module.module_name}-header`}
                >
                  <Typography variant='h6'>{module.module_name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {module.subjects.map(subject => (
                    <div key={subject.subject_name}>
                      <Typography variant='h6'>{subject.subject_name}</Typography>
                      {subject.teachers.map(teacher => (
                        <Typography key={teacher.instructor_id} variant='body1'>
                          Instructor: {teacher.instructor_name} (Section: {teacher.section})
                        </Typography>
                      ))}
                      {subject.topics.map(topic => (
                        <div key={topic.topic_name}>
                          <Typography style={{ marginTop: '10px' }}>{topic.topic_name}</Typography>
                          <Button
                            variant='contained'
                            onClick={() => window.open(topic.lecture_file, '_blank')}
                            style={{ marginLeft: '10px', marginTop: '10px' }}
                          >
                            Download Lecture File
                          </Button>
                        </div>
                      ))}
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
      {editModalOpen && (
        <EditModal
          selectedCourseToEdit={editingCourse}
          onClose={() => {
            setEditModalOpen(false)
            setEditingCourse(null)
          }}
        />
      )}
    </div>
  )
}

export default CourseMaterial
