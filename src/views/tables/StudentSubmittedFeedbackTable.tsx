// ** React Imports
import { useState, ChangeEvent } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

interface Column {
  id: 'name' | 'code' | 'population' 
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number) => string
}

const columns: readonly Column[] = [
  { id: 'name', label: 'Student ID', minWidth: 170 },
  { id: 'code', label: 'Student Name', minWidth: 100, },
  {
    id: 'population',
    label: 'Action',
    minWidth: 170,
    align: 'right',
    format: (value: number) => `${value.toLocaleString('en-US')}%`
  },
//   {
//     id: 'size',
//     label: 'Final Paper',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => `${value.toLocaleString('en-US')}%`
//   },
//   {
//     id: 'density',
//     label: 'Total Marks',
//     minWidth: 170,
//     align: 'right',
//     format: (value: number) => `${value.toLocaleString('en-US')}%`
//   }
]

interface Data {
  name: string
  code: string
  size: number
//   density: number
//   population: number
}

function createData(name: string, code: string, population: number): Data {
//   const density = (parseInt(code)/100)*25 +(parseInt(population)/100)*25+(parseInt(size)/100)*50

  return { name, code, population }
}



const StudentSubmittedFeedbackTable
 = ({students}) => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  console.log(students)
  const rows = students?.map((student)=> createData(`${student.name}`,student.quiz_percentage,student.assignment_percentage,student.paper_percentage))

  


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label='sticky table'>
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
              return (
                <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
                  {columns.map(column => {
                    const value = row[column.id]

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {column.format && typeof value === 'number' ? column.format(value) : value}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component='div'
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default StudentSubmittedFeedbackTable

