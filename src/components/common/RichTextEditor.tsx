import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Box,
  Tooltip,
  IconButton,
  HStack,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import {
  RiBold,
  RiItalic,
  RiListCheck,
  RiListOrdered,
  RiDoubleQuotesL,
  RiArrowGoBackLine,
  RiArrowGoForwardLine,
} from 'react-icons/ri';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
  placeholder = 'Start writing...',
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const MenuButton = ({ icon, onClick, isActive }: { icon: React.ReactNode; onClick: () => void; isActive?: boolean }) => (
    <Tooltip label={icon.toString().toLowerCase().replace('ri', '')}>
      <IconButton
        aria-label={icon.toString().toLowerCase().replace('ri', '')}
        icon={icon}
        size="sm"
        variant="ghost"
        onClick={onClick}
        isActive={isActive}
        color={isActive ? 'blue.500' : textColor}
        _hover={{ bg: 'gray.100' }}
      />
    </Tooltip>
  );

  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      bg={bgColor}
    >
      <HStack p={2} borderBottom="1px" borderColor={borderColor} spacing={1}>
        <MenuButton
          icon={<RiBold />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
        />
        <MenuButton
          icon={<RiItalic />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
        />
        <Divider orientation="vertical" height="20px" />
        <MenuButton
          icon={<RiListCheck />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
        />
        <MenuButton
          icon={<RiListOrdered />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
        />
        <MenuButton
          icon={<RiDoubleQuotesL />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
        />
        <Divider orientation="vertical" height="20px" />
        <MenuButton
          icon={<RiArrowGoBackLine />}
          onClick={() => editor.chain().focus().undo().run()}
          isActive={editor.isActive('undo')}
        />
        <MenuButton
          icon={<RiArrowGoForwardLine />}
          onClick={() => editor.chain().focus().redo().run()}
          isActive={editor.isActive('redo')}
        />
      </HStack>
      <Box p={4}>
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default RichTextEditor; 