// ** React Imports
import { ChangeEvent, forwardRef, MouseEvent, useState, ElementType } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button, { ButtonProps } from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import TextField, { TextFieldProps } from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import { SelectChangeEvent } from '@mui/material/Select'
import Box from '@mui/material/Box'
import styled from '@emotion/styled'

// ** Third Party Imports
import DatePicker from 'react-datepicker'

interface State {
  password: string
  password2: string
  showPassword: boolean
  showPassword2: boolean
}

const CustomInput = forwardRef((props: TextFieldProps, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
})

const ArticleInventoryForm = () => {
  // ** States
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/placeholder.png')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [infoFile, setinfoFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const onImageChange = (event: ChangeEvent) => {
    const { files } = event.target as HTMLInputElement

    if (files && files.length !== 0) {
      // Convert FileList to an array and update state
      const newImageFiles = Array.from(files)
      setImageFiles(prevFiles => [...prevFiles, ...newImageFiles])

      // Reset the input to allow selecting the same file again
      ;(event.target as HTMLInputElement).value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImageFiles = [...imageFiles]
    newImageFiles.splice(index, 1)
    setImageFiles(newImageFiles)
  }

  const ImgStyled = styled('img')(({ theme }) => ({
    width: 180,
    height: 120,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius
  }))

  const ButtonStyled = styled(Button)<ButtonProps & { component?: ElementType; htmlFor?: string }>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      textAlign: 'center'
    }
  }))

  const ResetButtonStyled = styled(Button)<ButtonProps>(({ theme }) => ({
    marginLeft: theme.spacing(4.5),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      marginLeft: 0,
      textAlign: 'center',
      marginTop: theme.spacing(4)
    }
  }))

  const onChange = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result as string)

      reader.readAsDataURL(files[0])
    }
  }

  const onChangeVideo = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setVideoFile(files[0])

      reader.readAsDataURL(files[0])
    }
  }

  const onChangeFile = (file: ChangeEvent) => {
    const reader = new FileReader()
    const { files } = file.target as HTMLInputElement
    if (files && files.length !== 0) {
      reader.onload = () => setinfoFile(files[0])

      reader.readAsDataURL(files[0])
    }
  }
  return (
    <Card>
      <CardHeader title='Add Articles to Inventory' titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Details
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label='Title' placeholder='title' />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField fullWidth type='text' label='Make' placeholder='Make' />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth type='number' label='Model' placeholder='Model' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput label={'Expiry Date'} />}
                id='form-layouts-separator-date'
                onChange={(date: Date) => setDate(date)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={date}
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput label={'Induction Date'} />}
                id='form-layouts-separator-date'
                onChange={(date: Date) => setDate(date)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' multiline label='Description' placeholder='Description' rows={4} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type='text' multiline label='Failure Reason' placeholder='Failure Reason' rows={4} />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Related Files
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: '180px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mr: '1.5625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {infoFile ? infoFile.name : 'Pick a file'}
                  </Typography>
                </Box>
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='article-inventory-upload-file'>
                    Upload Info File
                    <input
                      hidden
                      type='file'
                      onChange={onChangeFile}
                      accept='application/pdf, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation'
                      id='article-inventory-upload-file'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='error' variant='outlined' onClick={() => setinfoFile(null)}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PDF, Docx, PPT.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }} mt={3}>
                <Box
                  sx={{
                    width: 180,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    mr: '1.5625rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {videoFile ? videoFile.name : 'Pick a video'}
                  </Typography>
                </Box>
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='article-inventory-upload-video'>
                    Upload Video
                    <input
                      hidden
                      type='file'
                      onChange={onChangeVideo}
                      accept='video/*'
                      id='article-inventory-upload-video'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='error' variant='outlined' onClick={() => setVideoFile(null)}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed Video Files.
                  </Typography>
                </Box>
              </Box>

              {/* <Box sx={{ display: 'flex', alignItems: 'center' }} mt={3}>
                <ImgStyled src={imgSrc} alt='Profile Pic' />
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                    Upload Image
                    <input
                      hidden
                      type='file'
                      onChange={onChange}
                      accept='image/png, image/jpeg'
                      id='account-settings-upload-image'
                    />
                  </ButtonStyled>
                  <ResetButtonStyled
                    color='error'
                    variant='outlined'
                    onClick={() => setImgSrc('/images/avatars/placeholder.png')}
                  >
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG.
                  </Typography>
                </Box>
              </Box> */}
              <Box sx={{ display: 'flex', alignItems: 'center' }} mt={6}>
                <Box>
                  <ButtonStyled component='label' variant='contained' htmlFor='article-inventory-upload-image'>
                    Upload Image
                    <input
                      hidden
                      type='file'
                      onChange={onImageChange}
                      accept='image/png, image/jpeg'
                      id='article-inventory-upload-image'
                      multiple
                    />
                  </ButtonStyled>
                  <ResetButtonStyled color='error' variant='outlined' onClick={() => setImageFiles([])}>
                    Reset
                  </ResetButtonStyled>
                  <Typography variant='body2' sx={{ marginTop: 5 }}>
                    Allowed PNG or JPEG.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginLeft: 3 }}>
                  {imageFiles.map((file, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        marginRight: 2
                      }}
                    >
                      <ImgStyled src={URL.createObjectURL(file)} alt={`Image ${index + 1}`} />
                      <Button
                        size='small'
                        color='error'
                        variant='outlined'
                        onClick={() => removeImage(index)}
                        sx={{ marginTop: 1 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined'>
            Cancel
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default ArticleInventoryForm
