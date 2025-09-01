import React, { useState, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { X } from 'lucide-react';

export type Tag = {
  id: string;
  text: string;
};

export enum Delimiter {
  Comma = ',',
  Enter = 'Enter',
}

export interface TagInputStyleClassesProps {
  inlineTagsContainer?: string;
  tag?: {
    body?: string;
    closeButton?: string;
  };
  input?: string;
}

export interface TagInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  tags: Tag[];
  setTags: React.Dispatch<React.SetStateAction<Tag[]>>;
  delimiter?: Delimiter;
  onTagAdd?: (tag: string) => void;
  onTagRemove?: (tag: string) => void;
  maxTags?: number;
  autocompleteOptions?: Tag[];
  enableAutocomplete?: boolean;
  styleClasses?: TagInputStyleClassesProps;
  activeTagIndex: number | null;
  setActiveTagIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      placeholder,
      tags,
      setTags,
      delimiter = Delimiter.Comma,
      onTagAdd,
      onTagRemove,
      maxTags,
      autocompleteOptions = [],
      enableAutocomplete = false,
      styleClasses = {},
      activeTagIndex,
      setActiveTagIndex,
      ...inputProps
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (text: string) => {
      if (maxTags && tags.length >= maxTags) return;
      const newTag: Tag = { id: crypto.randomUUID(), text };
      setTags([...tags, newTag]);
      onTagAdd?.(text);
    };

    const removeTag = (id: string) => {
      const newTags = tags.filter((t) => t.id !== id);
      setTags(newTags);
      const removed = tags.find((t) => t.id === id);
      if (removed) onTagRemove?.(removed.text);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        (delimiter === Delimiter.Enter && e.key === 'Enter') ||
        (delimiter === Delimiter.Comma && e.key === ',')
      ) {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (trimmed) {
          addTag(trimmed);
          setInputValue('');
          setIsOpen(false);
        }
      }
    };

    const handleSelectAutocomplete = (text: string) => {
      addTag(text);
      setInputValue('');
      setIsOpen(false);
    };

    const filteredOptions = autocompleteOptions.filter(
      (opt) =>
        !tags.some((t) => t.text === opt.text) &&
        opt.text.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <div
        className={styleClasses.inlineTagsContainer ?? 'flex flex-wrap gap-1 border rounded p-2'}
      >
        {tags.map((tag, index) => (
          <span
            key={tag.id}
            className={`${styleClasses.tag?.body ?? 'flex items-center gap-1 bg-gray-200 rounded px-2 py-1 text-sm'} ${
              index === activeTagIndex ? 'ring-2 ring-ring' : ''
            }`}
            onClick={() => setActiveTagIndex(index)}
          >
            {tag.text}
            <button
              type="button"
              onClick={() => removeTag(tag.id)}
              className={styleClasses.tag?.closeButton ?? 'text-gray-600 hover:text-gray-900 ml-1'}
            >
              <X size={12} />
            </button>
          </span>
        ))}

        <Popover
          open={isOpen && enableAutocomplete && filteredOptions.length > 0}
          onOpenChange={setIsOpen}
        >
          <PopoverTrigger asChild>
            <input
              {...inputProps}
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') ref(node);
                else if (ref && node)
                  (ref as React.MutableRefObject<HTMLInputElement>).current = node;
              }}
              value={inputValue}
              placeholder={placeholder}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (enableAutocomplete) setIsOpen(true);
              }}
              onKeyDown={handleKeyDown}
              className={styleClasses.input ?? 'flex-1 outline-none'}
            />
          </PopoverTrigger>

          <PopoverContent className="bg-white border rounded shadow p-2 max-h-40 overflow-auto">
            {filteredOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => handleSelectAutocomplete(opt.text)}
                className="cursor-pointer hover:bg-gray-100 p-1 rounded"
              >
                {opt.text}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

TagInput.displayName = 'TagInput';
