import React, { useState, useEffect } from 'react'
import useAuth from 'src/@core/utils/useAuth'
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'

const CertificatesPage: React.FC = () => {
  const { customApiCall } = useAuth()
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    // Fetch certificates data from the API endpoint
    const fetchCertificates = async () => {
      try {
        const response = await customApiCall('get', 'admin/getAllCertificates')
        setCertificates(response.allCertificates || [])
      } catch (error) {
        console.error('Error fetching certificates:', error)
      }
    }

    fetchCertificates()
  }, [])

  return (
    <div style={{ margin: 20 }}>
      <Typography variant='h5' gutterBottom>
        All Certificates
      </Typography>
      {certificates.length === 0 ? (
        <Typography>No certificates available.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Course Name</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Issued By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Title</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.map(certificate => (
                <TableRow key={certificate.certificate_id}>
                  <TableCell>{certificate.certificate_id}</TableCell>
                  <TableCell>{certificate.course_name}</TableCell>
                  <TableCell>{certificate.user_name}</TableCell>
                  <TableCell>{certificate.issued_by_name}</TableCell>
                  <TableCell>{certificate.date}</TableCell>
                  <TableCell>{certificate.title}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  )
}

export default CertificatesPage
