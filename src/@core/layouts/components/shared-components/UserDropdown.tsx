// ** React Imports
import { useState, SyntheticEvent, Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import useAuth from 'src/@core/utils/useAuth'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = () => {
  // ** States
  const { getProfileImage } = useAuth()
  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  const [user, setUser] = useState(null)
  const [profileImg, setProfileImg] = useState<string | null>(null)

  useEffect(() => {
    var user = localStorage.getItem('user')
    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      setUser(loggedInUser)
      getImage(loggedInUser?.profile_picture)
    }
  }, [])

  const getImage = async (file: any) => {
    var res = await getProfileImage(file)
    // console.log('Image', res)
    setProfileImg(`data:image/png;base64,${res}`)
  }
  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = (event: SyntheticEvent) => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = (url?: string) => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Avatar
          alt={user?.first_name + ' ' + user?.last_name}
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          // src='/images/avatars/1.png'
          src={profileImg}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe' src={profileImg} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{user?.first_name + ' ' + user?.last_name}</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                {user?.role == 1 ? 'Admin' : user?.role == '2' ? 'Insstructor' : 'Student'}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem
          sx={{ p: 0 }}
          onClick={() => {
            router.push('/account-settings')
            handleDropdownClose()
          }}
        >
          <Box sx={styles}>
            <AccountOutline sx={{ marginRight: 2 }} />
            Profile
          </Box>
        </MenuItem>

        {user?.role == 3 ? (
          <MenuItem
            sx={{ p: 0 }}
            onClick={() => {
              if (user?.role == 3) {
                handleDropdownClose('/faq')
              } else {
                handleDropdownClose()
              }
            }}
          >
            <Box sx={styles}>
              <HelpCircleOutline sx={{ marginRight: 2 }} />
              FAQ
            </Box>
          </MenuItem>
        ) : null}

        {user?.role == 3 ? (
          <MenuItem
            sx={{ p: 0 }}
            onClick={() => {
              if (user?.role == 3) {
                handleDropdownClose('/contact-us')
              } else {
                handleDropdownClose()
              }
            }}
          >
            <Box sx={styles}>
              <HelpCircleOutline sx={{ marginRight: 2 }} />
              Contact US
            </Box>
          </MenuItem>
        ) : null}
        <Divider />
        <MenuItem
          sx={{ py: 2 }}
          onClick={() => {
            localStorage.removeItem('user')
            handleDropdownClose('/login')
          }}
        >
          <LogoutVariant sx={{ marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
