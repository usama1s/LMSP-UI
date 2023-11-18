import { Grid } from '@mui/material'
import CardWithCollapse from 'src/views/cards/CardWithCollapse'
import AddProgramForm from 'src/views/form-layouts/AddProgramForm'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const AddProgram = () => {
  return (
    <>
      <DatePickerWrapper>
        <AddProgramForm />
      </DatePickerWrapper>
    </>
  )
}

export default AddProgram
