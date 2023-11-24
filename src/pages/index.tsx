import { useEffect, useState } from 'react'
import AddAccount from './add-account'
import { useRouter } from 'next/router'
import ArticleInventory from './article-inventory'
import AddProgram from './add-program'
import QuizPage from './quiz'
import Courses from './courses'
const Dashboard = () => {
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
    return <AddAccount />
  } else if (user?.role == 1 && user?.admin_type == 5) {
    return <AddProgram />
  } else if (user?.role == 1 && user?.admin_type == 3) {
    //Inventory Incharge
    return <ArticleInventory />
  } else if (user?.role == 2) {
    return <QuizPage />
  } else if (user?.role == 3) {
    return <Courses />
  } else {
    return <AddAccount />
  }
}

export default Dashboard
