// ** React Imports
import { useState, ElementType, ChangeEvent, SyntheticEvent, forwardRef, useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button, { ButtonProps } from '@mui/material/Button'

import DatePicker from 'react-datepicker'

import useAuth from 'src/@core/utils/useAuth'

const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

interface FormData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
  maritalStatus: string
  country: string
  organization: string
  designation: string
  qualification: string
  registrationDate: Date | null
  adminType: string[] | string
  status: string
  profileImage: string
  registrationId?: string
}

const AddAccountForm = () => {
  // ** hooks call
  const { customApiCall } = useAuth()
  // ** State
  const [openAlert, setOpenAlert] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [imgFile, setImageFile] = useState<string>('')

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    maritalStatus: 'single',
    country: 'pakistan',
    organization: '',
    designation: '',
    qualification: '',
    registrationDate: null,
    adminType: [],
    status: 'active',
    profileImage: '',
    registrationId: ''
  })
  const [user, setUser] = useState(null)
  useEffect(() => {
    var loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      var u = JSON.parse(loggedInUser)

      setUser(u)
    }
  }, [])

  const toBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()

      fileReader?.readAsDataURL(file)

      fileReader?.onload = () => {
        resolve(fileReader.result)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  const onChange = async (file: ChangeEvent) => {
    const { files } = file.target as HTMLInputElement
    const base64 = await toBase64(files[0])
    var splitted = base64 as string
    setFormData({
      ...formData,
      profileImage: splitted.split(',')[1]
    })

    const reader = new FileReader()
    if (files && files.length !== 0) {
      reader.onload = () => {
        setImageFile(reader.result as string)
      }
      reader.readAsDataURL(files[0])
    }
  }

  const isValidEmail = (email: string): boolean => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSaveChanges = async () => {
    const isAnyFieldEmpty = Object.values(formData).some(field => {
      if (user?.admin_type == 1 && field == 'registrationId' && field == 'adminType') {
        return field
      } else {
        return !field
      }
    })
    // if (isAnyFieldEmpty) {
    //   setErrorMessage('Please fill in all required fields before submitting the form.')
    //   setOpenAlert(true)
    // } else
    if (!isValidEmail(formData.email)) {
      setErrorMessage('Invalid email address. Please provide a valid email.')
      setOpenAlert(true)
    } else if (formData.phoneNumber.length !== 11) {
      setErrorMessage('Invalid phone number. Phone number must be 11 digits.')
      setOpenAlert(true)
    } else {
      try {
        var userToAddRole = '1'
        if (user?.admin_type == 2) {
          userToAddRole = '2'
        } else if (user?.admin_type == 4) {
          userToAddRole = '3'
        }
        const requestData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: userToAddRole,
          marital_status: formData.maritalStatus,
          country: formData.country,
          organization: formData.organization,
          designation: formData.designation,
          qualification: formData.qualification,
          register_date: formData?.registrationDate?.toISOString().split('T')[0],
          admin_types: formData.adminType,
          register_id: formData.registrationId,
          profile_image_type: 'image/jpeg',
          profile_image: formData.profileImage
        }

        const res = await customApiCall('post', 'auth/register', requestData).then(r => {
          alert(r?.message)
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            maritalStatus: 'single',
            country: 'pakistan',
            organization: '',
            designation: '',
            qualification: '',
            registrationDate: null,
            adminType: [],
            status: 'active',
            profileImage: ''
          })
          setImageFile('')
        })

        setOpenAlert(false)
      } catch (error) {
        setErrorMessage('Failed to register. Please try again.')
        setOpenAlert(true)
      }
      setOpenAlert(false)
    }
  }

  const handleReset = (e: SyntheticEvent) => {
    e.preventDefault()
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      maritalStatus: 'single',
      country: 'pakistan',
      organization: '',
      designation: '',
      qualification: '',
      registrationDate: null,
      adminType: '',
      status: 'active',
      profileImage: ''
    })
  }

  const CustomInput = forwardRef((props: TextFieldProps, ref) => {
    return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
  })

  // Create a mapping between frontend labels and backend values
  const adminTypeOptions = [
    { value: '4', label: 'Student Incharge' },
    { value: '2', label: 'Instructor Incharge' },
    { value: '3', label: 'Inventory Incharge' },
    { value: '5', label: 'Program Incharge' }
  ]
  return (
    <CardContent>
      <form>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgFile || '/images/avatars/1.png'} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload Photo
                  <input
                    hidden
                    type='file'
                    onChange={onChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled
                  color='error'
                  variant='outlined'
                  onClick={() => {
                    setFormData({
                      ...formData,
                      profileImage: '/images/avatars/1.png'
                    })
                    setImageFile('/images/avatars/1.png')
                  }}
                >
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='First Name'
              placeholder='Ali'
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Last Name'
              placeholder='Hassan'
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='email'
              label='Email'
              placeholder='johnDoe@example.com'
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='number'
              label='Phone Number'
              placeholder='03155776489'
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='password'
              label='Password'
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </Grid>
          {user?.adminType == 4 && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='text'
                label='Registration ID'
                value={formData.registrationId}
                onChange={e => setFormData({ ...formData, registrationId: e.target.value })}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Marital Status</InputLabel>
              <Select
                label='Martial Status'
                defaultValue='single'
                onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as string })}
              >
                <MenuItem value='single'>Single</MenuItem>
                <MenuItem value='married'>Married</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                label='Country'
                defaultValue='pakistan'
                onChange={e => setFormData({ ...formData, country: e.target.value as string })}
              >
                <MenuItem value='pakistan'>Pakistan</MenuItem>
                <MenuItem value='Qatar'>Qatar</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Organization'
              placeholder='Signal'
              value={formData.organization}
              onChange={e => setFormData({ ...formData, organization: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Designation'
              placeholder='Captain'
              value={formData.designation}
              onChange={e => setFormData({ ...formData, designation: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type='text'
              label='Qualification'
              placeholder='Masters'
              value={formData.qualification}
              onChange={e => setFormData({ ...formData, qualification: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={formData.registrationDate}
              showYearDropdown
              showMonthDropdown
              placeholderText='MM-DD-YYYY'
              customInput={<CustomInput label={'Registration Date'} />}
              id='form-layouts-separator-date'
              onChange={(date: Date) => {
                setFormData({
                  ...formData,
                  registrationDate: date
                })
              }}
            />
          </Grid>
          {user?.admin_type == 1 && (
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Admin Type</InputLabel>
                <Select
                  label='Admin Type'
                  value={formData.adminType} // Use value prop to manage selected values
                  multiple
                  onChange={e => setFormData({ ...formData, adminType: e.target.value as string[] })}
                  renderValue={selected =>
                    (selected as string[])
                      .map(value => {
                        const option = adminTypeOptions.find(opt => opt.value === value)
                        return option ? option.label : value
                      })
                      .join(', ')
                  }
                >
                  {adminTypeOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label='Status'
                defaultValue='active'
                onChange={e => setFormData({ ...formData, status: e.target.value as string })}
              >
                <MenuItem value='active'>Active</MenuItem>
                <MenuItem value='inactive'>Inactive</MenuItem>
                <MenuItem value='pending'>Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {openAlert && (
            <Grid item xs={12}>
              <Alert severity='error' onClose={() => setOpenAlert(false)}>
                <AlertTitle>Error</AlertTitle>
                {errorMessage}
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button variant='contained' sx={{ marginRight: 3.5 }} onClick={handleSaveChanges}>
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={handleReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default AddAccountForm
