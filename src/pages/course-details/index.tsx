import { Grid } from '@mui/material'
import CardWithCollapse from 'src/views/cards/CardWithCollapse'
import AddProgramForm from 'src/views/form-layouts/AddProgramForm'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { TabContext, TabList } from '@mui/lab'
import 'react-datepicker/dist/react-datepicker.css'
import { SyntheticEvent, useState } from 'react'
import styled from '@emotion/styled'
import MuiTab, { TabProps } from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

import PlusIcon from 'mdi-material-ui/Plus'
import ViewIcon from 'mdi-material-ui/ViewList'
import TabPanel from '@mui/lab/TabPanel'
import CourseDetails from 'src/views/form-layouts/AddCourse'
import CourseMaterial from 'src/views/components/AllCourses'

const AllCourses = () => {
  const [value, setValue] = useState<string>('allCourses')

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
      <DatePickerWrapper>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='allCourses'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ViewIcon />
                  <TabName>All Courses</TabName>
                </Box>
              }
            />
            <Tab
              value='addCourses'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlusIcon />
                  <TabName>Add Course</TabName>
                </Box>
              }
            />
          </TabList>

          <TabPanel sx={{ p: 0 }} value='addCourses'>
            <DatePickerWrapper>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <CourseDetails />
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='allCourses'>
            <CourseMaterial />
          </TabPanel>
        </TabContext>
      </DatePickerWrapper>
    </Card>
  )
}

export default AllCourses
