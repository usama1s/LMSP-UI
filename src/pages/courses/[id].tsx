import { SyntheticEvent, useState, useEffect } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// ** Styled Component
import { Grid } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { TabContext, TabList } from '@mui/lab'
import styled from '@emotion/styled'
import MuiTab, { TabProps } from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button } from '@mui/material'
// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Icons Imports
import PlusIcon from 'mdi-material-ui/Plus'
import ViewIcon from 'mdi-material-ui/ViewList'
import ExpandMoreIcon from 'mdi-material-ui/ExpandAll'

// ** Components Imports
import AttendanceComponent from 'src/views/components/StudentAttendance'
import GradesComponent from 'src/views/components/QuizAndAssignmentComponent'
import Certificate from 'src/views/components/Certificate'
import StudentQuizPage from '../student-quiz'
import StudentAssignmentPage from '../submit-assignment'
import CourseMaterial from '../course-material'
import useAuth from 'src/@core/utils/useAuth'

const StudentDashboard = () => {
  const { customApiCall } = useAuth()
  const [courseData, setCourseData] = useState<any>(null)

  // ** State
  const [value, setValue] = useState<string>('CourseInfo')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const getCoursesByUserId = async () => {
    await customApiCall('get', `admin/getCourse/25}`).then(r => {
      setCourseData(r?.course)
    })
  }
  useEffect(() => {
    getCoursesByUserId()
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
  return (
    // <Card>
    //   <TabContext value={value}>
    //     <TabList
    //       onChange={handleChange}
    //       aria-label='account-settings tabs'
    //       sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
    //     >
    //       <Tab
    //         value='Attendance'
    //         label={
    //           <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //             <ViewIcon />
    //             <TabName>Attendance</TabName>
    //           </Box>
    //         }
    //       />
    //       <Tab
    //         value='Grades'
    //         label={
    //           <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //             <PlusIcon />
    //             <TabName>Grades</TabName>
    //           </Box>
    //         }
    //       />

    //       <Tab
    //         value='Quizes'
    //         label={
    //           <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //             <PlusIcon />
    //             <TabName>Quizes</TabName>
    //           </Box>
    //         }
    //       />
    //       <Tab
    //         value='Assignments'
    //         label={
    //           <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //             <PlusIcon />
    //             <TabName>Assignments</TabName>
    //           </Box>
    //         }
    //       />
    //       <Tab
    //         value='CourseMaterial'
    //         label={
    //           <Box sx={{ display: 'flex', alignItems: 'center' }}>
    //             <PlusIcon />
    //             <TabName>Course Material</TabName>
    //           </Box>
    //         }
    //       />
    //     </TabList>

    //     <TabPanel sx={{ p: 0 }} value='Attendance'>
    //       <DatePickerWrapper>
    //         <Grid container spacing={6}>
    //           <Grid item xs={12}>
    //             <AttendanceComponent />
    //           </Grid>
    //         </Grid>
    //       </DatePickerWrapper>
    //     </TabPanel>
    //     <TabPanel sx={{ p: 0 }} value='Grades'>
    //       <GradesComponent />
    //     </TabPanel>
    //     <TabPanel sx={{ p: 0 }} value='Quizes'>
    //       <StudentQuizPage />
    //     </TabPanel>
    //     <TabPanel sx={{ p: 0 }} value='Assignments'>
    //       <StudentAssignmentPage />
    //     </TabPanel>
    //     <TabPanel sx={{ p: 0 }} value='CourseMaterial'>
    //       <CourseMaterial />
    //     </TabPanel>
    //   </TabContext>
    // </Card>
    <Card>
      <TabContext value={value} sx={{ overflowX: 'scroll', whiteSpace: 'nowrap' }}>
        <TabList
          onChange={handleChange}
          aria-label='course-tabs'
          sx={{
            '.MuiTabs-flexContainer css-1pyy021-MuiTabs-flexContainer': {
              overflowX: 'scroll',
              whiteSpace: 'nowrap'
            }
          }}
        >
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
        </TabList>

        <TabPanel sx={{ p: 0 }} value='CourseInfo'>
          {/* Display Course Information */}
          <Typography variant='h5'>{courseData?.course_name}</Typography>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.course_description }} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='Prerequisites'>
          {/* Display Prerequisites */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.prerequisites }} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='LearningOutcomes'>
          {/* Display Learning Outcomes */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.learning_outcomes }} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='ClassroomMaterial'>
          {/* Display Classroom Material */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.classroom_material }} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='ReferenceBooks'>
          {/* Display Reference Books */}
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.reference_books }} />
        </TabPanel>

        <TabPanel sx={{ p: 0 }} value='Modules'>
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

        <TabPanel sx={{ p: 0 }} value='FinalPaper'>
          {/* Display Final Paper */}
          <Typography variant='body1'>Add your content for the Final Paper here.</Typography>
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default StudentDashboard
