"use client";

import React from "react";

/* =========================================================
   AVATAR DATA
========================================================= */

export type AvatarData = {
  skin: string;
  bodyStyle: number;
  eyeColor: string;
  hairStyle: number;
  hairColor: string;
  glassesStyle: number;
  facialHairStyle: number;
  facialHairColor: string;
  headwearStyle: number;
  headwearColor: string;
  clothingColor: string;
  background: string;
};

/* =========================================================
   DEFAULT AVATAR
========================================================= */

export const defaultAvatar: AvatarData = {
  skin: "#984C25",
  bodyStyle: 0,
  eyeColor: "#3D3D3D",
  hairStyle: 1,
  hairColor: "#75381F",
  glassesStyle: 0,
  facialHairStyle: 0,
  facialHairColor: "#674032",
  headwearStyle: 0,
  headwearColor: "#9368D0",
  clothingColor: "#B27FC1",
  background: "#4F97BA",
};

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "duolingoAvatar";

export function loadAvatar(): AvatarData {
  if (typeof window === "undefined") {
    return defaultAvatar;
  }

  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ||
      localStorage.getItem("avatar");

    if (!raw) {
      return defaultAvatar;
    }

    const parsed = JSON.parse(raw);

    return {
      ...defaultAvatar,
      ...(parsed && typeof parsed === "object" ? parsed : {}),
    };
  } catch (error) {
    console.error("Failed to load avatar:", error);
    return defaultAvatar;
  }
}

export function saveAvatar(avatar: AvatarData) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatar));
  } catch (error) {
    console.error("Failed to save avatar:", error);
  }
}

/* =========================================================
   AVATAR DISPLAY
========================================================= */

type AvatarDisplayProps = {
  avatar: AvatarData;
  size?: "small" | "medium" | "large";
  showBackground?: boolean;
};

export default function AvatarDisplay({
  avatar,
  size = "medium",
  showBackground = true,
}: AvatarDisplayProps) {
  const safeAvatar: AvatarData = {
    ...defaultAvatar,
    ...(avatar || {}),
  };

  const scale =
    size === "small"
      ? 0.55
      : size === "large"
        ? 1
        : 0.78;

  return (
    <div
      className="relative flex items-center justify-center overflow-visible"
      style={{
        width: 360 * scale,
        height: 540 * scale,
      }}
    >
      <div
        className="relative origin-bottom"
        style={{
          width: 360,
          height: 540,
          transform: `scale(${scale})`,
        }}
      >
        {showBackground && (
          <div
            className="absolute inset-0 rounded-[45px]"
            style={{
              backgroundColor: safeAvatar.background,
            }}
          />
        )}

        <AvatarBody avatar={safeAvatar} />
      </div>
    </div>
  );
}

/* =========================================================
   AVATAR BODY
========================================================= */

function AvatarBody({ avatar }: { avatar: AvatarData }) {
  return (
    <div className="relative h-[540px] w-[360px]">
      {/* EARS */}

      <div
        className="absolute left-0 top-[160px] z-10 h-[68px] w-[68px] rounded-full"
        style={{ backgroundColor: avatar.skin }}
      />

      <div
        className="absolute right-0 top-[160px] z-10 h-[68px] w-[68px] rounded-full"
        style={{ backgroundColor: avatar.skin }}
      />

      {/* HEAD */}

      <div
        className="absolute left-[38px] top-[75px] z-20 h-[330px] w-[284px] rounded-[85px]"
        style={{ backgroundColor: avatar.skin }}
      >
        {/* =================================================
            FIXED EYES

            OLD:
            left={72}
            right={72}
            eye width = 72

            Those values made the two eyes overlap by
            approximately 32px.

            NEW:
            left = 48
            right = 48
            eye width = 62

            This gives both eyes their own space and keeps
            them symmetrical.
        ================================================= */}

        <CleanEye
          side="left"
          color={avatar.eyeColor}
        />

        <CleanEye
          side="right"
          color={avatar.eyeColor}
        />

        {/* NOSE */}

        <div className="absolute left-1/2 top-[215px] h-[40px] w-[28px] -translate-x-1/2 rounded-full bg-[#5E3029]" />

        {/* SMILE */}

        <div className="absolute bottom-[67px] left-1/2 h-[25px] w-[65px] -translate-x-1/2 rounded-b-full border-b-[8px] border-[#5E3029]" />

        {/* HAIR */}

        {avatar.hairStyle > 0 && (
          <div
            className={`absolute z-50 ${
              avatar.hairStyle === 1
                ? "left-[-5px] top-[-22px] h-[70px] w-[295px] rounded-t-[90px]"
                : avatar.hairStyle === 2
                  ? "left-[15px] top-[-25px] h-[65px] w-[255px] rounded-t-[70px]"
                  : avatar.hairStyle === 3
                    ? "left-[-20px] top-[45px] h-[110px] w-[65px] rounded-full"
                    : "left-[15px] top-[-18px] h-[65px] w-[260px] rounded-t-[60px]"
            }`}
            style={{
              backgroundColor: avatar.hairColor,
            }}
          />
        )}

        {/* GLASSES */}

        {avatar.glassesStyle > 0 && (
          <div className="absolute left-1/2 top-[160px] z-[55] flex -translate-x-1/2 gap-3">
            <div className="h-[68px] w-[96px] rounded-[24px] border-[7px] border-[#2364AA]" />
            <div className="h-[68px] w-[96px] rounded-[24px] border-[7px] border-[#2364AA]" />
          </div>
        )}

        {/* FACIAL HAIR */}

        {avatar.facialHairStyle > 0 && (
          <div
            className={`absolute bottom-[38px] left-1/2 z-40 -translate-x-1/2 rounded-b-[60px] ${
              avatar.facialHairStyle === 1
                ? "h-[38px] w-[72px]"
                : "h-[65px] w-[130px]"
            }`}
            style={{
              backgroundColor: avatar.facialHairColor,
            }}
          />
        )}

        {/* HEADWEAR */}

        {avatar.headwearStyle > 0 && (
          <>
            <div
              className={`absolute z-[70] ${
                avatar.headwearStyle === 1
                  ? "left-[12px] top-[-45px] h-[75px] w-[260px] rounded-t-[90px]"
                  : avatar.headwearStyle === 2
                    ? "left-[5px] top-[-35px] h-[75px] w-[275px] rounded-t-[80px]"
                    : "left-[30px] top-[-40px] h-[70px] w-[225px] rounded-t-[80px]"
              }`}
              style={{
                backgroundColor: avatar.headwearColor,
              }}
            />

            {avatar.headwearStyle === 2 && (
              <div
                className="absolute left-[-10px] top-[8px] z-[71] h-[15px] w-[305px] rounded-full"
                style={{
                  backgroundColor: avatar.headwearColor,
                }}
              />
            )}
          </>
        )}
      </div>

      {/* NECK */}

      <div
        className="absolute left-[128px] top-[390px] z-10 h-[95px] w-[105px]"
        style={{ backgroundColor: avatar.skin }}
      />

      {/* BODY */}

      <div
        className="absolute bottom-[-20px] left-[25px] h-[245px] w-[310px] rounded-t-[95px]"
        style={{ backgroundColor: avatar.clothingColor }}
      />
    </div>
  );
}

/* =========================================================
   CLEAN EYE

   IMPORTANT:
   The previous implementation used two 72px-wide eyes
   at left/right 72px, causing them to overlap.

   This version uses:
   - 62px white eye
   - 34px iris
   - 20px pupil
   - 48px left/right offsets
   - symmetrical positioning
========================================================= */

function CleanEye({
  side,
  color,
}: {
  side: "left" | "right";
  color: string;
}) {
  return (
    <div
      className={`absolute top-[105px] z-30 flex h-[88px] w-[62px] items-center justify-center rounded-[32px] bg-white ${
        side === "left" ? "left-[48px]" : "right-[48px]"
      }`}
    >
      <div
        className="relative h-[54px] w-[32px] rounded-full"
        style={{ backgroundColor: color }}
      >
        {/* Pupil */}

        <div className="absolute left-1/2 top-[9px] h-[30px] w-[20px] -translate-x-1/2 rounded-full bg-[#171717]" />

        {/* Eye highlight */}

        <div className="absolute left-[7px] top-[7px] h-[9px] w-[9px] rounded-full bg-white" />
      </div>
    </div>
  );
}
