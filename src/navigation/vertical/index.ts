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
import { Paper } from '@mui/material'

const navigation = (): VerticalNavItemsType => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  useEffect(() => {
    var loggedInUser = localStorage.getItem('user')
    if (loggedInUser) {
      console.log('user', loggedInUser)
      var u = JSON.parse(loggedInUser)
      setUser(u)
    } else {
      router.push('/login')
    }
  }, [])
  if (user?.role == 2) {
    return [
      {
        title: 'Quiz',
        icon: Message,
        path: '/quiz'
      },

      {
        title: 'Add Assignment',
        icon: Message,
        path: '/add-assignment'
      },

      {
        title: 'Mark Attendance',
        icon: Message,
        path: '/mark-attendance'
      },
      {
        title: 'Mark Assignments',
        icon: Message,
        path: '/submitted-assignments'
      }
    ]
  } else if (user?.role == 3) {
    return [
      // {
      //   title: 'Profile',
      //   icon: AddUser,
      //   path: '/account-settings'
      // },
      {
        title: 'Courses',
        icon: Message,
        path: '/courses'
      },
      // {
      //   title: 'Submit Assignment',
      //   icon: Message,
      //   path: '/submit-assignment'
      // },
      // {
      //   title: 'Student Quiz',
      //   icon: Message,
      //   path: '/student-quiz'
      // },
      {
        title: 'Attendance',
        icon: Message,
        path: '/attendance-details'
      }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(1)) {
    return [
      {
        title: 'Accounts',
        icon: AddUser,
        path: '/'
      }
      // {
      //   title: 'Article Inventory',
      //   icon: Article,
      //   path: '/article-inventory'
      // }
      // {
      //   title: 'Profile',
      //   icon: AddUser,
      //   path: '/account-settings'
      // }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(2)) {
    return [
      {
        title: 'Add Account',
        icon: AddUser,
        path: '/'
      },
      {
        title: 'Schedule Class',
        icon: Message,
        path: '/create-class'
      }
      // {
      //   title: 'Profile',
      //   icon: AddUser,
      //   path: '/account-settings'
      // }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(4)) {
    return [
      {
        title: 'Add Account',
        icon: AddUser,
        path: '/'
      },
      {
        title: 'Enroll Student',
        icon: Message,
        path: '/enroll-student'
      }
      // {
      //   title: 'Profile',
      //   icon: AddUser,
      //   path: '/account-settings'
      // }
      // {
      //   title: 'Quiz',
      //   icon: Message,
      //   path: '/quiz'
      // },
      // {
      //   title: 'Student Quiz',
      //   icon: Message,
      //   path: '/student-quiz'
      // },
      // {
      //   title: 'Add Assignment',
      //   icon: Message,
      //   path: '/add-assignment'
      // },
      // {
      //   title: 'Submit Assignment',
      //   icon: Message,
      //   path: '/submit-assignment'
      // },

      // {
      //   title: 'Schedule Class',
      //   icon: Message,
      //   path: '/create-class'
      // },
      // {
      //   title: 'Mark Attendance',
      //   icon: Message,
      //   path: '/mark-attendance'
      // },
      // {
      //   title: 'Student Dashboard',
      //   icon: Message,
      //   path: '/student-dashboard'
      // }
    ]
  }
  // else if (user?.role == 2) {
  //   return [
  //     {
  //       title: 'Mark Attendance',
  //       icon: Message,
  //       path: '/mark-attendance'
  //     },
  //     {
  //       title: 'Add Assignment',
  //       icon: Message,
  //       path: '/add-assignment'
  //     },
  //     {
  //       title: 'Quiz',
  //       icon: Message,
  //       path: '/quiz'
  //     }
  //   ]
  // }
  else if (user?.role == 1 && user?.admin_types.includes(5)) {
    return [
      {
        title: 'Add Program',
        icon: Detail,
        path: '/add-program'
      },
      {
        title: 'Add Course Details',
        icon: Book,
        path: '/course-details'
      }

      // {
      //   title: 'Profile',
      //   icon: AddUser,
      //   path: '/account-settings'
      // }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(3)) {
    return [
      {
        title: 'Article Inventory',
        icon: Article,
        path: '/article-inventory'
      },
      {
        title: 'Library',
        icon: Book,
        path: '/library'
      }

      // {
      //   title: 'Profile',
      //   icon: AddUser,
      //   path: '/account-settings'
      // }
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
    //   title: 'Attempt Quiz',
    //   icon: Detail,
    //   path: '/pages/AttemptQuiz',
    //   openInNewTab: true
    // }
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
