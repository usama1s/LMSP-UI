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
import AllPrograms from 'src/views/components/AllPrograms'

const AddProgram = () => {
  const [value, setValue] = useState<string>('allPrograms')

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
              value='allPrograms'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ViewIcon />
                  <TabName>All Programs</TabName>
                </Box>
              }
            />
            <Tab
              value='addProgram'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PlusIcon />
                  <TabName>Add Program</TabName>
                </Box>
              }
            />
          </TabList>

          <TabPanel sx={{ p: 0 }} value='addProgram'>
            <DatePickerWrapper>
              <Grid container spacing={6}>
                <Grid item xs={12}>
                  <AddProgramForm />
                </Grid>
              </Grid>
            </DatePickerWrapper>
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='allPrograms'>
            <AllPrograms />
          </TabPanel>
        </TabContext>
      </DatePickerWrapper>
    </Card>
  )
}

export default AddProgram
