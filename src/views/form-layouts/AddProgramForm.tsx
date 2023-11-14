// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState, ElementType, SyntheticEvent } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import useAuth from 'src/@core/utils/useAuth'
// ** Third Party Imports
import DatePicker from 'react-datepicker'
import CardWithCollapse from '../cards/CardWithCollapse'
import 'react-datepicker/dist/react-datepicker.css'

interface FormData {
  programName: string
  startDate: Date | null
  endDate: Date | null
}

const CustomInput = forwardRef((props: TextFieldProps, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
})

const AddProgramForm = () => {
  const { customApiCall } = useAuth()
  // ** States
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [formData, setFormData] = useState<FormData>({
    programName: '',
    startDate: null,
    endDate: null
  })
  const handleSave = async () => {}

  const reset = (e: SyntheticEvent) => {
    e.preventDefault()
    setFormData({
      programName: '',
      startDate: null,
      endDate: null
    })
  }
  return (
    <Card>
      <CardHeader title='Add Program' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <TextField
            fullWidth
            label='Program Name'
            placeholder='Program Name'
            value={formData.programName}
            onChange={e =>
              setFormData({
                ...formData,
                programName: e.target.value
              })
            }
          />

          <Grid item xs={12} sm={6} mt={3}>
            <DatePicker
              selected={formData.startDate}
              showYearDropdown
              showMonthDropdown
              placeholderText='MM-DD-YYYY'
              customInput={<CustomInput label={'Start Date'} />}
              id='form-layouts-separator-date'
              onChange={(date: Date) => {
                setDate(date)
                setFormData({
                  ...formData,
                  startDate: date
                })
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} mt={3}>
            <DatePicker
              selected={formData.endDate}
              showYearDropdown
              showMonthDropdown
              placeholderText='MM-DD-YYYY'
              customInput={<CustomInput label={'End Date'} />}
              id='form-layouts-separator-date'
              onChange={(date: Date) => {
                setDate(date)
                setFormData({
                  ...formData,
                  endDate: date
                })
              }}
            />
          </Grid>
        </CardContent>

        <Grid container spacing={6} justifyContent={'center'} mt={10}>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
          <Grid item xs={12} sm={6} md={3.5}>
            <CardWithCollapse />
          </Grid>
        </Grid>
        <Divider sx={{ marginTop: 10 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSave}>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={reset}>
            Cancel
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default AddProgramForm
