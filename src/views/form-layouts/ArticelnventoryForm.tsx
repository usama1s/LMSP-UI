// ** React Imports
import { ChangeEvent, forwardRef, useState, ElementType, SyntheticEvent, useEffect } from 'react'

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
import Box from '@mui/material/Box'
import styled from '@emotion/styled'
import useAuth from 'src/@core/utils/useAuth'
// ** Third Party Imports
import DatePicker from 'react-datepicker'
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css'

interface FormData {
  title: string
  description: string
  expiry: Date | null
  induction: Date | null
  make: string
  model: string
  failure_reason: string
  informationFile: File | null
  videoFile: File | null
  imageFiles: File[]
}

const CustomInput = forwardRef((props: TextFieldProps, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />
})

const modules = {
  toolbar: [
    [{ header: '1' }, { header: '2' }, { font: [] }],
    [{ size: [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false
  }
}

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'video'
]

var htmlCode = null
var htmlCodeFailureReson = null

const ArticleInventoryForm = ({ selectedArticleToEdit, title }: any) => {
  console.log(selectedArticleToEdit)
  const { customApiCall } = useAuth()
  const [user, setUser] = useState(null)
  // ** States
  const [date, setDate] = useState<Date | null | undefined>(null)
  const [imgSrc, setImgSrc] = useState<string>('/images/avatars/placeholder.png')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [infoFile, setinfoFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    expiry: null,
    induction: null,
    make: '',
    model: '',
    failure_reason: '',
    informationFile: infoFile,
    videoFile: videoFile,
    imageFiles: imageFiles
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem('user')
    if (loggedIn) {
      var parsedUser = JSON.parse(loggedIn)
      setUser(parsedUser)
    }
  }, [])

  useEffect(() => {
    if (selectedArticleToEdit) {
      console.log(selectedArticleToEdit)
      setFormData({
        ...formData,
        title: title
      })
    }
  }, [])

  const onImageChange = (event: ChangeEvent) => {
    const { files } = event.target as HTMLInputElement

    if (files && files.length !== 0) {
      const newImageFiles = Array.from(files)
      setImageFiles(prevFiles => [...prevFiles, ...newImageFiles])
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

  const readFileAsBase64 = file => {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        resolve(reader.result)
      }
    })
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
  const handleSave = async () => {
    const dataForApiCall = {
      title: formData.title,
      description: htmlCode,
      failure_reason: htmlCodeFailureReson,
      admin_id: user?.admin_id,
      expiry: formData.expiry?.toISOString().slice(0, 19).replace('T', ' '),
      induction: formData.induction?.toISOString().slice(0, 19).replace('T', ' '),
      asset: {
        make: formData.make,
        model: formData.model
      },
      attachments: {
        video_file: videoFile ? await readFileAsBase64(videoFile) : null,
        info_file: infoFile ? await readFileAsBase64(infoFile) : null,
        images: await Promise.all(
          imageFiles.map(async (file, index) => {
            const base64Data = await readFileAsBase64(file)
            return [`image_${index + 1}`, base64Data]
          })
        )
      }
    }

    const res = await customApiCall('post', 'admin/add-item', dataForApiCall).then(r => {
      alert(r?.message)
      setFormData({
        description: '',
        expiry: null,
        failure_reason: '',
        imageFiles: [],
        induction: null,
        informationFile: null,
        make: '',
        model: '',
        title: '',
        videoFile: null
      })
      setImageFiles([])
      setVideoFile(null)
      setinfoFile(null)
    })
  }

  const reset = (e: SyntheticEvent) => {
    e.preventDefault()
    setFormData({
      description: '',
      expiry: null,
      failure_reason: '',
      imageFiles: [],
      induction: null,
      informationFile: null,
      make: '',
      model: '',
      title: '',
      videoFile: null
    })
    setImageFiles([])
    setVideoFile(null)
    setinfoFile(null)
  }

  const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>
  })
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
              <TextField
                fullWidth
                label='Title'
                placeholder='title'
                value={formData.title}
                onChange={e =>
                  setFormData({
                    ...formData,
                    title: e.target.value
                  })
                }
              />
            </Grid>

            {/*  <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type='text'
                label='Make'
                placeholder='Make'
                value={formData.make}
                onChange={e =>
                  setFormData({
                    ...formData,
                    make: e.target.value
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                type='number'
                label='Model'
                placeholder='Model'
                value={formData.model}
                onChange={e =>
                  setFormData({
                    ...formData,
                    model: e.target.value
                  })
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={formData.expiry}
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput label={'Expiry Date'} />}
                id='form-layouts-separator-date'
                onChange={(date: Date) => {
                  setDate(date)
                  setFormData({
                    ...formData,
                    expiry: date
                  })
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                selected={formData.induction}
                showYearDropdown
                showMonthDropdown
                placeholderText='MM-DD-YYYY'
                customInput={<CustomInput label={'Induction Date'} />}
                id='form-layouts-separator-date'
                onChange={(date: Date) => {
                  setDate(date)
                  setFormData({
                    ...formData,
                    induction: date
                  })
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <QuillNoSSRWrapper
                theme='snow'
                modules={modules}
                formats={formats}
                placeholder='Description'
                onChange={e => {
                  htmlCode = e
                }}
              />
            </Grid> */}
            {/* <Grid item xs={12} sm={6}>
              <QuillNoSSRWrapper
                theme='snow'
                modules={modules}
                formats={formats}
                placeholder='Failure Reason'
                onChange={e => {
                  htmlCodeFailureReson = e
                }}
              />
            </Grid> */}
            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Related Files
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
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' onClick={handleSave}>
            Submit
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={reset}>
            Cancel
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default ArticleInventoryForm
