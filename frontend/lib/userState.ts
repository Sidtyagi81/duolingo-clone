export type DuolearnUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  hearts: number;
  gems: number;
  streak: number;
  xp: number;
  currentLesson: number;
  joinedDate: string;
};

const USERS_KEY = "duolearn_users";
const ACTIVE_USER_KEY = "duolearn_active_user";

function getUsers(): DuolearnUser[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: DuolearnUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getActiveUser(): DuolearnUser | null {
  if (typeof window === "undefined") return null;

  const email = localStorage.getItem(ACTIVE_USER_KEY);
  if (!email) return null;

  const users = getUsers();

  return (
    users.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase(),
    ) ?? null
  );
}

export function getAllUsers(): DuolearnUser[] {
  return getUsers();
}

export function createUser(
  name: string,
  email: string,
  password: string,
): DuolearnUser {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existing = users.find(
    (user) => user.email.toLowerCase() === normalizedEmail,
  );

  if (existing) {
    throw new Error("ACCOUNT_EXISTS");
  }

  const newUser: DuolearnUser = {
    id: crypto.randomUUID(),
    name: name.trim() || "Learner",
    email: normalizedEmail,
    password,
    hearts: 5,
    gems: 100,
    streak: 0,
    xp: 0,
    currentLesson: 1,
    joinedDate: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

export function loginUser(
  emailOrUsername: string,
  password: string,
): DuolearnUser | null {
  const users = getUsers();
  const value = emailOrUsername.trim().toLowerCase();

  const user = users.find(
    (item) =>
      item.email.toLowerCase() === value ||
      item.name.toLowerCase() === value,
  );

  if (!user || user.password !== password) {
    return null;
  }

  localStorage.setItem(ACTIVE_USER_KEY, user.email);
  window.dispatchEvent(new Event("duolearn:login"));

  return user;
}

export function logoutUser() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(ACTIVE_USER_KEY);
  window.dispatchEvent(new Event("duolearn:logout"));
}

/**
 * Stable numeric ID used by the FastAPI database.
 *
 * The browser account uses a UUID, while the existing FastAPI
 * UserStats table expects an integer user_id. We therefore derive
 * the SAME positive integer from the account email every time.
 * Different accounts get different IDs in normal use, and the ID
 * never changes when the user logs out and back in.
 */
export function getBackendUserId(
  user?: DuolearnUser | null,
): number {
  const active = user ?? getActiveUser();

  if (!active) return 1;

  const value = active.email.trim().toLowerCase();

  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  // Keep it inside a signed 32-bit positive integer range.
  let id = hash >>> 0;
  id = id % 2147483646;
  id = id + 2;

  // Never use the old default account ID 1.
  if (id === 1) id = 2;

  return id;
}

export function updateActiveUser(
  changes: Partial<DuolearnUser>,
): DuolearnUser | null {
  const active = getActiveUser();
  if (!active) return null;

  const users = getUsers();
  const index = users.findIndex((user) => user.id === active.id);

  if (index === -1) return null;

  users[index] = {
    ...users[index],
    ...changes,
  };

  saveUsers(users);

  window.dispatchEvent(
    new CustomEvent("duolearn:stats-updated", {
      detail: {
        hearts: users[index].hearts,
        gems: users[index].gems,
        streak: users[index].streak,
        total_xp: users[index].xp,
      },
    }),
  );

  return users[index];
}

export function updateUserStats(
  changes: Partial<
    Pick<DuolearnUser, "hearts" | "gems" | "streak" | "xp">
  >,
) {
  return updateActiveUser(changes);
}

export function saveCurrentLesson(lessonId: number) {
  return updateActiveUser({
    currentLesson: Math.max(1, Number(lessonId) || 1),
  });
}

export function getCurrentLesson(): number {
  const user = getActiveUser();
  if (!user) return 1;

  return Math.max(1, Number(user.currentLesson) || 1);
}
