/**
 * localStorage 기반 클라이언트 스토어.
 * - SSR-safe (window 체크)
 * - 단일 사용자 데모: mock USER_ID = "user-demo"
 * - mock OWNER가 관리하는 회사 = "verified-001" (이건 owner 페이지에서만 사용)
 * - 추후 백엔드 연결 시 이 파일만 갈아끼우면 됨
 */
import type {
  ConsultationMessage,
  ConsultationRequest,
  ConsultationStatus,
  Notification,
} from "./types";

const KEYS = {
  consultations: "hm.consultations.v1",
  messages: "hm.consultation-messages.v1",
  notifications: "hm.notifications.v1",
  favorites: "hm.favorites.v1",
} as const;

export const MOCK_USER_ID = "user-demo";
/** 데모용으로 owner-side에서 "내가 관리하는 회사"로 보일 회사 id. */
export const MOCK_OWNER_COMPANY_ID = "verified-001";

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, items: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(items));
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Consultations ────────────────────────────────────────

export function listConsultationsForUser(
  userId = MOCK_USER_ID,
): ConsultationRequest[] {
  return read<ConsultationRequest>(KEYS.consultations)
    .filter((c) => c.userId === userId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listConsultationsForCompany(
  companyId: string,
): ConsultationRequest[] {
  return read<ConsultationRequest>(KEYS.consultations)
    .filter((c) => c.companyId === companyId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function findConsultation(id: string): ConsultationRequest | undefined {
  return read<ConsultationRequest>(KEYS.consultations).find((c) => c.id === id);
}

type CreateInput = {
  companyId: string;
  projectId?: string;
  title: string;
  message: string;
  budgetWon?: number;
  desiredArea?: string;
  contact?: string;
  requesterName?: string;
};

export function createConsultation(
  input: CreateInput,
  userId = MOCK_USER_ID,
): ConsultationRequest {
  const now = new Date().toISOString();
  const req: ConsultationRequest = {
    id: uid("c"),
    userId,
    companyId: input.companyId,
    projectId: input.projectId,
    title: input.title,
    message: input.message,
    budgetWon: input.budgetWon,
    desiredArea: input.desiredArea,
    contact: input.contact,
    requesterName: input.requesterName,
    status: "REQUESTED",
    createdAt: now,
    updatedAt: now,
  };
  const all = read<ConsultationRequest>(KEYS.consultations);
  all.push(req);
  write(KEYS.consultations, all);

  // 첫 메시지를 사용자 메시지로 자동 생성
  appendMessage(req.id, {
    senderId: userId,
    senderRole: "USER",
    body: input.message,
  });

  return req;
}

export function updateConsultationStatus(
  id: string,
  status: ConsultationStatus,
): ConsultationRequest | undefined {
  const all = read<ConsultationRequest>(KEYS.consultations);
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
  write(KEYS.consultations, all);
  return all[idx];
}

// ─── Messages ─────────────────────────────────────────────

export function listMessages(
  consultationRequestId: string,
): ConsultationMessage[] {
  return read<ConsultationMessage>(KEYS.messages)
    .filter((m) => m.consultationRequestId === consultationRequestId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function appendMessage(
  consultationRequestId: string,
  input: {
    senderId: string;
    senderRole: "USER" | "COMPANY";
    body: string;
  },
): ConsultationMessage {
  const msg: ConsultationMessage = {
    id: uid("m"),
    consultationRequestId,
    senderId: input.senderId,
    senderRole: input.senderRole,
    body: input.body,
    createdAt: new Date().toISOString(),
  };
  const all = read<ConsultationMessage>(KEYS.messages);
  all.push(msg);
  write(KEYS.messages, all);

  // 부모 ConsultationRequest의 updatedAt 갱신
  const reqs = read<ConsultationRequest>(KEYS.consultations);
  const i = reqs.findIndex((c) => c.id === consultationRequestId);
  if (i !== -1) {
    reqs[i] = { ...reqs[i], updatedAt: msg.createdAt };
    // 회사 답변이면 자동으로 REPLIED 처리
    if (input.senderRole === "COMPANY" && reqs[i].status !== "CLOSED") {
      reqs[i].status = "REPLIED";
    }
    write(KEYS.consultations, reqs);

    // 회사가 답변하면 사용자에게 알림
    if (input.senderRole === "COMPANY") {
      pushNotification(reqs[i].userId, {
        type: "CONSULTATION_REPLIED",
        title: "업체에서 답변이 도착했어요",
        body: `상담 "${reqs[i].title}"에 새 답변이 있습니다.`,
        link: `/consultations/${consultationRequestId}`,
      });
    }
  }

  return msg;
}

/** 첫 열람 시 REQUESTED → READ 처리 (owner side 진입 시 호출). */
export function markReadByOwner(consultationRequestId: string) {
  const all = read<ConsultationRequest>(KEYS.consultations);
  const i = all.findIndex((c) => c.id === consultationRequestId);
  if (i === -1) return;
  if (all[i].status === "REQUESTED") {
    all[i] = { ...all[i], status: "READ", updatedAt: new Date().toISOString() };
    write(KEYS.consultations, all);
    pushNotification(all[i].userId, {
      type: "CONSULTATION_READ",
      title: "업체가 상담 요청을 확인했어요",
      body: `상담 "${all[i].title}"이(가) 업체에 의해 열람되었습니다.`,
      link: `/consultations/${consultationRequestId}`,
    });
  }
}

// ─── Notifications ────────────────────────────────────────

export function listNotifications(userId = MOCK_USER_ID): Notification[] {
  return read<Notification>(KEYS.notifications)
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function unreadCount(userId = MOCK_USER_ID): number {
  return listNotifications(userId).filter((n) => !n.readAt).length;
}

export function markAllRead(userId = MOCK_USER_ID) {
  const all = read<Notification>(KEYS.notifications);
  const now = new Date().toISOString();
  const updated = all.map((n) =>
    n.userId === userId && !n.readAt ? { ...n, readAt: now } : n,
  );
  write(KEYS.notifications, updated);
}

export function pushNotification(
  userId: string,
  input: {
    type: Notification["type"];
    title: string;
    body: string;
    link?: string;
  },
) {
  const note: Notification = {
    id: uid("n"),
    userId,
    type: input.type,
    title: input.title,
    body: input.body,
    link: input.link,
    createdAt: new Date().toISOString(),
  };
  const all = read<Notification>(KEYS.notifications);
  all.push(note);
  write(KEYS.notifications, all);
}

// ─── Favorites ────────────────────────────────────────────

type Favorite = { userId: string; companyId: string; createdAt: string };

export function listFavoriteCompanyIds(userId = MOCK_USER_ID): string[] {
  return read<Favorite>(KEYS.favorites)
    .filter((f) => f.userId === userId)
    .map((f) => f.companyId);
}

export function isFavorite(
  companyId: string,
  userId = MOCK_USER_ID,
): boolean {
  return listFavoriteCompanyIds(userId).includes(companyId);
}

export function toggleFavorite(
  companyId: string,
  userId = MOCK_USER_ID,
): boolean {
  const all = read<Favorite>(KEYS.favorites);
  const exists = all.some(
    (f) => f.userId === userId && f.companyId === companyId,
  );
  if (exists) {
    write(
      KEYS.favorites,
      all.filter((f) => !(f.userId === userId && f.companyId === companyId)),
    );
    return false;
  }
  all.push({ userId, companyId, createdAt: new Date().toISOString() });
  write(KEYS.favorites, all);
  return true;
}
