import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import useAuth from 'src/@core/utils/useAuth'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Modal from '@mui/material/Modal'
import { Button, CardActions } from '@mui/material'
import AddProgramForm from '../form-layouts/AddProgramForm'

const formatDate = (dateString: any) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const formatTime = (timeString: any) => {
  return new Date(`1970-01-01T${timeString}Z`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const AllPrograms = () => {
  const { customApiCall } = useAuth()
  const [programs, setAllPrograms] = useState([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editedProgram, setEditedProgram] = useState(null)

  const getAllPrograms = async () => {
    await customApiCall('get', 'admin/get-whole-program')
      .then(r => {
        console.log('programs', r)
        setAllPrograms(r)
      })
      .catch(err => {
        console.log('Error', err)
      })
  }

  const handleEdit = program => {
    setEditedProgram(program)
    setEditModalOpen(true)
  }

  useEffect(() => {
    getAllPrograms()
  }, [])
  return (
    <div>
      {programs.map((program, index) => (
        <Accordion key={index} style={{ marginBottom: '16px' }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div style={{ display: 'flex', alignItems: 'center', gap: ' 16px' }}>
              <Typography variant='h6'>{program.program_name}</Typography>
              <Typography variant='body1'>
                {formatDate(program.start_date)} - {formatDate(program.end_date)}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <List>
              {program.courses.map((course, courseIndex) => (
                <ListItem key={courseIndex}>
                  <ListItemText primary={`Instructor Name: ${course.first_name} ${course.last_name}`} />
                  <ListItemText secondary={`Course Name: ${course.course_name}`} />
                  <List>
                    <div
                      style={{
                        overflowY: 'auto',
                        maxHeight: '300px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        padding: '8px'
                      }}
                    >
                      {course.classes.map((classItem, classIndex) => (
                        <>
                          <ListItem key={classIndex}>
                            <ListItemText
                              primary={`Class Date: ${formatDate(classItem.class_date)}`}
                              secondary={`Class Time: ${formatTime(classItem.class_time)}`}
                            />
                          </ListItem>
                        </>
                      ))}
                    </div>
                  </List>
                </ListItem>
              ))}
            </List>
            <CardActions>
              <Button size='large' variant='contained' onClick={() => handleEdit(program)}>
                Edit
              </Button>
            </CardActions>
          </AccordionDetails>
        </Accordion>
      ))}

      <Modal
        open={editModalOpen}
        sx={{ height: '100vh', width: '100vw', alignItems: 'center', padding: 30 }}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div>
          <AddProgramForm
            editedProgram={editedProgram}
            setEditModalOpen={setEditModalOpen}
            setAllPrograms={setAllPrograms}
          />
        </div>
      </Modal>
    </div>
  )
}

export default AllPrograms
