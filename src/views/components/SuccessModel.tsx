// SuccessModal.tsx
import React from 'react'
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material'

interface SuccessModalProps {
  open: boolean
  onClose: () => void
  obtainedMarks: number
  totalMarks: number
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose, obtainedMarks, totalMarks }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Quiz Submitted Successfully!</DialogTitle>
      <DialogContent>
        <p>
          Result: Obtained Marks: {obtainedMarks}/{totalMarks}
        </p>
        <Button onClick={onClose} color='primary' variant='contained'>
          OK
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default SuccessModal
