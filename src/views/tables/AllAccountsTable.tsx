import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import useAuth from 'src/@core/utils/useAuth'
import EditModal from '../components/EditUserModal'

interface Data {
  id: number
  name: string
  designation: string
  organization: string
  email: string
  country: string
  qualification: string
  role: number
  admin_type: number
}

const AllAccountsTable = () => {
  const { customApiCall } = useAuth()

  // ** States
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [users, setUsers] = useState<Array<any>>([])
  const [rows, setRows] = useState<Data[]>([])
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<Data | null>(null)

  const ButtonStyled = styled(Button)<{ component?: React.ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const handleEdit = (user: Data) => {
    const selectedUser = users.find(u => u.id === user.id)
    setSelectedUserForEdit(selectedUser)
  }

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', minWidth: 170 },
    { field: 'designation', headerName: 'Designation', minWidth: 100 },
    { field: 'organization', headerName: 'Organization', minWidth: 170 },
    { field: 'email', headerName: 'Email', minWidth: 170 },
    { field: 'country', headerName: 'Country', minWidth: 170 },
    { field: 'qualification', headerName: 'Qualification', minWidth: 170 },
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

  const getAllUsers = async () => {
    await customApiCall('get', 'admin/get-all-users').then((response: any) => {
      setUsers(response)
      const usersData = response?.map((item: any) => ({
        id: item?.id || 0,
        name: item?.first_name + ' ' + item?.last_name,
        designation: item?.designation,
        organization: item?.organization,
        email: item?.email,
        country: item?.country,
        qualification: item?.qualification,
        role: item?.role,
        admin_type: item?.admin_type
      }))
      var selectedAccounts = []
      console.log('userr', loggedInUser)
      if (loggedInUser?.role == 1 && loggedInUser?.admin_type == 1) {
        console.log('all', response)

        selectedAccounts.push(usersData.find((u: any) => u?.role == 1))
        console.log(selectedAccounts)
        setRows(selectedAccounts)
      } else if (loggedInUser?.role == 1 && loggedInUser?.admin_type == 2) {
        console.log('all1', response)

        selectedAccounts.push(usersData.find((u: any) => u?.role == 2))
        setRows(selectedAccounts)
      } else if (loggedInUser?.role == 1 && loggedInUser?.admin_type == 4) {
        console.log('all2', response)

        selectedAccounts.push(usersData.find((u: any) => u?.role == 3))
        setRows(selectedAccounts)
      } else {
        console.log('all3', response)

        setRows(usersData)
      }
    })
  }

  const handleDelete = async (id: number) => {}

  useEffect(() => {
    var loggedInUsr = localStorage.getItem('user')
    if (loggedInUsr) {
      var u = JSON.parse(loggedInUsr)

      setLoggedInUser(u)
    }
  }, [])

  useEffect(() => {
    getAllUsers()
  }, [loggedInUser])

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <DataGrid
          rows={rows}
          columns={columns.map(column => ({
            ...column,
            editable: column.editable || false
          }))}
          disableRowSelectionOnClick
          autoHeight
        />
      </TableContainer>
      {selectedUserForEdit && (
        <EditModal selectedUserForEdit={selectedUserForEdit} onClose={() => setSelectedUserForEdit(null)} />
      )}
    </Paper>
  )
}

export default AllAccountsTable
