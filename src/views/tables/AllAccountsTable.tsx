// // ** React Imports
// import { useState, ChangeEvent, ElementType, useEffect } from 'react'

// // ** MUI Imports
// import Paper from '@mui/material/Paper'
// import Table from '@mui/material/Table'
// import TableRow from '@mui/material/TableRow'
// import TableHead from '@mui/material/TableHead'
// import TableBody from '@mui/material/TableBody'
// import TableCell from '@mui/material/TableCell'
// import TableContainer from '@mui/material/TableContainer'
// import TablePagination from '@mui/material/TablePagination'
// import styled from '@emotion/styled'
// import { Button, ButtonProps } from '@mui/material'
// import { ReactJSXElement } from '@emotion/react/types/jsx-namespace'
// import useAuth from 'src/@core/utils/useAuth'

// interface Column {
//   id: 'name' | 'designation' | 'qualification' | 'organization' | 'email' | 'country'
//   label: string
//   minWidth?: number
//   align?: 'right'
//   format?: (value: number | string) => string | ReactJSXElement
// }

// interface Data {
//   name: string
//   designation: string
//   organization: string
//   email: string
//   country: string
//   qualification: string
// }

// function createData(
//   name: string,
//   designation: string,
//   organization: string,
//   email: string,
//   country: string,
//   qualification: string
// ): Data {
//   return { name, designation, organization, email, country, qualification }
// }

// const AllAccountsTable = () => {
//   const { customApiCall } = useAuth()
//   // ** States
//   const [page, setPage] = useState<number>(0)
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10)
//   const [rows, setRows] = useState([])

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage)
//   }

//   const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(+event.target.value)
//     setPage(0)
//   }

//   const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
//     [theme.breakpoints.down('sm')]: {
//       width: '100%',
//       textAlign: 'center'
//     }
//   }))

//   const columns: readonly Column[] = [
//     { id: 'name', label: 'Name', minWidth: 170 },
//     { id: 'designation', label: 'Designation', minWidth: 100 },
//     {
//       id: 'organization',
//       label: 'Organization',
//       minWidth: 170,
//       align: 'right'
//       //   format: (value: number) => value.toLocaleString('en-US')
//     },
//     {
//       id: 'email',
//       label: 'Email',
//       minWidth: 170,
//       align: 'right'
//       //   format: (value: number) => value.toLocaleString('en-US')
//     },
//     {
//       id: 'country',
//       label: 'Country',
//       minWidth: 170,
//       align: 'right'
//       //   format: (value: number) => value.toFixed(2)
//     },
//     {
//       id: 'qualification',
//       label: 'Qualification',
//       minWidth: 170,
//       align: 'right'
//     }
//   ]

//   const getAllUsers = async () => {
//     await customApiCall('get', 'admin/get-all-users').then(r => {
//       console.log(r)
//       r?.map((item, index) => {
//         setRows(prev => [
//           ...prev,
//           createData(
//             item?.first_name,
//             item?.designation,
//             item?.organization,
//             item?.email,
//             item?.country,
//             item?.qualification
//           )
//         ])
//       })
//     })
//   }

//   useEffect(() => {
//     getAllUsers()
//   }, [])
//   return (
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label='sticky table'>
//           <TableHead>
//             <TableRow>
//               {columns.map(column => (
//                 <TableCell key={column.id} align={column.align} sx={{ minWidth: column.minWidth }}>
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => {
//               return (
//                 <TableRow hover role='checkbox' tabIndex={-1} key={row.code}>
//                   {columns.map(column => {
//                     const value = row[column.id]

//                     return (
//                       <TableCell key={column.id} align={column.align}>
//                         {column.format && typeof value === 'number' ? column.format(value) : value}
//                       </TableCell>
//                     )
//                   })}
//                 </TableRow>
//               )
//             })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component='div'
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   )
// }

// export default AllAccountsTable

import React, { useState, ChangeEvent, useEffect } from 'react'
import {
  DataGrid,
  GridColDef,
  GridCellEditStopParams,
  GridCellEditStopReasons,
  MuiEvent,
  GridRowModel
} from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import useAuth from 'src/@core/utils/useAuth'

interface Data {
  id: number
  name: string
  designation: string
  organization: string
  email: string
  country: string
  qualification: string
}

const AllAccountsTable = () => {
  const { customApiCall } = useAuth()

  // ** States
  const [rows, setRows] = useState<Data[]>([])

  const ButtonStyled = styled(Button)<{ component?: React.ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', minWidth: 170, editable: true },
    { field: 'designation', headerName: 'Designation', minWidth: 100, editable: true },
    { field: 'organization', headerName: 'Organization', minWidth: 170, editable: true },
    { field: 'email', headerName: 'Email', minWidth: 170, editable: true },
    { field: 'country', headerName: 'Country', minWidth: 170, editable: true },
    { field: 'qualification', headerName: 'Qualification', minWidth: 170, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      type: 'actions',
      renderCell: params => (
        <ButtonStyled variant='outlined' color='error' onClick={() => handleDelete(params.row.id)}>
          Delete
        </ButtonStyled>
      )
    }
  ]

  const getAllUsers = async () => {
    await customApiCall('get', 'admin/get-all-users').then(response => {
      const usersData = response.map(item => ({
        id: item?.id || 0, // Using 0 as a fallback if ID is not available
        name: item?.first_name,
        designation: item?.designation,
        organization: item?.organization,
        email: item?.email,
        country: item?.country,
        qualification: item?.qualification
      }))
      setRows(usersData)
    })
  }

  const handleEditCellChange = (params: any) => {
    const { id, field, props } = params
    const { value } = props

    setRows(prevRows =>
      prevRows.map(row =>
        row.id === id
          ? {
              ...row,
              [field]: value
            }
          : row
      )
    )

    console.log('Edited Data:', { id, field, value })
  }

  const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
    console.log(newRow)
  }

  const handleDelete = async (id: number) => {
    // await customApiCall('delete', `admin/delete-user/${id}`).then(() => {
    //   setRows(prevRows => prevRows.filter(row => row.id !== id))
    // })
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <DataGrid
          rows={rows}
          columns={columns.map(column => ({
            ...column,
            editable: column.editable || false
          }))}
          // pageSize={10}
          checkboxSelection
          autoHeight
          // onCellEditStop={handleEditCellChange}
          onCellEditStop={(params: GridCellEditStopParams, event: MuiEvent) => {
            if (params.reason === GridCellEditStopReasons.cellFocusOut) {
              // console.log(params)
              event.defaultMuiPrevented = true
            }
          }}
          processRowUpdate={processRowUpdate}
        />
      </TableContainer>
    </Paper>
  )
}

export default AllAccountsTable
