import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import {
  FaBold,
  FaHeading,
  FaItalic,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaStrikethrough,
  FaUnderline,
  FaUndo
} from 'react-icons/fa'

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='menuBar'>
      <div>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is_active' : ''}
        >
          <FaBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is_active' : ''}
        >
          <FaItalic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is_active' : ''}
        >
          <FaUnderline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is_active' : ''}
        >
          <FaStrikethrough />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is_active' : ''}
        >
          <FaHeading />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is_active' : ''}
        >
          <FaHeading className='heading3' />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is_active' : ''}
        >
          <FaListUl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is_active' : ''}
        >
          <FaListOl />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is_active' : ''}
        >
          <FaQuoteLeft />
        </button>
      </div>
      <div>
        <button onClick={() => editor.chain().focus().undo().run()}>
          <FaUndo />
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          <FaRedo />
        </button>
      </div>
    </div>
  )
}

export const Tiptap = ({ setDescription }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: ``,

    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setDescription(html)
    }
  })

  return (
    <div className='textEditor'>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

// .ProseMirror {
//   padding: 10px;
//   border-top: 1px solid grey;
//   background: white;
//   border-radius: 0 0 5px 5px;
//   min-height: 100px;
// }
// .ProseMirror:focus {
//   border: none;
//   outline: 1px solid aqua;
// }

// .ProseMirror > * + * {
//   margin-top: 0.75em;
// }

// .ProseMirror ul,
// .ProseMirror ol {
//   padding: 0 2rem;
// }

// .ProseMirror h1,
// .ProseMirror h2,
// .ProseMirror h3,
// .ProseMirror h4,
// .ProseMirror h5,
// .ProseMirror h6 {
//   line-height: 1.1;
// }

// .ProseMirror code {
//   background-color: rgba(#616161, 0.1);
//   color: #616161;
// }

// .ProseMirror pre {
//   background: #0d0d0d;
//   color: #fff;
//   font-family: "JetBrainsMono", monospace;
//   padding: 0.75rem 1rem;
//   border-radius: 0.5rem;
// }
// .ProseMirror code {
//   color: inherit;
//   padding: 0;
//   background: none;
//   font-size: 0.8rem;
// }

// .ProseMirror img {
//   max-width: 100%;
//   height: auto;
// }

// .ProseMirror blockquote {
//   padding-left: 1rem;
//   border-left: 3px solid #999999;
// }

// .ProseMirror hr {
//   border: none;
//   border-top: 3px solid #999999;
//   margin: 2rem 0;
// }

// /* ............................ */
// .textEditor {
//   border-radius: 5px;
//   border: 1px solid grey;
// }
// .menuBar {
//   padding-bottom: 5px;
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }
// .menuBar button {
//   font-size: 18px;
//   margin: 7px;
//   margin-right: 15px;
//   outline: none;
//   border: none;
//   background: none;
//   color: rgb(70, 70, 70);
//   cursor: pointer;
// }
// .menuBar button:last-child {
//   margin-right: 7px;
// }

// .heading3 {
//   font-size: 15px;
// }

// button.is_active {
//   background: rgb(197, 197, 197);
//   padding: 2px 3px;
//   border-radius: 2px;
// }
