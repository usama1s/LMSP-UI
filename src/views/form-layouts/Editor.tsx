import React, { useState, useRef, useMemo, useEffect } from 'react'

interface CheckingProps {
  editorRef: any
  courseData: any
  setCourseData: (value: any) => void
  placeholder?: string
}

const Editor: React.FC<CheckingProps> = ({ placeholder, editorRef, courseData, setCourseData }) => {
  const [content, setContent] = useState<string>('')
  const [JoditEditor, setJoditEditor] = useState<any | null>(null)

  const editor = useRef<any | null>(null)

  useEffect(() => {
    import('jodit-react').then(module => {
      setJoditEditor(() => module.default)
    })
  }, [])

  const configCD = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Course Description'
    }),
    [placeholder]
  )

  const configPR = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Pre Requisites'
    }),
    [placeholder]
  )

  const configLO = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Learning Outcomes'
    }),
    [placeholder]
  )

  const configCM = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Classroom Material'
    }),
    [placeholder]
  )

  const configRB = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Reference Books'
    }),
    [placeholder]
  )

  if (!JoditEditor) {
    return null // or some loading indicator
  }

  return (
    <>
      <JoditEditor
        ref={editorRef.current}
        config={configCD}
        tabIndex={1}
        value={courseData.course_description}
        onBlur={e => {
          setCourseData({ ...courseData, course_description: e })
        }}
        onChange={(newContent: string) => {}}
      />

      <JoditEditor
        ref={editorRef.current}
        config={configPR}
        tabIndex={1}
        value={courseData.prerequisites}
        onBlur={e => {
          setCourseData({ ...courseData, prerequisites: e })
        }}
        onChange={(newContent: string) => {}}
      />

      <JoditEditor
        ref={editorRef.current}
        config={configLO}
        tabIndex={1}
        value={courseData.learning_outcomes}
        onBlur={e => {
          setCourseData({ ...courseData, learning_outcomes: e })
        }}
        onChange={(newContent: string) => {}}
      />

      <JoditEditor
        ref={editorRef.current}
        config={configCM}
        tabIndex={1}
        value={courseData.classroom_material}
        onBlur={e => {
          setCourseData({ ...courseData, classroom_material: e })
        }}
        onChange={(newContent: string) => {}}
      />

      <JoditEditor
        ref={editorRef.current}
        config={configRB}
        tabIndex={1}
        value={courseData.reference_books}
        onBlur={e => {
          setCourseData({ ...courseData, reference_books: e })
        }}
        onChange={(newContent: string) => {}}
      />
    </>
  )
}

export default Editor
