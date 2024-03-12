// ** React Imports
import { ChangeEvent, MouseEvent, ReactNode, useEffect, useState } from 'react'

// ** Next Imports
import Link from 'next/link'
import { useRouter } from 'next/router'

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// ** Icons Imports

import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import useAuth from 'src/@core/utils/useAuth'

interface State {
  email: string
  password: string
  showPassword: boolean
  role: string
}

// ** Styled Components
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const Icon = styled('img')(() => ({}))

const LoginPage = () => {
  const { customApiCall, login } = useAuth()
  // ** State
  const [loading, setLoading] = useState<boolean | null>(null)
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false,
    role: '1'
  })

  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const LinkStyled = styled('a')(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
  }))

  useEffect(() => {
    setLoading(true)
    var user = localStorage.getItem('user')
    if (user) {
      router.push('/')
    }
    setLoading(false)
  }, [])
  const handleLoginClicked = async (event: any) => {
    event.preventDefault()
    if (!values.email && !values.password) {
      alert('Please fill all details')
    } else {
      try {
        const res = await customApiCall('post', '/auth/sign-in', {
          email: values.email,
          password: values.password,
          role: parseInt(values.role)
        }).then(r => {
          if (r?.message) {
            alert(r?.message)
            return
          }
          var userDetails
          // if (parseInt(values.role) == 2) {
          //   userDetails = r
          // } else {
          userDetails = r
          // }
          console.log('RRR', r)
          localStorage.setItem('user', JSON.stringify(userDetails))
          setValues({
            email: '',
            password: '',
            showPassword: false,
            role: '1'
          })
          router.push('/')
        })
      } catch (e) {
        alert(e?.message)
      }
    }
  }
  if (loading != false) {
    return null
  }
  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon src='/images/favicon.png' />

            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              CASM
              {/* {themeConfig.templateName} */}
            </Typography>
          </Box>
          <Box sx={{ mb: 6 }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Welcome to {themeConfig.templateName}! 👋🏻
            </Typography>
            <Typography variant='body2'>Please sign-in to your account and start learning</Typography>
          </Box>
          <form noValidate autoComplete='off' onSubmit={e => e.preventDefault()}>
            <TextField
              autoFocus
              fullWidth
              id='email'
              label='Email'
              onChange={handleChange('email')}
              sx={{ marginBottom: 4 }}
              value={values.email}
            />
            <FormControl fullWidth>
              <InputLabel htmlFor='auth-login-password'>Password</InputLabel>
              <OutlinedInput
                label='Password'
                value={values.password}
                id='auth-login-password'
                onChange={handleChange('password')}
                type={values.showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      aria-label='toggle password visibility'
                    >
                      {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
            <FormControl fullWidth sx={{ mt: 4, mb: 4 }}>
              <InputLabel>User Type</InputLabel>
              <Select
                label='Admin Type'
                defaultValue='1'
                onChange={e => setValues({ ...values, role: e.target.value as string })}
              >
                <MenuItem value='1'>Admin</MenuItem>
                <MenuItem value='2'>Instructor</MenuItem>
                <MenuItem value='3'>Student</MenuItem>
              </Select>
            </FormControl>
            <Button fullWidth size='large' variant='contained' sx={{ marginBottom: 7 }} onClick={handleLoginClicked}>
              Login
            </Button>
          </form>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Typography variant='body2' sx={{ marginRight: 2 }}>
              Non Registered Student?
            </Typography>
            <Typography variant='body2'>
              <Link passHref href='/register'>
                <LinkStyled>Create an account</LinkStyled>
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default LoginPage
