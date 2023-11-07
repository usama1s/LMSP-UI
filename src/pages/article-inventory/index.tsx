import { SyntheticEvent, useState } from 'react'
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// ** Styled Component
import { Grid } from '@mui/material'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import ArticleInventoryForm from 'src/views/form-layouts/ArticelnventoryForm'
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
import ArticleInventoryTable from 'src/views/tables/ArticleInventoryTable'

const ArticleInventory = () => {
  // ** State
  const [value, setValue] = useState<string>('addArticle')

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
            value='addArticle'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlusIcon />
                <TabName>Add Article</TabName>
              </Box>
            }
          />
          <Tab
            value='allArticles'
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ViewIcon />
                <TabName>All Articles</TabName>
              </Box>
            }
          />
        </TabList>

        <TabPanel sx={{ p: 0 }} value='addArticle'>
          <DatePickerWrapper>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                <ArticleInventoryForm />
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </TabPanel>
        <TabPanel sx={{ p: 0 }} value='allArticles'>
          <ArticleInventoryTable />
        </TabPanel>
      </TabContext>
    </Card>
  )
}

export default ArticleInventory
