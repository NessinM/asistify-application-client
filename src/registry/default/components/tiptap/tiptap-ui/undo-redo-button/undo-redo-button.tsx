import * as React from 'react';
import { type Editor } from '@tiptap/react';

// --- Hooks ---
import { useTiptapEditor } from '@registry/default/hooks/use-tiptap-editor';

// --- Icons ---
import { Redo, Undo } from 'lucide-react';

// --- UI Primitives ---
// import type { ButtonProps } from "@registry/default/components/tiptap/tiptap-ui-primitive/button";
import { Button } from '@registry/default/ui/button';
// import { Button } from "@registry/default/components/tiptap/tiptap-ui-primitive/button";

export type HistoryAction = 'undo' | 'redo';

/**
 * Props for the UndoRedoButton component.
 */
export interface UndoRedoButtonProps {
  /**
   * The TipTap editor instance.
   */
  editor?: Editor | null;
  /**
   * Optional text to display alongside the icon.
   */
  text?: string;
  /**
   * The history action to perform (undo or redo).
   */
  action: HistoryAction;
}

// eslint-disable-next-line react-refresh/only-export-components
export const historyIcons = {
  undo: Undo,
  redo: Redo,
};

// eslint-disable-next-line react-refresh/only-export-components
export const historyShortcutKeys: Partial<Record<HistoryAction, string>> = {
  undo: 'Ctrl-z',
  redo: 'Ctrl-Shift-z',
};

// eslint-disable-next-line react-refresh/only-export-components
export const historyActionLabels: Record<HistoryAction, string> = {
  undo: 'Undo',
  redo: 'Redo',
};

// eslint-disable-next-line react-refresh/only-export-components
export function canExecuteHistoryAction(editor: Editor | null, action: HistoryAction): boolean {
  if (!editor) return false;
  return action === 'undo' ? editor.can().undo() : editor.can().redo();
}

// eslint-disable-next-line react-refresh/only-export-components
export function executeHistoryAction(editor: Editor | null, action: HistoryAction): boolean {
  if (!editor) return false;
  const chain = editor.chain().focus();
  return action === 'undo' ? chain.undo().run() : chain.redo().run();
}

/**
 * Determines if a history action should be disabled.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to check
 * @param userDisabled Whether the action is explicitly disabled by the user
 * @returns Whether the action should be disabled
 */
export function isHistoryActionDisabled(
  editor: Editor | null,
  action: HistoryAction,
  userDisabled: boolean = false
): boolean {
  if (userDisabled) return true;
  return !canExecuteHistoryAction(editor, action);
}

/**
 * Hook that provides all the necessary state and handlers for a history action.
 *
 * @param editor The TipTap editor instance
 * @param action The history action to handle
 * @param disabled Whether the action is explicitly disabled
 * @returns Object containing state and handlers for the history action
 */
export function useHistoryAction(
  editor: Editor | null,
  action: HistoryAction,
  disabled: boolean = false
) {
  const canExecute = React.useMemo(() => canExecuteHistoryAction(editor, action), [editor, action]);

  const isDisabled = isHistoryActionDisabled(editor, action, disabled);

  const handleAction = React.useCallback(() => {
    if (!editor || isDisabled) return;
    executeHistoryAction(editor, action);
  }, [editor, action, isDisabled]);

  const Icon = historyIcons[action];
  const actionLabel = historyActionLabels[action];
  const shortcutKey = historyShortcutKeys[action];

  return {
    canExecute,
    isDisabled,
    handleAction,
    Icon,
    actionLabel,
    shortcutKey,
  };
}

/**
 * Button component for triggering undo/redo actions in a TipTap editor.
 */
export const UndoRedoButton = React.forwardRef<HTMLButtonElement, UndoRedoButtonProps>(
  (
    {
      editor: providedEditor,
      action,
      text,
      className = '',
      disabled,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const editor = useTiptapEditor(providedEditor);

    const { isDisabled, handleAction, Icon, actionLabel, shortcutKey } = useHistoryAction(
      editor,
      action,
      disabled
    );

    const handleClick = React.useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);

        if (!e.defaultPrevented && !disabled) {
          handleAction();
        }
      },
      [onClick, disabled, handleAction]
    );

    if (!editor || !editor.isEditable) {
      return null;
    }

    return (
      <Button
        ref={ref}
        type="button"
        className={className.trim()}
        variant={'ghost'}
        size={'icon'}
        data-disabled={isDisabled}
        role="button"
        tabIndex={-1}
        aria-label={actionLabel}
        // tooltip={actionLabel}
        // shortcutKeys={shortcutKey}
        onClick={handleClick}
        {...buttonProps}
      >
        {children || (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    );
  }
);

UndoRedoButton.displayName = 'UndoRedoButton';

export default UndoRedoButton;
