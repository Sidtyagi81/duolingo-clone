import {
  getActiveUser,
  getBackendUserId,
} from "./userState";

/*
 * Backend URL
 *
 * IMPORTANT:
 * In Vercel, set:
 *
 * NEXT_PUBLIC_API_URL=https://duolearn-backend.vercel.app
 *
 * After changing the environment variable, redeploy the frontend.
 */
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://duolearn-backend.vercel.app"
).replace(/\/+$/, "");


/* ============================================================
   COMMON API FETCH
   ============================================================ */

async function apiFetch(
  url: string,
  options: RequestInit = {}
) {
  try {
    const response = await fetch(url, {
      ...options,
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType =
      response.headers.get("content-type") || "";

    let data: any = null;

    if (contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        const text = await response.text();
        data = text || null;
      } catch {
        data = null;
      }
    }

    if (!response.ok) {
      let message = `Request failed: ${response.status}`;

      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          message = data.detail
            .map((item: any) =>
              item?.msg || JSON.stringify(item)
            )
            .join(", ");
        } else {
          message = String(data.detail);
        }
      } else if (data?.message) {
        message = String(data.message);
      } else if (typeof data === "string" && data.trim()) {
        message = data;
      }

      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error("API REQUEST ERROR:", {
      url,
      error,
    });

    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to connect to the backend.");
  }
}


/* ============================================================
   USER ID
   ============================================================ */

function requireBackendUserId(): number {
  const user = getActiveUser();

  if (!user) {
    throw new Error("Please log in first.");
  }

  const backendUserId = Number(
    getBackendUserId(user)
  );

  if (
    !Number.isFinite(backendUserId) ||
    backendUserId <= 0
  ) {
    throw new Error(
      "Invalid backend user ID. Please log in again."
    );
  }

  return backendUserId;
}


/* ============================================================
   COURSE
   ============================================================ */

export async function getCourse(
  courseId: number
) {
  if (!Number.isFinite(courseId) || courseId <= 0) {
    throw new Error("Invalid course ID.");
  }

  return apiFetch(
    `${API_URL}/courses/${courseId}`
  );
}


/* ============================================================
   LESSON
   ============================================================ */

export async function getLesson(
  lessonId: number
) {
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    throw new Error("Invalid lesson ID.");
  }

  return apiFetch(
    `${API_URL}/lessons/${lessonId}`
  );
}


/* ============================================================
   UNIT QUESTIONS
   ============================================================ */

export async function getUnitQuestions(
  unitId: number
) {
  if (!Number.isFinite(unitId) || unitId <= 0) {
    throw new Error("Invalid unit ID.");
  }

  return apiFetch(
    `${API_URL}/units/${unitId}/questions`
  );
}


/* ============================================================
   USER STATS
   ============================================================ */

export async function getUserStats(
  userId?: number
) {
  const id =
    userId ?? requireBackendUserId();

  return apiFetch(
    `${API_URL}/users/${id}/stats`
  );
}


/* ============================================================
   USER PROGRESS
   ============================================================ */

export async function getUserProgress(
  userId?: number
) {
  const id =
    userId ?? requireBackendUserId();

  return apiFetch(
    `${API_URL}/progress/${id}`
  );
}


/* ============================================================
   ACTIVITY
   ============================================================ */

export async function getActivity(
  userId?: number
) {
  const id =
    userId ?? requireBackendUserId();

  return apiFetch(
    `${API_URL}/activity/${id}`
  );
}


/* ============================================================
   STREAK
   ============================================================ */

export async function getStreak(
  userId?: number
) {
  const id =
    userId ?? requireBackendUserId();

  return apiFetch(
    `${API_URL}/activity/${id}/streak`
  );
}


/* ============================================================
   SUBMIT ANSWER
   ============================================================ */

export async function submitAnswer(
  lessonId: number,
  exerciseId: number,
  answer: string
) {
  if (
    !Number.isFinite(lessonId) ||
    lessonId <= 0
  ) {
    throw new Error("Invalid lesson ID.");
  }

  if (
    !Number.isFinite(exerciseId) ||
    exerciseId <= 0
  ) {
    throw new Error("Invalid exercise ID.");
  }

  const cleanAnswer = String(answer ?? "").trim();

  if (!cleanAnswer) {
    throw new Error("Answer cannot be empty.");
  }

  const userId =
    requireBackendUserId();

  console.log("SUBMIT ANSWER:", {
    url: `${API_URL}/lessons/${lessonId}/answer`,
    user_id: userId,
    exercise_id: exerciseId,
    answer: cleanAnswer,
  });

  return apiFetch(
    `${API_URL}/lessons/${lessonId}/answer`,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: userId,
        exercise_id: exerciseId,
        answer: cleanAnswer,
      }),
    }
  );
}


/* ============================================================
   COMPLETE LESSON
   ============================================================ */

export async function completeLesson(
  lessonId: number,
  userId?: number,
  xpEarned = 0
) {
  if (
    !Number.isFinite(lessonId) ||
    lessonId <= 0
  ) {
    throw new Error("Invalid lesson ID.");
  }

  const id =
    userId ?? requireBackendUserId();

  return apiFetch(
    `${API_URL}/lessons/${lessonId}/complete`,
    {
      method: "POST",
      body: JSON.stringify({
        user_id: id,
        xp_earned: Math.max(
          0,
          Number(xpEarned) || 0
        ),
      }),
    }
  );
}


/* ============================================================
   RESTORE HEARTS
   ============================================================ */

export async function restoreHearts(
  userId?: number
) {
  const id =
    userId ?? requireBackendUserId();

  const data = await apiFetch(
    `${API_URL}/lessons/restore-hearts/${id}`,
    {
      method: "POST",
    }
  );

  return {
    ...data,

    hearts: Number(
      data?.hearts ??
      data?.hearts_remaining ??
      5
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
