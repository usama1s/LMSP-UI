// AdminPage.tsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Grid,
  FormControl,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel
} from '@mui/material'
import useAuth from 'src/@core/utils/useAuth'

interface Question {
  qid: number
  question: string
  options: string[]
  correctOption: string
  image: string
}

interface Quiz {
  subject_id: number
  instructor_id: number
  section: string
  quiz_date: string
  quiz_questions: Question[]
}

const quizzesData: Quiz[] = [
  // Quiz 1
  {
    subject_id: 1,
    instructor_id: 1,
    section: 'A',
    quiz_date: '2023-03-08',
    quiz_questions: [
      {
        qid: 1,
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Rome', 'Berlin'],
        correctOption: 'Paris',
        image: ''
      },
      {
        qid: 2,
        question: 'What is the largest ocean in the world?',
        options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
        correctOption: 'Pacific Ocean',
        image: ''
      },
      {
        qid: 3,
        question: 'What is the highest mountain in the world?',
        options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
        correctOption: 'Mount Everest',
        image: ''
      }
    ]
  },
  // Quiz 2
  {
    subject_id: 2,
    instructor_id: 2,
    section: 'B',
    quiz_date: '2023-03-09',
    quiz_questions: [
      {
        qid: 1,
        question: 'What is the capital of the United States?',
        options: ['Washington, D.C.', 'New York City', 'Los Angeles', 'Chicago'],
        correctOption: 'Washington, D.C.',
        image: ''
      },
      {
        qid: 2,
        question: 'What is the largest state in the United States?',
        options: ['Alaska', 'Texas', 'California', 'Montana'],
        correctOption: 'Alaska',
        image: ''
      },
      {
        qid: 3,
        question: 'What is the most populous city in the United States?',
        options: ['New York City', 'Los Angeles', 'Chicago', 'Houston'],
        correctOption: 'New York City',
        image: ''
      }
    ]
  },
  // Quiz 3
  {
    subject_id: 3,
    instructor_id: 3,
    section: 'C',
    quiz_date: '2023-03-10',
    quiz_questions: [
      {
        qid: 1,
        question: 'What is the capital of the United Kingdom?',
        options: ['London', 'Birmingham', 'Manchester', 'Liverpool'],
        correctOption: 'London',
        image: ''
      },
      {
        qid: 2,
        question: 'What is the largest city in the United Kingdom?',
        options: ['London', 'Birmingham', 'Manchester', 'Liverpool'],
        correctOption: 'London',
        image: ''
      },
      {
        qid: 3,
        question: 'What is the most populous country in the world?',
        options: ['China', 'India', 'United States', 'Indonesia'],
        correctOption: 'China',
        image: ''
      }
    ]
  },
  // Quiz 4
  {
    subject_id: 4,
    instructor_id: 4,
    section: 'D',
    quiz_date: '2023-03-11',
    quiz_questions: [
      {
        qid: 1,
        question: 'What is the capital of France?',
        options: ['Paris', 'London', 'Rome', 'Berlin'],
        correctOption: 'Paris',
        image: ''
      },
      {
        qid: 2,
        question: 'What is the largest ocean in the world?',
        options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
        correctOption: 'Pacific Ocean',
        image: ''
      },
      {
        qid: 3,
        question: 'What is the highest mountain in the world?',
        options: ['Mount Everest', 'K2', 'Kangchenjunga', 'Lhotse'],
        correctOption: 'Mount Everest',
        image: ''
      }
    ]
  }
]

const AdminPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([])

  const toggleQuestionSelection = (quizId: number, questionId: number) => {
    const uniqueIdentifier = `${quizId}-${questionId}`

    const isAlreadySelected = selectedQuestions.includes(uniqueIdentifier)

    if (isAlreadySelected) {
      setSelectedQuestions(selectedQuestions.filter(id => id !== uniqueIdentifier))
    } else {
      setSelectedQuestions([...selectedQuestions, uniqueIdentifier])
    }
  }

  const createNewPaper = () => {
    console.log('Selected Questions:', selectedQuestions)
  }

  const [SubjectId, setSubjectId] = useState<string | null>(null)
  const [subjects, setSubjects] = useState([])
  const [papers, setPapers] = useState([])

  const [user, setUser] = useState(null)

  const getPapers = async subjectId => {
    await customApiCall('get', `instructor/instructor-papers/${subjectId}`)
      .then(r => {
        setPapers(r?.papers)
      })
      .catch(err => [console.log(err)])
  }
  useEffect(() => {
    var user = localStorage.getItem('user')
    if (user && user != undefined) {
      var loggedInUser = JSON.parse(user)
      getAllsubjects(loggedInUser?.instructor_id)
      setUser(loggedInUser)
    }
  }, [])
  const getAllsubjects = async instructorId => {
    await customApiCall('get', `instructor/subjects`).then(r => {
      console.log('subjcts', r)
      setSubjects(r?.subjects)
    })
  }

  return (
    <Container maxWidth='lg' style={{ marginTop: '2rem', backgroundColor: 'white', padding: 30, borderRadius: 10 }}>
      <Typography variant='h4' gutterBottom>
        Admin Page - Select Questions
      </Typography>
      <Grid item xs={12} sm={6} mt={3}>
        <FormControl fullWidth style={{ backgroundColor: 'white' }}>
          <InputLabel>Subject</InputLabel>
          <Select
            label='Subject'
            value={SubjectId}
            onChange={e => {
              setPapers([])
              setSubjectId(e.target.value as string)
              getPapers(e.target.value)
            }}
          >
            {subjects?.map((item, index) => (
              <MenuItem value={item?.subject_id}>{item?.subject_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell>Quiz Title</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {papers.map(quiz => (
              <React.Fragment key={quiz.subject_id}>
                <TableRow>
                  <TableCell colSpan={4} sx={{ fontSize: 20 }}>
                    <strong>{`Paper by ${quiz.instructor_name} on ${new Date(quiz.paper_date).toDateString()}`}</strong>
                  </TableCell>
                </TableRow>
                {quiz.questions.map(question => (
                  <TableRow key={question.qid}>
                    <TableCell>
                      <Checkbox
                        checked={selectedQuestions.includes(`${quiz.subject_id}-${question.qid}`)}
                        onChange={() => toggleQuestionSelection(quiz.subject_id, question.qid)}
                      />
                    </TableCell>
                    <TableCell>{`Paper ${quiz.subject_id}`}</TableCell>
                    <TableCell>{question.question}</TableCell>
                    <TableCell>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex}>{`${optionIndex + 1}. ${option}`}</div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant='contained' color='primary' onClick={createNewPaper} style={{ marginTop: '1rem' }}>
        Create New Paper
      </Button>
    </Container>
  )
}

export default AdminPage
