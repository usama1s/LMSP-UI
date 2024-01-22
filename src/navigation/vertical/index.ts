import Article from 'mdi-material-ui/PaperRoll'

import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import Book from 'mdi-material-ui/Book'
import Message from 'mdi-material-ui/Message'
import Prescription from 'mdi-material-ui/Prescription'

import AddUser from 'mdi-material-ui/Account'
import Question from 'mdi-material-ui/ChatQuestion'
import ContactUs from 'mdi-material-ui/MessageAlert'

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
      },
      {
        title: 'Paper',
        icon: Message,
        path: '/instructor-paper'
      },
      {
        title: 'Schedule Class',
        icon: Message,
        path: '/create-class'
      }
    ]
  } else if (user?.role == 3) {
    return [
      {
        title: 'Courses',
        icon: Message,
        path: '/courses'
      }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(1)) {
    return [
      {
        title: 'Accounts',
        icon: AddUser,
        path: '/'
      },
      {
        title: 'FAQ',
        icon: Question,
        path: 'add-question-faq'
      },
      {
        title: 'Contact Us Questions',
        icon: ContactUs,
        path: 'contact-us-questions'
      }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(2)) {
    return [
      {
        title: 'Add Account',
        icon: AddUser,
        path: '/'
      }
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
      },
      {
        title: 'All Students',
        icon: Message,
        path: '/enrolled-students'
      }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(5)) {
    return [
      {
        title: 'Add Course Details',
        icon: Book,
        path: '/course-details'
      },
      {
        title: 'Paper',
        icon: Book,
        path: '/admin-paper'
      },
      {
        title: 'Certificate',
        icon: Book,
        path: '/certificate'
      },
      {
        title: 'Student Grades',
        icon: Book,
        path: '/student-grades'
      },
      {
        title: 'All Certificates',
        icon: Book,
        path: '/all-certificates'
      }
    ]
  } else if (user?.role == 1 && user?.admin_types.includes(3)) {
    return [
      {
        title: 'Article Inventory',
        icon: Article,
        path: '/article-inventory'
      }
      // {
      //   title: 'Library',
      //   icon: Book,
      //   path: '/library'
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
  ]
}

export default navigation
