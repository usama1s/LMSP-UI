// ** React Imports
import { useState, ChangeEvent, ElementType, useEffect } from 'react'

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
import useAuth from 'src/@core/utils/useAuth'

interface Column {
  id: 'name' | 'designation' | 'qualification' | 'organization' | 'email' | 'country'
  label: string
  minWidth?: number
  align?: 'right'
  format?: (value: number | string) => string | ReactJSXElement
}

interface Data {
  name: string
  designation: string
  organization: string
  email: string
  country: string
  qualification: string
}

function createData(
  name: string,
  designation: string,
  organization: string,
  email: string,
  country: string,
  qualification: string
): Data {
  return { name, designation, organization, email, country, qualification }
}

const AllAccountsTable = () => {
  const { customApiCall } = useAuth()
  // ** States
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [rows, setRows] = useState([])

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
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'designation', label: 'Designation', minWidth: 100 },
    {
      id: 'organization',
      label: 'Organization',
      minWidth: 170,
      align: 'right'
      //   format: (value: number) => value.toLocaleString('en-US')
    },
    {
      id: 'email',
      label: 'Email',
      minWidth: 170,
      align: 'right'
      //   format: (value: number) => value.toLocaleString('en-US')
    },
    {
      id: 'country',
      label: 'Country',
      minWidth: 170,
      align: 'right'
      //   format: (value: number) => value.toFixed(2)
    },
    {
      id: 'qualification',
      label: 'Qualification',
      minWidth: 170,
      align: 'right'
    }
  ]

  const getAllUsers = async () => {
    await customApiCall('get', 'admin/get-all-users').then(r => {
      console.log(r)
      r?.result.map((item, index) => {
        setRows(prev => [
          ...prev,
          createData(
            item?.first_name,
            item?.designation,
            item?.organization,
            item?.email,
            item?.country,
            item?.qualification
          )
        ])
      })
    })
  }

  useEffect(() => {
    getAllUsers()
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

export default AllAccountsTable

// import React, { useState, useEffect } from 'react'
// import { classNames } from 'primereact/utils'
// import { FilterMatchMode, FilterOperator } from 'primereact/api'
// import { DataTable } from 'primereact/datatable'
// import { Column } from 'primereact/column'
// import { InputText } from 'primereact/inputtext'
// import { Dropdown } from 'primereact/dropdown'
// import { InputNumber } from 'primereact/inputnumber'
// import { Button } from 'primereact/button'
// import { ProgressBar } from 'primereact/progressbar'
// import { Calendar } from 'primereact/calendar'
// import { MultiSelect } from 'primereact/multiselect'
// import { Slider } from 'primereact/slider'
// import { Tag } from 'primereact/tag'
// import { TriStateCheckbox } from 'primereact/tristatecheckbox'
// import useAuth from 'src/@core/utils/useAuth'

// export default function AdvancedFilterDemo() {
//     const {customApiCall}=useAuth()
//   const [customers, setCustomers] = useState(null)
//   const [filters, setFilters] = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [globalFilterValue, setGlobalFilterValue] = useState('')
//   const [representatives] = useState([
//     { name: 'Amy Elsner', image: 'amyelsner.png' },
//     { name: 'Anna Fali', image: 'annafali.png' },
//     { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//     { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//     { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//     { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//     { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//     { name: 'Onyama Limba', image: 'onyamalimba.png' },
//     { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//     { name: 'XuXue Feng', image: 'xuxuefeng.png' }
//   ])
//   const [statuses] = useState(['unqualified', 'qualified', 'new', 'negotiation', 'renewal'])

//   const getSeverity = status => {
//     switch (status) {
//       case 'unqualified':
//         return 'danger'

//       case 'qualified':
//         return 'success'

//       case 'new':
//         return 'info'

//       case 'negotiation':
//         return 'warning'

//       case 'renewal':
//         return null
//     }
//   }

//   const getUsers=async()=>{
//     await customApiCall('get','').then(data => {
//        setCustomers(getCustomers(data))
//        setLoading(false)
//      })
//   }
//   useEffect(() => {

//     initFilters()
//   }, [])

//   const getCustomers = data => {
//     return [...(data || [])].map(d => {
//       d.date = new Date(d.date)

//       return d
//     })
//   }

//   const formatDate = value => {
//     return value.toLocaleDateString('en-US', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     })
//   }

//   const formatCurrency = value => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
//   }

//   const clearFilter = () => {
//     initFilters()
//   }

//   const onGlobalFilterChange = e => {
//     const value = e.target.value
//     let _filters = { ...filters }

//     _filters['global'].value = value

//     setFilters(_filters)
//     setGlobalFilterValue(value)
//   }

//   const initFilters = () => {
//     setFilters({
//       global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//       name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//       'country.name': {
//         operator: FilterOperator.AND,
//         constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
//       },
//       representative: { value: null, matchMode: FilterMatchMode.IN },
//       date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//       balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//       status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//       activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
//       verified: { value: null, matchMode: FilterMatchMode.EQUALS }
//     })
//     setGlobalFilterValue('')
//   }

//   const renderHeader = () => {
//     return (
//       <div className='flex justify-content-between'>
//         <Button type='button' icon='pi pi-filter-slash' label='Clear' outlined onClick={clearFilter} />
//         <span className='p-input-icon-left'>
//           <i className='pi pi-search' />
//           <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder='Keyword Search' />
//         </span>
//       </div>
//     )
//   }

//   const countryBodyTemplate = rowData => {
//     return (
//       <div className='flex align-items-center gap-2'>
//         <img
//           alt='flag'
//           src='https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png'
//           className={`flag flag-${rowData.country.code}`}
//           style={{ width: '24px' }}
//         />
//         <span>{rowData.country.name}</span>
//       </div>
//     )
//   }

//   const filterClearTemplate = options => {
//     return <Button type='button' icon='pi pi-times' onClick={options.filterClearCallback} severity='secondary'></Button>
//   }

//   const filterApplyTemplate = options => {
//     return <Button type='button' icon='pi pi-check' onClick={options.filterApplyCallback} severity='success'></Button>
//   }

//   const filterFooterTemplate = () => {
//     return <div className='px-3 pt-0 pb-3 text-center'>Filter by Country</div>
//   }

//   const representativeBodyTemplate = rowData => {
//     const representative = rowData.representative

//     return (
//       <div className='flex align-items-center gap-2'>
//         <img
//           alt={representative.name}
//           src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`}
//           width='32'
//         />
//         <span>{representative.name}</span>
//       </div>
//     )
//   }

//   const representativeFilterTemplate = options => {
//     return (
//       <MultiSelect
//         value={options.value}
//         options={representatives}
//         itemTemplate={representativesItemTemplate}
//         onChange={e => options.filterCallback(e.value)}
//         optionLabel='name'
//         placeholder='Any'
//         className='p-column-filter'
//       />
//     )
//   }

//   const representativesItemTemplate = option => {
//     return (
//       <div className='flex align-items-center gap-2'>
//         <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width='32' />
//         <span>{option.name}</span>
//       </div>
//     )
//   }

//   const dateBodyTemplate = rowData => {
//     return formatDate(rowData.date)
//   }

//   const dateFilterTemplate = options => {
//     return (
//       <Calendar
//         value={options.value}
//         onChange={e => options.filterCallback(e.value, options.index)}
//         dateFormat='mm/dd/yy'
//         placeholder='mm/dd/yyyy'
//         mask='99/99/9999'
//       />
//     )
//   }

//   const balanceBodyTemplate = rowData => {
//     return formatCurrency(rowData.balance)
//   }

//   const balanceFilterTemplate = options => {
//     return (
//       <InputNumber
//         value={options.value}
//         onChange={e => options.filterCallback(e.value, options.index)}
//         mode='currency'
//         currency='USD'
//         locale='en-US'
//       />
//     )
//   }

//   const statusBodyTemplate = rowData => {
//     return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
//   }

//   const statusFilterTemplate = options => {
//     return (
//       <Dropdown
//         value={options.value}
//         options={statuses}
//         onChange={e => options.filterCallback(e.value, options.index)}
//         itemTemplate={statusItemTemplate}
//         placeholder='Select One'
//         className='p-column-filter'
//         showClear
//       />
//     )
//   }

//   const statusItemTemplate = option => {
//     return <Tag value={option} severity={getSeverity(option)} />
//   }

//   const activityBodyTemplate = rowData => {
//     return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }}></ProgressBar>
//   }

//   const activityFilterTemplate = options => {
//     return (
//       <React.Fragment>
//         <Slider value={options.value} onChange={e => options.filterCallback(e.value)} range className='m-3'></Slider>
//         <div className='flex align-items-center justify-content-between px-2'>
//           <span>{options.value ? options.value[0] : 0}</span>
//           <span>{options.value ? options.value[1] : 100}</span>
//         </div>
//       </React.Fragment>
//     )
//   }

//   const verifiedBodyTemplate = rowData => {
//     return (
//       <i
//         className={classNames('pi', {
//           'text-green-500 pi-check-circle': rowData.verified,
//           'text-red-500 pi-times-circle': !rowData.verified
//         })}
//       ></i>
//     )
//   }

//   const verifiedFilterTemplate = options => {
//     return (
//       <div className='flex align-items-center gap-2'>
//         <label htmlFor='verified-filter' className='font-bold'>
//           Verified
//         </label>
//         <TriStateCheckbox
//           inputId='verified-filter'
//           value={options.value}
//           onChange={e => options.filterCallback(e.value)}
//         />
//       </div>
//     )
//   }

//   const header = renderHeader()

//   return (
//     <div className='card'>
//       <DataTable
//         value={customers}
//         paginator
//         showGridlines
//         rows={10}
//         loading={loading}
//         dataKey='id'
//         filters={filters}
//         globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
//         header={header}
//         emptyMessage='No customers found.'
//       >
//         <Column field='name' header='Name' filter filterPlaceholder='Search by name' style={{ minWidth: '12rem' }} />
//         <Column
//           header='Country'
//           filterField='country.name'
//           style={{ minWidth: '12rem' }}
//           body={countryBodyTemplate}
//           filter
//           filterPlaceholder='Search by country'
//           filterClear={filterClearTemplate}
//           filterApply={filterApplyTemplate}
//           filterFooter={filterFooterTemplate}
//         />
//         <Column
//           header='Agent'
//           filterField='representative'
//           showFilterMatchModes={false}
//           filterMenuStyle={{ width: '14rem' }}
//           style={{ minWidth: '14rem' }}
//           body={representativeBodyTemplate}
//           filter
//           filterElement={representativeFilterTemplate}
//         />
//         <Column
//           header='Date'
//           filterField='date'
//           dataType='date'
//           style={{ minWidth: '10rem' }}
//           body={dateBodyTemplate}
//           filter
//           filterElement={dateFilterTemplate}
//         />
//         <Column
//           header='Balance'
//           filterField='balance'
//           dataType='numeric'
//           style={{ minWidth: '10rem' }}
//           body={balanceBodyTemplate}
//           filter
//           filterElement={balanceFilterTemplate}
//         />
//         <Column
//           field='status'
//           header='Status'
//           filterMenuStyle={{ width: '14rem' }}
//           style={{ minWidth: '12rem' }}
//           body={statusBodyTemplate}
//           filter
//           filterElement={statusFilterTemplate}
//         />
//         <Column
//           field='activity'
//           header='Activity'
//           showFilterMatchModes={false}
//           style={{ minWidth: '12rem' }}
//           body={activityBodyTemplate}
//           filter
//           filterElement={activityFilterTemplate}
//         />
//         <Column
//           field='verified'
//           header='Verified'
//           dataType='boolean'
//           bodyClassName='text-center'
//           style={{ minWidth: '8rem' }}
//           body={verifiedBodyTemplate}
//           filter
//           filterElement={verifiedFilterTemplate}
//         />
//       </DataTable>
//     </div>
//   )
// }
