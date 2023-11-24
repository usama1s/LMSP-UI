import { SyntheticEvent, useState } from 'react'
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

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'

// ** Icons Imports
import PlusIcon from 'mdi-material-ui/Plus'
import ViewIcon from 'mdi-material-ui/ViewList'

// ** Components Imports
import AttendanceComponent from 'src/views/components/StudentAttendance'
import GradesComponent from 'src/views/components/QuizAndAssignmentComponent'
import Certificate from 'src/views/components/Certificate'
import StudentQuizPage from '../student-quiz'
import StudentAssignmentPage from '../submit-assignment'
import CourseMaterial from '../course-material'
const StudentDashboard = () => {
  // ** State
  const [value, setValue] = useState<string>('Attendance')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
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
    <Card>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          aria-label='account-settings tabs'
          sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Tab
            value='Attendance'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewIcon />
                <TabName>Attendance</TabName>
              </Box>
            }
          />
          <Tab
            value='Grades'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlusIcon />
                <TabName>Grades</TabName>
              </Box>
            }
          />

          <Tab
            value='Quizes'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlusIcon />
                <TabName>Quizes</TabName>
              </Box>
            }
          />
          <Tab
            value='Assignments'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlusIcon />
                <TabName>Assignments</TabName>
              </Box>
            }
          />
          <Tab
            value='CourseMaterial'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlusIcon />
                <TabName>Course Material</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='Attendance'>
          <DatePickerWrapper>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <AttendanceComponent />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='Grades'>
          <GradesComponent />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='Quizes'>
          <StudentQuizPage />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='Assignments'>
          <StudentAssignmentPage />
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='CourseMaterial'>
          <CourseMaterial />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default StudentDashboard

AttendanceComponent.tsx
