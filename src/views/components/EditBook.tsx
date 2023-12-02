import React, { useState, useEffect } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import ArticleInventoryForm from '../form-layouts/ArticelnventoryForm'
import AddBookForm from '../form-layouts/AddBookForm'
const EditModal = ({ selectedArticleForEdit, onClose, onUpdate }: any) => {
  const [editedArticle, setEditedArticle] = useState(selectedArticleForEdit)

  useEffect(() => {
    setEditedArticle(selectedArticleForEdit)
  }, [selectedArticleForEdit])
  return (
    <Dialog open={editedArticle} onClose={onClose}>
      <DialogTitle>Edit Book</DialogTitle>
      <DialogContent>
        <AddBookForm selectedArticleToEdit={selectedArticleForEdit} />
      </DialogContent>
    </Dialog>
  )
}

export default EditModal
