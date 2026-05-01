/**
 * 상담/관심/알림 통합 스토어.
 *
 * 분기 정책:
 * - Supabase 환경변수 + 로그인된 사용자 → Supabase
 * - 그 외(데모 모드) → localStorage
 *
 * 모든 함수는 비동기.
 */
"use client";

import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
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
export const MOCK_OWNER_COMPANY_ID = "verified-001";

// ─── Auth helper ──────────────────────────────────────────

async function resolveBackend(): Promise<
  | { kind: "supabase"; sb: SupabaseClient; user: User }
  | { kind: "local" }
> {
  const sb = createSupabaseBrowserClient();
  if (!sb) return { kind: "local" };
  try {
    const { data } = await sb.auth.getUser();
    if (!data.user) return { kind: "local" };
    return { kind: "supabase", sb, user: data.user };
  } catch {
    return { kind: "local" };
  }
}

// ─── localStorage helpers ─────────────────────────────────

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
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
}

// ─── Mappers (Supabase row → app shape) ───────────────────

type DbConsultation = {
  id: string;
  user_id: string;
  company_id: string;
  project_id: string | null;
  title: string;
  message: string;
  budget_won: number | null;
  desired_area: string | null;
  contact: string | null;
  requester_name: string | null;
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
};

function mapConsultation(r: DbConsultation): ConsultationRequest {
  return {
    id: r.id,
    userId: r.user_id,
    companyId: r.company_id,
    projectId: r.project_id ?? undefined,
    title: r.title,
    message: r.message,
    budgetWon: r.budget_won ?? undefined,
    desiredArea: r.desired_area ?? undefined,
    contact: r.contact ?? undefined,
    requesterName: r.requester_name ?? undefined,
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

type DbMessage = {
  id: string;
  consultation_request_id: string;
  sender_id: string;
  sender_role: "USER" | "COMPANY";
  body: string;
  read_at: string | null;
  created_at: string;
};

function mapMessage(r: DbMessage): ConsultationMessage {
  return {
    id: r.id,
    consultationRequestId: r.consultation_request_id,
    senderId: r.sender_id,
    senderRole: r.sender_role,
    body: r.body,
    readAt: r.read_at ?? undefined,
    createdAt: r.created_at,
  };
}

type DbNotification = {
  id: string;
  user_id: string;
  type: Notification["type"];
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  created_at: string;
};

function mapNotification(r: DbNotification): Notification {
  return {
    id: r.id,
    userId: r.user_id,
    type: r.type,
    title: r.title,
    body: r.body,
    link: r.link ?? undefined,
    readAt: r.read_at ?? undefined,
    createdAt: r.created_at,
  };
}

// ─── Consultations ────────────────────────────────────────

export async function listConsultationsForUser(): Promise<
  ConsultationRequest[]
> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data } = await b.sb
      .from("consultation_requests")
      .select("*")
      .eq("user_id", b.user.id)
      .order("updated_at", { ascending: false });
    return (data as DbConsultation[] | null)?.map(mapConsultation) ?? [];
  }
  return read<ConsultationRequest>(KEYS.consultations)
    .filter((c) => c.userId === MOCK_USER_ID)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function listConsultationsForCompany(
  companyId: string,
): Promise<ConsultationRequest[]> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data } = await b.sb
      .from("consultation_requests")
      .select("*")
      .eq("company_id", companyId)
      .order("updated_at", { ascending: false });
    return (data as DbConsultation[] | null)?.map(mapConsultation) ?? [];
  }
  return read<ConsultationRequest>(KEYS.consultations)
    .filter((c) => c.companyId === companyId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function findConsultation(
  id: string,
): Promise<ConsultationRequest | undefined> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data } = await b.sb
      .from("consultation_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    return data ? mapConsultation(data as DbConsultation) : undefined;
  }
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

export async function createConsultation(
  input: CreateInput,
): Promise<ConsultationRequest> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const insertRow = {
      user_id: b.user.id,
      company_id: input.companyId,
      project_id: input.projectId ?? null,
      title: input.title,
      message: input.message,
      budget_won: input.budgetWon ?? null,
      desired_area: input.desiredArea ?? null,
      contact: input.contact ?? null,
      requester_name: input.requesterName ?? null,
    };
    const { data, error } = await b.sb
      .from("consultation_requests")
      .insert(insertRow)
      .select()
      .single();
    if (error || !data) throw error ?? new Error("create failed");
    const created = mapConsultation(data as DbConsultation);

    // 첫 메시지를 사용자 메시지로 저장
    await b.sb.from("consultation_messages").insert({
      consultation_request_id: created.id,
      sender_id: b.user.id,
      sender_role: "USER",
      body: input.message,
    });
    return created;
  }

  // localStorage path
  const now = new Date().toISOString();
  const req: ConsultationRequest = {
    id: uid("c"),
    userId: MOCK_USER_ID,
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
  await appendMessage(req.id, {
    senderId: MOCK_USER_ID,
    senderRole: "USER",
    body: input.message,
  });
  return req;
}

export async function updateConsultationStatus(
  id: string,
  status: ConsultationStatus,
): Promise<void> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    await b.sb
      .from("consultation_requests")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    return;
  }
  const all = read<ConsultationRequest>(KEYS.consultations);
  const idx = all.findIndex((c) => c.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], status, updatedAt: new Date().toISOString() };
  write(KEYS.consultations, all);
}

// ─── Messages ─────────────────────────────────────────────

export async function listMessages(
  consultationRequestId: string,
): Promise<ConsultationMessage[]> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data } = await b.sb
      .from("consultation_messages")
      .select("*")
      .eq("consultation_request_id", consultationRequestId)
      .order("created_at", { ascending: true });
    return (data as DbMessage[] | null)?.map(mapMessage) ?? [];
  }
  return read<ConsultationMessage>(KEYS.messages)
    .filter((m) => m.consultationRequestId === consultationRequestId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

type AppendMsgInput = {
  senderId: string;
  senderRole: "USER" | "COMPANY";
  body: string;
};

export async function appendMessage(
  consultationRequestId: string,
  input: AppendMsgInput,
): Promise<ConsultationMessage> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data, error } = await b.sb
      .from("consultation_messages")
      .insert({
        consultation_request_id: consultationRequestId,
        sender_id: b.user.id,
        sender_role: input.senderRole,
        body: input.body,
      })
      .select()
      .single();
    if (error || !data) throw error ?? new Error("append failed");

    // 회사 답변이면 부모 status도 REPLIED + 사용자 알림
    if (input.senderRole === "COMPANY") {
      // 부모 조회 후 사용자 id 찾기
      const { data: parent } = await b.sb
        .from("consultation_requests")
        .select("user_id, title, status")
        .eq("id", consultationRequestId)
        .single();
      if (parent && parent.status !== "CLOSED") {
        await b.sb
          .from("consultation_requests")
          .update({ status: "REPLIED", updated_at: new Date().toISOString() })
          .eq("id", consultationRequestId);
        await pushNotification(parent.user_id, {
          type: "CONSULTATION_REPLIED",
          title: "업체에서 답변이 도착했어요",
          body: `상담 "${parent.title}"에 새 답변이 있습니다.`,
          link: `/consultations/${consultationRequestId}`,
        });
      }
    } else {
      await b.sb
        .from("consultation_requests")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", consultationRequestId);
    }
    return mapMessage(data as DbMessage);
  }

  // localStorage
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

  const reqs = read<ConsultationRequest>(KEYS.consultations);
  const i = reqs.findIndex((c) => c.id === consultationRequestId);
  if (i !== -1) {
    reqs[i] = { ...reqs[i], updatedAt: msg.createdAt };
    if (input.senderRole === "COMPANY" && reqs[i].status !== "CLOSED") {
      reqs[i].status = "REPLIED";
    }
    write(KEYS.consultations, reqs);
    if (input.senderRole === "COMPANY") {
      await pushNotification(reqs[i].userId, {
        type: "CONSULTATION_REPLIED",
        title: "업체에서 답변이 도착했어요",
        body: `상담 "${reqs[i].title}"에 새 답변이 있습니다.`,
        link: `/consultations/${consultationRequestId}`,
      });
    }
  }
  return msg;
}

export async function markReadByOwner(
  consultationRequestId: string,
): Promise<void> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data: parent } = await b.sb
      .from("consultation_requests")
      .select("user_id, title, status")
      .eq("id", consultationRequestId)
      .single();
    if (!parent || parent.status !== "REQUESTED") return;
    await b.sb
      .from("consultation_requests")
      .update({ status: "READ", updated_at: new Date().toISOString() })
      .eq("id", consultationRequestId);
    await pushNotification(parent.user_id, {
      type: "CONSULTATION_READ",
      title: "업체가 상담 요청을 확인했어요",
      body: `상담 "${parent.title}"이(가) 업체에 의해 열람되었습니다.`,
      link: `/consultations/${consultationRequestId}`,
    });
    return;
  }
  const all = read<ConsultationRequest>(KEYS.consultations);
  const i = all.findIndex((c) => c.id === consultationRequestId);
  if (i === -1) return;
  if (all[i].status === "REQUESTED") {
    all[i] = { ...all[i], status: "READ", updatedAt: new Date().toISOString() };
    write(KEYS.consultations, all);
    await pushNotification(all[i].userId, {
      type: "CONSULTATION_READ",
      title: "업체가 상담 요청을 확인했어요",
      body: `상담 "${all[i].title}"이(가) 업체에 의해 열람되었습니다.`,
      link: `/consultations/${consultationRequestId}`,
    });
  }
}

// ─── Notifications ────────────────────────────────────────

export async function listNotifications(): Promise<Notification[]> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data } = await b.sb
      .from("notifications")
      .select("*")
      .eq("user_id", b.user.id)
      .order("created_at", { ascending: false });
    return (data as DbNotification[] | null)?.map(mapNotification) ?? [];
  }
  return read<Notification>(KEYS.notifications)
    .filter((n) => n.userId === MOCK_USER_ID)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function unreadCount(): Promise<number> {
  const list = await listNotifications();
  return list.filter((n) => !n.readAt).length;
}

export async function markAllRead(): Promise<void> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    await b.sb
      .from("notifications")
      .update({ read_at: new Date().toISOString() })
      .eq("user_id", b.user.id)
      .is("read_at", null);
    return;
  }
  const all = read<Notification>(KEYS.notifications);
  const now = new Date().toISOString();
  const updated = all.map((n) =>
    n.userId === MOCK_USER_ID && !n.readAt ? { ...n, readAt: now } : n,
  );
  write(KEYS.notifications, updated);
}

export async function pushNotification(
  userId: string,
  input: {
    type: Notification["type"];
    title: string;
    body: string;
    link?: string;
  },
): Promise<void> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    // RLS: 본인 알림만 insert 가능. 다른 사용자에게 push할 땐 server-side function이 필요.
    // 데모 단계: 본인=현재 user인 경우만 insert, 그 외는 무시.
    if (userId === b.user.id) {
      await b.sb.from("notifications").insert({
        user_id: userId,
        type: input.type,
        title: input.title,
        body: input.body,
        link: input.link ?? null,
      });
    }
    return;
  }
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

export async function listFavoriteCompanyIds(): Promise<string[]> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data } = await b.sb
      .from("favorite_companies")
      .select("company_id")
      .eq("user_id", b.user.id);
    return (data as { company_id: string }[] | null)?.map((r) => r.company_id) ?? [];
  }
  return read<Favorite>(KEYS.favorites)
    .filter((f) => f.userId === MOCK_USER_ID)
    .map((f) => f.companyId);
}

export async function isFavorite(companyId: string): Promise<boolean> {
  const ids = await listFavoriteCompanyIds();
  return ids.includes(companyId);
}

export async function toggleFavorite(companyId: string): Promise<boolean> {
  const b = await resolveBackend();
  if (b.kind === "supabase") {
    const { data: existing } = await b.sb
      .from("favorite_companies")
      .select("company_id")
      .eq("user_id", b.user.id)
      .eq("company_id", companyId)
      .maybeSingle();
    if (existing) {
      await b.sb
        .from("favorite_companies")
        .delete()
        .eq("user_id", b.user.id)
        .eq("company_id", companyId);
      return false;
    }
    await b.sb
      .from("favorite_companies")
      .insert({ user_id: b.user.id, company_id: companyId });
    return true;
  }
  const all = read<Favorite>(KEYS.favorites);
  const exists = all.some(
    (f) => f.userId === MOCK_USER_ID && f.companyId === companyId,
  );
  if (exists) {
    write(
      KEYS.favorites,
      all.filter(
        (f) => !(f.userId === MOCK_USER_ID && f.companyId === companyId),
      ),
    );
    return false;
  }
  all.push({
    userId: MOCK_USER_ID,
    companyId,
    createdAt: new Date().toISOString(),
  });
  write(KEYS.favorites, all);
  return true;
}
