import React, { useState, useEffect } from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useAuth from 'src/@core/utils/useAuth'

const CourseMaterial = () => {
  const { customApiCall } = useAuth()
  const [expandedCourse, setExpandedCourse] = useState(null)
  const [courses, setCourses] = useState([])

  const handleAccordionChange = courseId => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
  }

  const getAllCourses = async () => {
    await customApiCall('get', 'admin/get-all-courses').then(r => {
      setCourses(r)
    })
  }

  useEffect(() => {
    getAllCourses()
  }, [])
  return (
    <div>
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
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant='h6'>{course.course_description}</Typography>

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
                  {module.topics.map(topic => (
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
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default CourseMaterial
