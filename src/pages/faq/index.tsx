import React, { useEffect, useState } from 'react'
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useAuth from 'src/@core/utils/useAuth'

const FAQPage = () => {
  const [faqData, setCourseData] = React.useState<any>([])

  const { customApiCall } = useAuth()

  const getFaqData = async () => {
    try {
      await customApiCall('get', `admin/getFaq`).then(r => {
        setCourseData(r?.faqs)
      })
      console.log(faqData)
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    getFaqData()
  }, [])

  return (
    <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
      <Typography variant='h4' gutterBottom>
        Frequently Asked Questions (FAQ)
      </Typography>
      {faqData.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant='h6'>{item.question}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{item.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  )
}

export default FAQPage
