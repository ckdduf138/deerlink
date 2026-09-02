"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useAccessibleDialog } from "@/lib/use-accessible-dialog";

interface DiscardConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DiscardConfirmModal({ open, onClose, onConfirm }: DiscardConfirmModalProps) {
  const dialogRef = useAccessibleDialog(open, onClose);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
            className="fixed bottom-0 inset-x-0 z-[60] rounded-t-3xl bg-white border-t border-amber-100 overflow-hidden"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="discard-dialog-title"
            aria-describedby="discard-dialog-description"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 id="discard-dialog-title" className="text-base font-semibold text-stone-900">
                새로 쓸까요?
              </h2>
              <button
                onClick={onClose}
                className="flex min-h-11 min-w-11 items-center justify-center text-stone-500 transition-colors hover:text-stone-700"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-8 space-y-4">
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p id="discard-dialog-description" className="text-xs text-red-700 leading-relaxed">
                  지금까지 작성한 제목과 질문이 모두 사라져요. 되돌릴 수 없어요.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  data-dialog-autofocus
                  className="min-h-12 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={onConfirm}
                  className="min-h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
                >
                  새로 쓰기
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
