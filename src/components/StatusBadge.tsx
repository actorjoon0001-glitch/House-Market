import {
  CONSULTATION_STATUS_COLOR,
  CONSULTATION_STATUS_LABEL,
  type ConsultationStatus,
} from "@/lib/consultations/types";

export default function StatusBadge({
  status,
  className = "",
}: {
  status: ConsultationStatus;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${CONSULTATION_STATUS_COLOR[status]} ${className}`}
    >
      {CONSULTATION_STATUS_LABEL[status]}
    </span>
  );
}
