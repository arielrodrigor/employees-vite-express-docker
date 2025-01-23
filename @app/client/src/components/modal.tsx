import { ModalProps } from '../util/types';

function Modal({
  isOpen,
  onClose,
  children,
  message,
  onCloseMessage
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md rounded bg-white p-6 shadow">
        {message && (
          <div
            className={`mx-auto mb-4 flex w-11/12 items-center justify-center rounded px-3 py-2 text-xs font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            <span>{message.text}</span>
          </div>
        )}
        <button
          type="button"
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          onClick={() => {
            onClose();
            if (onCloseMessage) onCloseMessage();
          }}
        >
          ✖
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
