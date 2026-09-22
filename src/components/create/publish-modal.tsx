"use client";

import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";
import { AlertCircle, Clock3, Globe, Loader2, Lock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { roomLifetimeLabel } from "@/lib/room-lifetime";
import { useAccessibleDialog } from "@/lib/use-accessible-dialog";

interface PublishModalProps {
  open: boolean;
  onClose: () => void;
  isPublic: boolean;
  onPublicChange: (isPublic: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
  error: string | null;
}

export function PublishModal({
  open,
  onClose,
  isPublic,
  onPublicChange,
  onConfirm,
  loading,
  error,
}: PublishModalProps) {
  const y = useMotionValue(0);

  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) {
      handleClose();
    }
  };
  const dialogRef = useAccessibleDialog(open, handleClose, loading);

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
            onClick={handleClose}
            aria-hidden="true"
          />

          <motion.div
            ref={dialogRef}
            key="sheet"
            style={{ y }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={handleDragEnd}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32, mass: 0.8 }}
            className="fixed inset-x-0 bottom-0 z-[60] mx-auto max-w-lg overflow-hidden rounded-t-[28px] bg-white pb-safe"
            role="dialog"
            aria-modal="true"
            aria-labelledby="publish-dialog-title"
            tabIndex={-1}
          >
            <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 rounded-full bg-stone-200" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4">
              <h2 id="publish-dialog-title" className="text-xl font-cute text-stone-900">
                공개 범위를 선택하세요
              </h2>
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex min-h-11 min-w-11 items-center justify-center text-stone-500 transition-colors hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 px-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => onPublicChange(false)}
                  aria-pressed={!isPublic}
                  data-dialog-autofocus
                  className={cn(
                    "pressable rounded-2xl p-4 text-left ring-2",
                    !isPublic
                      ? "bg-amber-50 ring-amber-500"
                      : "bg-page ring-transparent hover:bg-stone-200/60"
                  )}
                >
                  <Lock className={cn("h-5 w-5", !isPublic ? "text-amber-800" : "text-stone-500")} />
                  <p className={cn("mt-2 text-[17px] font-bold", !isPublic ? "text-amber-950" : "text-stone-900")}>
                    비공개
                  </p>
                  <p className={cn("mt-1 text-sm leading-relaxed", !isPublic ? "text-amber-900" : "text-stone-600")}>
                    링크 받은 사람만
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => onPublicChange(true)}
                  aria-pressed={isPublic}
                  className={cn(
                    "pressable rounded-2xl p-4 text-left ring-2",
                    isPublic
                      ? "bg-teal-50 ring-teal-500"
                      : "bg-page ring-transparent hover:bg-stone-200/60"
                  )}
                >
                  <Globe className={cn("h-5 w-5", isPublic ? "text-teal-800" : "text-stone-500")} />
                  <p className={cn("mt-2 text-[17px] font-bold", isPublic ? "text-teal-950" : "text-stone-900")}>
                    공개
                  </p>
                  <p className={cn("mt-1 text-sm leading-relaxed", isPublic ? "text-teal-900" : "text-stone-600")}>
                    누구나 익명으로
                  </p>
                </button>
              </div>

              <div className="flex items-start gap-2 rounded-2xl bg-page px-4 py-3 text-stone-700">
                <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <p className="text-sm leading-relaxed">
                  {isPublic
                    ? `${roomLifetimeLabel(true)} 열리고, 한 명 답할 때마다 하루씩 늘어요`
                    : `${roomLifetimeLabel(false)} 뒤 사라져요`}
                </p>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-2xl bg-red-50 px-4 py-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm leading-relaxed text-red-700">
                    {error}
                    <br />
                    <span className="text-red-600">작성한 내용은 그대로 있어요.</span>
                  </p>
                </div>
              )}

              <button
                onClick={onConfirm}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    링크 만드는 중
                  </>
                ) : error ? (
                  "다시 시도"
                ) : (
                  `${isPublic ? "공개방" : "비공개방"}으로 링크 만들기`
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
