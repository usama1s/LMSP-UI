import { SyntheticEvent, useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import { TabContext, TabList } from '@mui/lab'
import styled from '@emotion/styled'
import MuiTab, { TabProps } from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  CardContent,
  Button,
  Paper
} from '@mui/material'
import 'react-datepicker/dist/react-datepicker.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useAuth from 'src/@core/utils/useAuth'
import { useRouter } from 'next/router'
import AttendanceComponent from '../attendance-details'
import GradesComponent from 'src/views/components/QuizAndAssignmentComponent'
import StudentAssignmentPage from '../submit-assignment'

const StudentDashboard = () => {
  const router = useRouter()
  const { id } = router.query
  const { customApiCall } = useAuth()
  const [courseData, setCourseData] = useState<any>(null)
  const [finalPapers, setFinalPapers] = useState<any>([])
  const [modifiedPaper, setModifiedPaper] = useState({})
  const [modifiedQuiz, setModifiedQuiz] = useState({})
  const [assignmentsObj, setAssignmentsObj] = useState([])

  const [attendanceData, setAttendanceData] = useState<any>(null)

  const [user, setUser] = useState(null)

  const [value, setValue] = useState<string>('CourseInfo')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const getCourseDetailByID = async (studentId: number) => {
    console.log('ID: ' + id + ', Student ID: ' + studentId)
    await customApiCall('get', `admin/getCourse/${id}/${studentId}`).then(r => {
      console.log('COURSE DATA', r)
      setCourseData(r?.course)
      setAttendanceData(r?.subjectsWithAttendance)
      setFinalPapers(r?.modifiedPaper.papers)
      setModifiedPaper(r?.modifiedPaper)
      setModifiedQuiz(r?.modifiedQuiz?.quizes)
      setAssignmentsObj(r?.assignmentsObj)
    })
  }

  useEffect(() => {
    var user = localStorage.getItem('user')
    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      setUser(loggedInUser)
      getCourseDetailByID(loggedInUser?.student_id)
    }
  }, [])
  useEffect(() => {}, [])
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

  const transformQuizData = quizData => {
    const quizDetails = {
      subject_id: quizData[0].subject_id,
      instructor_id: quizData[0].instructor_id,
      section: quizData[0].section,
      quiz_date: quizData[0].quiz_date,
      quiz_questions: []
    }

    quizData.forEach(question => {
      const formattedQuestion = {
        question: question.question,
        options: [question.option_1, question.option_2, question.option_3, question.option_4],
        correctOption: question.answer,
        image: question.question_picture || ''
      }

      quizDetails.quiz_questions.push(formattedQuestion)
    })

    return quizDetails
  }

  const transformPaperData = paperData => {
    const paperDetails = {
      subject_id: paperData[0].subject_id,
      instructor_id: paperData[0].instructor_id,
      section: paperData[0].section,
      quiz_date: paperData[0].quiz_date,
      paper_questions: []
    }

    paperData.forEach(question => {
      const formattedQuestion = {
        question: question.question,
        options: [question.option_1, question.option_2, question.option_3, question.option_4],
        correctOption: question.answer,
        image: question.question_picture || ''
      }

      paperDetails.paper_questions.push(formattedQuestion)
    })

    return paperDetails
  }

  const handleStartQuiz = quizId => {
    const quizData = modifiedQuiz[quizId]

    const transformedData = transformQuizData(quizData)
    console.log('Transformed Data', transformedData.quiz_questions)
    localStorage.setItem('quizData', JSON.stringify(transformedData.quiz_questions))
    router.push(`/student-quiz/${quizId}`)
  }

  const handleStartPaper = paperId => {
    const paperData = modifiedPaper.papers[paperId]

    const transformedData = transformPaperData(paperData)
    console.log('Transformed Data', transformedData.paper_questions)
    localStorage.setItem('paperData', JSON.stringify(transformedData.paper_questions))
    router.push(`/student-paper/${paperId}`)
  }

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
          <Typography variant='h5'>{courseData?.course_name}</Typography>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.course_description }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Prerequisites'>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.prerequisites }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='LearningOutcomes'>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.learning_outcomes }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='ClassroomMaterial'>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.classroom_material }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='ReferenceBooks'>
          <Typography variant='body1' dangerouslySetInnerHTML={{ __html: courseData?.reference_books }} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Modules'>
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
          {Object.entries(finalPapers).map(([key, papers]) => (
            <div key={key}>
              {papers.map(paper => (
                <Grid item xs={12} key={paper.subject_id}>
                  <Paper elevation={3} style={{ padding: '16px' }} key={paper.subject_id}>
                    <Typography variant='h4' gutterBottom>
                      {paper.subject_name}
                    </Typography>
                    <Card>
                      <CardContent>
                        <Typography variant='h6'>{paper.title}</Typography>
                        <Button
                          variant='contained'
                          color='primary'
                          onClick={() => {
                            handleStartPaper(paper.id)
                          }}
                        >
                          Start Paper
                        </Button>
                      </CardContent>
                    </Card>
                  </Paper>
                </Grid>
              ))}
            </div>
          ))}
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Quizzes'>
          {Object.entries(modifiedQuiz).map(([quizId, questions]) => (
            <Grid item xs={12} key={quizId}>
              <Paper elevation={3} style={{ padding: '16px' }}>
                <Typography variant='h4' gutterBottom>
                  Subject Name: {questions[0].subject_id}
                </Typography>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>Quiz {quizId}</Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={() => {
                        handleStartQuiz(quizId)
                      }}
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              </Paper>
            </Grid>
          ))}
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Assignments'>
          <StudentAssignmentPage assignmentsData={assignmentsObj} />
        </TabPanel>

        <TabPanel sx={{ p: 10 }} value='Attendance'>
          <AttendanceComponent attendanceDataProp={attendanceData} />
        </TabPanel>
        <TabPanel sx={{ p: 10 }} value='Grades'>
          <GradesComponent />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default StudentDashboard
