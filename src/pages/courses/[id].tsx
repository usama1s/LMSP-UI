import { SyntheticEvent, useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import { TabContext, TabList } from '@mui/lab'
import styled from '@emotion/styled'
import MuiTab, { TabProps } from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useAuth from 'src/@core/utils/useAuth'
import { useRouter } from 'next/router'

const StudentDashboard = () => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [courseData, setCourseData] = useState<any>(null)

  // ** State
  const [value, setValue] = useState<string>('CourseInfo')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const getCourseDetailByID = async () => {
    await customApiCall('get', `admin/getCourse/${id}`).then(r => {
      setCourseData(r?.course)
    })
  }
  useEffect(() => {
    getCourseDetailByID()
  }, [])
  const Tab = styled(MuiTab)<TabProps>(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
      minWidth: 100
    },
    [theme.breakpoints.down('sm')]: {
      minWidth: 67
    }
  }))

  const TabName = styled('span')(({ theme }) => ({
    lineHeight: 1.71,
    fontSize: '0.875rem',
    marginLeft: theme.spacing(2.4),
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  }))

  const TabListWrapper = styled(TabList)({})
  return (
    <Card>
      <TabContext value={value}>
        <TabListWrapper onChange={handleChange} aria-label='course-tabs' variant='scrollable'>
          <Tab value='CourseInfo' label='Course Information' />
          <Tab value='Prerequisites' label='Prerequisites' />
          <Tab value='LearningOutcomes' label='Learning Outcomes' />
          <Tab value='ClassroomMaterial' label='Classroom Material' />
          <Tab value='ReferenceBooks' label='Reference Books' />
          <Tab value='Modules' label='Modules' />
          <Tab value='FinalPaper' label='Final Paper' />
          <Tab value='Attendance' label='Attendance' />
          <Tab value='Grades' label='Grades' />
          <Tab value='Quizzes' label='Quizzes' />
          <Tab value='Assignments' label='Assignments' />
        </TabListWrapper>

        <TabPanel sx={{ p: 10 }} value='CourseInfo'>
          {/* Display Course Information */}
          <Typography variant='h5'>{courseData?.course_name}</Typography>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.course_description }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Prerequisites'>
          {/* Display Prerequisites */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.prerequisites }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='LearningOutcomes'>
          {/* Display Learning Outcomes */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.learning_outcomes }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='ClassroomMaterial'>
          {/* Display Classroom Material */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.classroom_material }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='ReferenceBooks'>
          {/* Display Reference Books */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.reference_books }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Modules'>
          {/* Display Modules */}
          {courseData?.modules.map((module: any) => (
            <Accordion key={module.module_id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`module-${module.module_id}-content`}
                id={`module-${module.module_id}-header`}
              >
                <Typography>{module.module_name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {/* Display Subjects for the Module */}
                {module.subjects.map((subject: any) => (
                  <Accordion key={subject.subject_id}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`subject-${subject.subject_id}-content`}
                      id={`subject-${subject.subject_id}-header`}
                    >
                      <Typography>{subject.subject_name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {/* Display Topics for the Subject */}
                      {subject.topics.map((topic: any) => (
                        <Typography key={topic.topic_id}>{topic.topic_name}</Typography>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='FinalPaper'>
          {/* Display Final Paper */}
          <Typography variant='body1'>Add your content for the Final Paper here.</Typography>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default StudentDashboard
