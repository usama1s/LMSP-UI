'use client'
// ** React Imports
import { useState, ChangeEvent, ElementType, useEffect, useRef } from 'react'

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
import useAuth from 'src/@core/utils/useAuth'
import QRCode from 'qrcode'
import EditModal from '../components/EditArticleModal'
import axios from 'axios'

interface Column {
  id: 'ID' | 'title' | 'make' | 'model' | 'expiryDate' | 'inductionDate' | 'downloadQr'
  label: string
  minWidth?: number
  align?: 'right'
}

interface Data {
  title: string
  make: string
  model: number
  expiryDate: number | string
  inductionDate: number | string
  ID: number
}

function createData(
  ID: number,
  title: string,
  make: string,
  model: number,
  expiryDate: number,
  inductionDate: string
): Data {
  return { ID, title, make, model, expiryDate, inductionDate }
}

const ArticleInventoryTable = () => {
  const { customApiCall } = useAuth()
  const qrCodeRef = useRef(null)

  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState([])
  const [qr, setQr] = useState<string | null>(null)
  const [userIp, setUserIp] = useState(null)
  const [selectedArticleForEdit, setSelectedArticleForEdit] = useState(false)

  const handleEdit = () => {
    setSelectedArticleForEdit(true)
  }
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
    { id: 'ID', label: 'ID', minWidth: 170 },

    { id: 'title', label: 'Title', minWidth: 170 },
    { id: 'make', label: 'Make', minWidth: 100 },
    {
      id: 'model',
      label: 'Model',
      minWidth: 170,
      align: 'right'
    },
    {
      id: 'expiryDate',
      label: 'Expiry Date',
      minWidth: 170,
      align: 'right'
    },
    {
      id: 'inductionDate',
      label: 'Induction Date',
      minWidth: 170,
      align: 'right'
    },
    {
      id: 'downloadQr',
      label: 'Download Qr',
      minWidth: 170,
      align: 'right'
    }
  ]

  const getAllItems = async () => {
    await customApiCall('get', 'admin/get-all-item').then(r => {
      r?.map((item, index) => {
        setRows(prev => [
          ...prev,
          createData(item?.inventory_id, item?.title, item?.make, item?.model, item?.expiry, item?.induction)
        ])
      })
    })
  }

  const downloadQRCode = async (id: any, title: any) => {
    const qrCodeText = `http://192.168.18.127:3000/pages/article-detail/?id=${id}`

    QRCode?.toDataURL(
      qrCodeText,
      {
        width: 800,
        margin: 2,
        color: {
          dark: '#335383FF',
          light: '#EEEEEEFF'
        }
      },
      (err, url) => {
        if (err) return console.error(err)
        setQr(url)
        var anchor = document.createElement('a')
        anchor.href = url
        // anchor.target = '_blank'
        anchor.download = `${title}Qr.png`
        anchor.click()
      }
    )
  }

  useEffect(() => {
    getAllItems()
  }, [])

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
                    console.log(row.ID)
                    return (
                      <>
                        <TableCell key={column.id} align={column.align}>
                          {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                          {column.id === 'downloadQr' ? (
                            <>
                              <ButtonStyled
                                variant='contained'
                                color='primary'
                                onClick={() => {
                                  downloadQRCode(row?.ID, row?.title)
                                  // alert('In Progress')
                                }}
                              >
                                Download Qr
                              </ButtonStyled>
                              <ButtonStyled
                                variant='contained'
                                color='primary'
                                onClick={() => {
                                  setSelectedArticleForEdit(true)
                                }}
                                sx={{ marginLeft: 3 }}
                              >
                                Edit
                              </ButtonStyled>

                              {/* <ButtonStyled variant='contained' color='error' onClick={() => {}} sx={{ marginLeft: 3 }}>
                                Delete
                              </ButtonStyled> */}
                            </>
                          ) : (
                            value
                          )}
                        </TableCell>
                      </>
                    )
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedArticleForEdit && (
        <EditModal selectedArticleForEdit={selectedArticleForEdit} onClose={() => setSelectedArticleForEdit(false)} />
      )}
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
