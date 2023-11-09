// ** React Imports
import { useState, ChangeEvent, ElementType } from 'react'

// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import styled from '@emotion/styled'
import { Button, ButtonProps } from '@mui/material'
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'

interface Column {
  id: 'title' | 'make' | 'model' | 'expiryDate' | 'inductionDate' | 'downloadQr'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number | string) => string | ReactJSXElement
}

interface Data {
  title: string
  make: string
  model: number
  expiryDate: number | string
  inductionDate: number | string
  format: string
}

function createData(
  title: string,
  make: string,
  model: number,
  expiryDate: number,
  inductionDate: string,
  format: string
): Data {
  return { title, make, model, expiryDate, inductionDate, format }
}

const rows = [
  createData('India', 'IN', 1324171354, 3287263, '22/3/16', 'Download'),
  createData('China', 'CN', 1403500365, 9596961, '22/3/16', 'Download'),
  createData('Italy', 'IT', 60483973, 301340, '22/3/16', 'Download'),
  createData('United States', 'US', 327167434, 9833520, '22/3/16', 'Download'),
  createData('Canada', 'CA', 37602103, 9984670, '22/3/16', 'Download'),
  createData('Australia', 'AU', 25475400, 7692024, '22/3/16', 'Download'),
  createData('Germany', 'DE', 83019200, 357578, '22/3/16', 'Download'),
  createData('Ireland', 'IE', 4857000, 70273, '22/3/16', 'Download'),
  createData('Mexico', 'MX', 126577691, 1972550, '22/3/16', 'Download'),
  createData('Japan', 'JP', 126317000, 377973, '22/3/16', 'Download'),
  createData('France', 'FR', 67022000, 640679, '22/3/16', 'Download'),
  createData('United Kingdom', 'GB', 67545757, 242495, '22/3/16', 'Download'),
  createData('Russia', 'RU', 146793744, 17098246, '22/3/16', 'Download'),
  createData('Nigeria', 'NG', 200962417, 923768, '22/3/16', 'Download'),
  createData('Brazil', 'BR', 210147125, 8515767, '22/3/16', 'Download')
]

const ArticleInventoryTable = () => {
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const columns: readonly Column[] = [
    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'make', label: 'Make', minWidth: 100 },
    {
      id: 'model',
      label: 'Model',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US')
    },
    {
      id: 'expiryDate',
      label: 'Expiry Date',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toLocaleString('en-US')
    },
    {
      id: 'inductionDate',
      label: 'Induction Date',
      minWidth: 170,
      align: 'right',
      format: (value: number) => value.toFixed(2)
    },
    {
      id: 'downloadQr',
      label: 'Download Qr',
      minWidth: 170,
      align: 'right',
      format: (value: string) => (
        <ButtonStyled component='label' variant='contained' htmlFor='article-inventory-upload-file'>
          {value}
        </ButtonStyled>
      )
    }
  ]
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

export default ArticleInventoryTable
