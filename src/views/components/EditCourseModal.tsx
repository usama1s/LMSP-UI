import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import AddAccountForm from '../form-layouts/AddAccountForm'
import CourseDetails from '../form-layouts/AddCourse'
const EditModal = ({ selectedCourseToEdit, onClose, onUpdate }: any) => {
  const [editedUser, setEditedUser] = useState(selectedCourseToEdit)

  useEffect(() => {
    setEditedUser(selectedCourseToEdit)
  }, [selectedCourseToEdit])

  return (
    <Dialog open={!!selectedCourseToEdit} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <CourseDetails courseToEdit={selectedCourseToEdit} />
      </DialogContent>
    </Dialog>
  )
}

export default EditModal
