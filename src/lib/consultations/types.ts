/**
 * 상담 요청 관련 타입 정의.
 * Prisma 모델과 1:1 매핑되며, 현재는 localStorage로 영속화.
 * 이후 백엔드 연결 시 동일한 shape을 그대로 사용 가능.
 */

export type ConsultationStatus =
  | "REQUESTED"
  | "READ"
  | "REPLIED"
  | "CLOSED";

export type ConsultationSenderRole = "USER" | "COMPANY";

export type NotificationType =
  | "CONSULTATION_REPLIED"
  | "CONSULTATION_READ"
  | "SYSTEM";

export const CONSULTATION_STATUS_LABEL: Record<ConsultationStatus, string> = {
  REQUESTED: "요청됨",
  READ: "확인됨",
  REPLIED: "답변완료",
  CLOSED: "종료됨",
};

export const CONSULTATION_STATUS_COLOR: Record<ConsultationStatus, string> = {
  REQUESTED: "bg-yellow-100 text-yellow-700",
  READ: "bg-blue-100 text-blue-700",
  REPLIED: "bg-green-100 text-green-700",
  CLOSED: "bg-gray-200 text-gray-600",
};

export type ConsultationMessage = {
  id: string;
  consultationRequestId: string;
  senderId: string;
  senderRole: ConsultationSenderRole;
  body: string;
  readAt?: string;
  createdAt: string;
};

export type ConsultationRequest = {
  id: string;
  userId: string;
  companyId: string;
  projectId?: string;
  title: string;
  message: string;
  budgetWon?: number;
  desiredArea?: string;
  contact?: string;
  requesterName?: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  readAt?: string;
  createdAt: string;
};
