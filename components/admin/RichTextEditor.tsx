'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useCallback, useEffect, useState } from 'react';
import {
  Bold, Italic, Strikethrough,
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code2,
  Link2, ImageIcon, Youtube as YoutubeIcon,
  Table as TableIcon, Minus, Undo, Redo,
  Loader2,
} from 'lucide-react';
import { uploadImage } from '@/lib/supabase/queries/storage';

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  bucket?: string;
}

const CHAR_LIMIT = 50000;

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Start writing your post…',
  bucket = 'blog-images',
}: RichTextEditorProps) {
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: 'https' }),
      Youtube.configure({ nocookie: true, width: 640, height: 360 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      CharacterCount.configure({ limit: CHAR_LIMIT }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-teal max-w-none min-h-[400px] p-4 focus:outline-none',
      },
    },
  });

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;
      setUploading(true);
      try {
        const { url } = await uploadImage(bucket, file, 'blog-content');
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  }, [editor, bucket]);

  const handleYouTube = useCallback(() => {
    const url = window.prompt('Enter YouTube URL:');
    if (url && editor) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run();
    }
  }, [editor]);

  const handleLink = useCallback(() => {
    if (!editor) return;
    if (showLinkInput) {
      if (linkUrl) {
        editor.chain().focus().setLink({ href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }).run();
      }
      setShowLinkInput(false);
      setLinkUrl('');
    } else {
      const existing = editor.getAttributes('link').href ?? '';
      setLinkUrl(existing);
      setShowLinkInput(true);
    }
  }, [editor, showLinkInput, linkUrl]);

  if (!editor) return null;

  const charCount = editor.storage.characterCount?.characters?.() ?? 0;

  const ToolbarBtn = ({
    onClick,
    active,
    disabled,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-teal-600 text-white'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:ring-1 focus-within:ring-teal-500 transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-gray-200 bg-gray-50">
        {/* Text formatting */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
          <ToolbarBtn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
            <Strikethrough className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
          <ToolbarBtn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <Heading1 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
            <Heading3 className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        {/* Lists + Block */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
          <ToolbarBtn title="Bullet List" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Ordered List" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Code Block" active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code2 className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        {/* Media */}
        <div className="flex items-center gap-0.5 border-r border-gray-200 pr-2 mr-1">
          <ToolbarBtn title="Add Link" active={editor.isActive('link')} onClick={handleLink}>
            <Link2 className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Insert Image" disabled={uploading} onClick={handleImageUpload}>
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </ToolbarBtn>
          <ToolbarBtn title="Embed YouTube Video" onClick={handleYouTube}>
            <YoutubeIcon className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Insert Table" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <TableIcon className="w-4 h-4" />
          </ToolbarBtn>
        </div>

        {/* Misc */}
        <div className="flex items-center gap-0.5">
          <ToolbarBtn title="Horizontal Rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
            <Minus className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}>
            <Undo className="w-4 h-4" />
          </ToolbarBtn>
          <ToolbarBtn title="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}>
            <Redo className="w-4 h-4" />
          </ToolbarBtn>
        </div>
      </div>

      {/* Link input popover */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-teal-50 border-b border-teal-200">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 text-sm border border-teal-300 rounded-lg px-2 py-1 focus:outline-none focus:border-teal-500"
            onKeyDown={(e) => e.key === 'Enter' && handleLink()}
            autoFocus
          />
          <button
            type="button"
            onClick={handleLink}
            className="text-xs bg-teal-600 text-white px-3 py-1 rounded-lg hover:bg-teal-700"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => { setShowLinkInput(false); setLinkUrl(''); }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editor content */}
      <EditorContent editor={editor} />

      {/* Footer — char count */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 bg-gray-50">
        <span className="text-xs text-gray-400">
          Supports bold, italic, headings, lists, images, tables, and YouTube embeds
        </span>
        <span
          className={`text-xs font-medium ${
            charCount > CHAR_LIMIT * 0.95
              ? 'text-red-500'
              : charCount > CHAR_LIMIT * 0.8
                ? 'text-yellow-600'
                : 'text-gray-400'
          }`}
        >
          {charCount.toLocaleString()} / {CHAR_LIMIT.toLocaleString()} characters
        </span>
      </div>
    </div>
  );
}
