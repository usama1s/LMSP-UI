import React, { useState } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import EditModal from '../components/EditBook'

const BookPage = () => {
  const [selectedBookForEdit, setSelectedBookForEdit] = useState(false)

  const [rows, setRows] = useState([
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', publisher: 'Scribner' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', publisher: 'J.B. Lippincott & Co.' },
    { id: 3, title: '1984', author: 'George Orwell', publisher: 'Secker & Warburg' },
    { id: 4, title: 'Pride and Prejudice', author: 'Jane Austen', publisher: 'T. Egerton, Whitehall' }
  ])

  const ButtonStyled = styled(Button)<{ component?: React.ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Book Title', minWidth: 170 },
    { field: 'author', headerName: 'Author Name', minWidth: 170 },
    { field: 'publisher', headerName: 'Publisher Name', minWidth: 170 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      renderCell: params => (
        <>
          <ButtonStyled
            variant='outlined'
            color='primary'
            sx={{ marginRight: 2 }}
            onClick={() => handleEdit(params.row)}
          >
            Edit
          </ButtonStyled>
          <ButtonStyled variant='outlined' color='error' onClick={() => handleDelete(params.row.id)}>
            Delete
          </ButtonStyled>
        </>
      )
    }
  ]

  const handleEdit = (row: any) => {
    // Implement your edit logic here
    console.log('Edit clicked for row:', row)
  }

  const handleDelete = (id: number) => {
    // Implement your delete logic here
    console.log('Delete clicked for id:', id)
  }

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick autoHeight />
      {selectedBookForEdit && (
        <EditModal selectedArticleForEdit={selectedBookForEdit} onClose={() => setSelectedBookForEdit(false)} />
      )}
    </Paper>
  )
}

export default BookPage
