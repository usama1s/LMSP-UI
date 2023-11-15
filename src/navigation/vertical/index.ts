// ** Icon imports
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import Article from 'mdi-material-ui/PaperRoll'

import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import Book from 'mdi-material-ui/Book'
import Message from 'mdi-material-ui/Message'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import Prescription from 'mdi-material-ui/Prescription'

import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'

import AddUser from 'mdi-material-ui/Account'
import Detail from 'mdi-material-ui/Details'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const navigation = (): VerticalNavItemsType => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  useEffect(() => {
    var loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      var u = JSON.parse(loggedInUser)
      setUser(u)
    } else {
      router.push('/login')
    }
  }, [])

  if (user?.role == 1 && user?.admin_type == 1) {
    return [
      {
        title: 'Accounts',
        icon: AddUser,
        path: '/'
      },
      // {
      //   title: 'Article Inventory',
      //   icon: Article,
      //   path: '/article-inventory'
      // }
      {
        title: 'Profile',
        icon: AddUser,
        path: '/account-settings'
      }
    ]
  } else if (user?.role == 1 && user?.admin_type == 5) {
    return [
      // {
      //   title: 'Add Account',
      //   icon: AddUser,
      //   path: '/'
      // },
      {
        title: 'Add Program',
        icon: Detail,
        path: '/add-program'
      },
      {
        title: 'Add Course Details',
        icon: Book,
        path: '/course-details'
      },
      {
        title: 'Quiz',
        icon: Message,
        path: '/quiz'
      },
      {
        title: 'Profile',
        icon: AddUser,
        path: '/account-settings'
      }
    ]
  } else if (user?.role == 1 && user?.admin_type == 3) {
    return [
      {
        title: 'Article Inventory',
        icon: Article,
        path: '/article-inventory'
      },
      {
        title: 'Profile',
        icon: AddUser,
        path: '/account-settings'
      }
    ]
  }
  return [
    {
      title: 'Article Inventory',
      icon: Article,
      path: '/article-inventory'
    },
    {
      title: 'Add Account',
      icon: AddUser,
      path: '/'
    },
    {
      title: 'Account Settings',
      icon: AccountCogOutline,
      path: '/account-settings'
    },
    {
      title: 'Course Details',
      icon: Book,
      path: '/course-details'
    },
    {
      title: 'Add Program',
      icon: Prescription,
      path: '/add-program'
    },
    {
      title: 'Article Detail',
      icon: Detail,
      path: '/pages/article-detail',
      openInNewTab: true
    }
    // {
    //   sectionTitle: 'Pages'
    // }
    // {
    //   title: 'Login',
    //   icon: Login,
    //   path: '/pages/login',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Register',
    //   icon: AccountPlusOutline,
    //   path: '/pages/register',
    //   openInNewTab: true
    // },
    // {
    //   title: 'Error',
    //   icon: AlertCircleOutline,
    //   path: '/pages/error',
    //   openInNewTab: true
    // },
    // {
    //   sectionTitle: 'User Interface'
    // },
    // {
    //   title: 'Typography',
    //   icon: FormatLetterCase,
    //   path: '/typography'
    // },
    // {
    //   title: 'Icons',
    //   path: '/icons',
    //   icon: GoogleCirclesExtended
    // },
    // {
    //   title: 'Cards',
    //   icon: CreditCardOutline,
    //   path: '/cards'
    // },
    // {
    //   title: 'Tables',
    //   icon: Table,
    //   path: '/tables'
    // },
    // {
    //   icon: CubeOutline,
    //   title: 'Form Layouts',
    //   path: '/form-layouts'
    // }
  ]
}

export default navigation
