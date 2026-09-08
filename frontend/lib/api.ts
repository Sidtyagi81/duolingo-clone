import { getActiveUser, getBackendUserId } from "./userState";

const API_URL = "http://127.0.0.1:8000";

async function apiFetch(
  url: string,
  options: RequestInit = {},
) {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;

    try {
      const errorData = await response.json();

      if (errorData?.detail) {
        message = String(errorData.detail);
      } else if (errorData?.message) {
        message = String(errorData.message);
      }
    } catch {
      // Keep the HTTP status message.
    }

    throw new Error(message);
  }

  return response.json();
}

function requireBackendUserId(): number {
  const user = getActiveUser();

  if (!user) {
    throw new Error("Please log in first.");
  }

  return getBackendUserId(user);
}

export async function getCourse(courseId: number) {
  return apiFetch(`${API_URL}/courses/${courseId}`);
}

export async function getLesson(lessonId: number) {
  return apiFetch(`${API_URL}/lessons/${lessonId}`);
}

export async function getUnitQuestions(unitId: number) {
  return apiFetch(`${API_URL}/units/${unitId}/questions`);
}

export async function getUserStats(userId?: number) {
  const id = userId ?? requireBackendUserId();
  return apiFetch(`${API_URL}/users/${id}/stats`);
}

export async function getUserProgress(userId?: number) {
  const id = userId ?? requireBackendUserId();
  return apiFetch(`${API_URL}/progress/${id}`);
}

export async function getActivity(userId?: number) {
  const id = userId ?? requireBackendUserId();
  return apiFetch(`${API_URL}/activity/${id}`);
}

export async function getStreak(userId?: number) {
  const id = userId ?? requireBackendUserId();
  return apiFetch(`${API_URL}/activity/${id}/streak`);
}

export async function submitAnswer(
  lessonId: number,
  exerciseId: number,
  answer: string,
) {
  const userId = requireBackendUserId();

  return apiFetch(`${API_URL}/lessons/${lessonId}/answer`, {
    method: "POST",
    body: JSON.stringify({
      user_id: userId,
      exercise_id: exerciseId,
      answer,
    }),
  });
}

export async function completeLesson(
  lessonId: number,
  userId: number | undefined,
  xpEarned = 0,
) {
  const id = userId ?? requireBackendUserId();

  return apiFetch(`${API_URL}/lessons/${lessonId}/complete`, {
    method: "POST",
    body: JSON.stringify({
      user_id: id,
      xp_earned: Math.max(0, Number(xpEarned) || 0),
    }),
  });
}

export async function restoreHearts(userId?: number) {
  const id = userId ?? requireBackendUserId();

  const data = await apiFetch(
    `${API_URL}/lessons/restore-hearts/${id}`,
    { method: "POST" },
  );

  return {
    ...data,
    hearts: Number(
      data?.hearts ?? data?.hearts_remaining ?? 5,
    ),
    gems:
      data?.gems !== undefined
        ? Number(data.gems)
        : undefined,
    streak:
      data?.streak !== undefined
        ? Number(data.streak)
        : undefined,
    xp:
      data?.xp !== undefined
        ? Number(data.xp)
        : data?.total_xp !== undefined
        ? Number(data.total_xp)
        : undefined,
  };
}
