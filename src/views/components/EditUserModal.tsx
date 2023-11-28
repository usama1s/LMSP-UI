import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import AddAccountForm from '../form-layouts/AddAccountForm'
const EditModal = ({ selectedUserForEdit, onClose, onUpdate }: any) => {
  const [editedUser, setEditedUser] = useState(selectedUserForEdit)

  useEffect(() => {
    setEditedUser(selectedUserForEdit)
  }, [selectedUserForEdit])

  return (
    <Dialog open={!!selectedUserForEdit} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <AddAccountForm selectedUserToEdit={selectedUserForEdit} />
      </DialogContent>
    </Dialog>
  )
}

export default EditModal
