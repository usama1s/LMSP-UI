import React, { useState, useEffect } from 'react'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import useAuth from 'src/@core/utils/useAuth'
import EditModal from '../components/EditUserModal'
import AddAccountForm from '../form-layouts/AddAccountForm'

interface Data {
  id: number
  name: string
  designation: string
  organization: string
  email: string
  country: string
  qualification: string
  role: number
  admin_types: []
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
    { field: 'email', headerName: 'Email', minWidth: 170 },
    { field: 'qualification', headerName: 'Qualification', minWidth: 170 },
    {
      field: 'adminType',
      headerName: 'Admin Type',
      minWidth: 170,
      valueGetter: params => {
        const adminType = params.row.admin_types
        switch (adminType) {
          case 1:
            return 'super_admin'
          case 2:
            return 'instructor_incharge'
          case 3:
            return 'inventory_incharge'
          case 4:
            return 'student_incharge'
          case 5:
            return 'program_incharge'
          case 6:
            return 'instructor'
          case 7:
            return 'student'
          default:
            return ''
        }
      }
    },
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
      console.log('USERSSS', response)
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
        admin_types: item?.admin_type ? item?.admin_type : item?.role == 2 ? 6 : 7
      }))
      var selectedAccounts = []
      // console.log('userr', loggedInUser)
      // if (loggedInUser?.role == 1 && loggedInUser?.admin_types?.includes(1)) {
      //   console.log('all', response)

      //   selectedAccounts.push(usersData.filter((u: any) => u?.role == 1))
      //   console.log(selectedAccounts)
      //   setRows(selectedAccounts)
      // } else if (loggedInUser?.role == 1 && loggedInUser?.admin_types?.includes(2)) {
      //   console.log('all1', response)

      //   selectedAccounts.push(usersData.filter((u: any) => u?.role == 2))
      //   setRows(selectedAccounts)
      // } else if (loggedInUser?.role == 1 && loggedInUser?.admin_types?.includes(4)) {
      //   console.log('all2', response)

      //   selectedAccounts.push(usersData.filter((u: any) => u?.role == 3))
      //   setRows(selectedAccounts)
      // } else {
      //   console.log('all3', response)

      setRows(usersData)
      // }
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
          columns={
            loggedInUser?.admin_types?.includes(1)
              ? columns.map(column => ({
                  ...column,
                  editable: column.editable || false
                }))
              : columns
                  .filter(column => column.field !== 'adminType')
                  .map(column => ({
                    ...column,
                    editable: column.editable || false
                  }))
          }
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
