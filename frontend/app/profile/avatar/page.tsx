"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  useRouter,
} from "next/navigation";

import {
  AvatarData,
  defaultAvatar,
  loadAvatar,
  saveAvatar,
} from "@/components/AvatarDisplay";

/* =========================================================
   COLORS
========================================================= */

const skinTones = [
  "#78423E",
  "#854D43",
  "#984C25",
  "#A25640",
  "#A7662E",
  "#A96749",
  "#B86D43",
  "#C4755B",
  "#E08C6E",
  "#E8A064",
  "#F19A7B",
  "#FFB39A",
  "#FFC4B6",
  "#FFCAA0",
  "#FFE0D5",
];

const eyeColors = [
  "#3D3D3D",
  "#B94B05",
  "#9D7900",
  "#4C9700",
  "#128C95",
  "#0786C9",
  "#8094AF",
  "#9358E8",
  "#C821CF",
  "#F04AB1",
  "#F02E32",
  "#F28700",
  "#F4B000",
];

const hairColors = [
  "#444444",
  "#5B392B",
  "#6D2C2F",
  "#75381F",
  "#A74444",
  "#9A7F78",
  "#BF6C1D",
  "#C95F49",
  "#F1A956",
  "#FFDBB8",
  "#E1DDD7",
  "#EFF2F3",
  "#F58CC4",
  "#985DF0",
  "#4188D8",
  "#27987A",
];

const clothingColors = [
  "#B27FC1",
  "#4CA3CB",
  "#7DB536",
  "#F5D13E",
  "#F3A13F",
  "#C13B68",
  "#F4BDD3",
  "#EDEFF0",
  "#444444",
];

const backgrounds = [
  "#E8E8E8",
  "#B3B3B3",
  "#4F4F4F",
  "#F0DEFA",
  "#D8ACF2",
  "#9368D0",
  "#B8E3F7",
  "#7FD0F0",
  "#3268AC",
  "#C4F2E0",
  "#50DDAE",
  "#46B28B",
  "#D0FFB5",
  "#B5ED86",
  "#7BB84B",
  "#FFF2A8",
  "#FFD07F",
  "#E5A354",
  "#FFE0E0",
  "#FFAEB2",
  "#E65D62",
  "#F7C9ED",
  "#F09BD0",
  "#CB58A2",
];

const facialHairColors = [
  "#444444",
  "#674032",
  "#632713",
  "#74302F",
  "#80645E",
  "#A94E10",
  "#F29B48",
  "#FFD1A5",
  "#D6CEC5",
  "#E7ECEE",
  "#7541F4",
  "#326CC4",
  "#15815E",
];

const headwearColors = [
  "#9368D0",
  "#098AC0",
  "#4EA800",
  "#FFC800",
  "#FF9600",
  "#CC0038",
  "#F4A8D7",
  "#E9EEEE",
  "#595959",
];

/* =========================================================
   TABS
========================================================= */

const tabs = [
  {
    id: "skin",
    icon: "◯",
    label: "Skin",
  },
  {
    id: "body",
    icon: "♙",
    label: "Body",
  },
  {
    id: "eyes",
    icon: "◉",
    label: "Eyes",
  },
  {
    id: "hair",
    icon: "⌁",
    label: "Hair",
  },
  {
    id: "glasses",
    icon: "♧",
    label: "Glasses",
  },
  {
    id: "facial",
    icon: "〰",
    label: "Facial Hair",
  },
  {
    id: "headwear",
    icon: "♙",
    label: "Headwear",
  },
  {
    id: "clothing",
    icon: "♢",
    label: "Clothing",
  },
  {
    id: "background",
    icon: "▧",
    label: "Background",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function AvatarPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] =
    useState("skin");

  const [avatar, setAvatar] =
    useState<AvatarData>(defaultAvatar);

  // Load the previously saved avatar when the editor opens.
  useEffect(() => {
    setAvatar(loadAvatar());
  }, []);

  function updateAvatar(
    key: keyof AvatarData,
    value: string | number
  ) {
    setAvatar((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleDone() {
    saveAvatar(avatar);

    router.push("/profile");

    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#101F24] text-white">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="flex h-[105px] items-center px-5 sm:px-8 lg:px-10">
        <Link
          href="/profile"
          className="mr-5 flex h-14 w-14 items-center justify-center rounded-full hover:bg-[#1C3037]"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M25 8L13 20L25 32"
              stroke="#60757D"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M14 20H34"
              stroke="#60757D"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        </Link>

        <h1 className="text-[30px] font-black text-[#60757D] sm:text-[36px]">
          Create Avatar
        </h1>
      </header>

      {/* =================================================
          EDITOR
      ================================================= */}

      <main className="px-3 pb-8 sm:px-5">
        <div className="mx-auto grid max-w-[1500px] overflow-hidden rounded-[22px] border-[3px] border-[#3A4D55] lg:grid-cols-[46%_54%]">
          {/* =================================================
              PREVIEW
          ================================================= */}

          <section
            className="flex min-h-[650px] items-center justify-center overflow-hidden border-b-[3px] border-[#3A4D55] lg:min-h-[760px] lg:border-b-0 lg:border-r-[3px]"
            style={{
              backgroundColor:
                avatar.background,
            }}
          >
            <div className="scale-100">
              <AvatarPreview
                avatar={avatar}
              />
            </div>
          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <section className="bg-[#101F24]">
            {/* TABS */}

            <div className="flex h-[105px] overflow-x-auto border-b-[3px] border-[#344850]">
              {tabs.map((tab) => {
                const active =
                  activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setActiveTab(tab.id)
                    }
                    title={tab.label}
                    className={`relative flex min-w-[85px] flex-1 items-center justify-center text-[35px] ${
                      active
                        ? "text-[#35BDF5]"
                        : "text-[#536870]"
                    }`}
                  >
                    {tab.icon}

                    {active && (
                      <div className="absolute bottom-[-3px] left-0 right-0 h-[4px] bg-[#35BDF5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CONTROLS */}

            <div className="max-h-[655px] overflow-y-auto p-7 sm:p-10">
              {activeTab === "skin" && (
                <ColorPanel
                  title="Skin tone"
                  colors={skinTones}
                  selected={avatar.skin}
                  onSelect={(value) =>
                    updateAvatar(
                      "skin",
                      value
                    )
                  }
                />
              )}

              {activeTab === "body" && (
                <StylePanel
                  title="Body"
                  selected={avatar.bodyStyle}
                  onSelect={(value) =>
                    updateAvatar(
                      "bodyStyle",
                      value
                    )
                  }
                  skin={avatar.skin}
                  clothing={
                    avatar.clothingColor
                  }
                />
              )}

              {activeTab === "eyes" && (
                <>
                  <ColorPanel
                    title="Eye color"
                    colors={eyeColors}
                    selected={
                      avatar.eyeColor
                    }
                    onSelect={(value) =>
                      updateAvatar(
                        "eyeColor",
                        value
                      )
                    }
                  />

                  <div className="mt-12">
                    <h2 className="mb-6 text-[27px] font-black">
                      Expression
                    </h2>

                    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                      {[0, 1, 2, 3, 4, 5].map(
                        (item) => (
                          <div
                            key={item}
                            className="flex h-[165px] items-center justify-center rounded-[18px] border-[3px] border-[#344850] bg-[#101F24]"
                          >
                            <div className="scale-[0.6]">
                              <ExpressionPreview
                                eyeColor={
                                  avatar.eyeColor
                                }
                                expression={
                                  item
                                }
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeTab === "hair" && (
                <>
                  <ColorPanel
                    title="Main hair color"
                    colors={hairColors}
                    selected={
                      avatar.hairColor
                    }
                    onSelect={(value) =>
                      updateAvatar(
                        "hairColor",
                        value
                      )
                    }
                  />

                  <div className="mt-12">
                    <StylePanel
                      title="Hairstyle"
                      selected={
                        avatar.hairStyle
                      }
                      onSelect={(value) =>
                        updateAvatar(
                          "hairStyle",
                          value
                        )
                      }
                      skin={avatar.skin}
                      clothing={
                        avatar.clothingColor
                      }
                      hairColor={
                        avatar.hairColor
                      }
                    />
                  </div>
                </>
              )}

              {activeTab === "glasses" && (
                <>
                  <ColorPanel
                    title="Glasses color"
                    colors={[
                      "#9368D0",
                      "#225EA8",
                      "#638B2D",
                      "#EF8500",
                      "#FF4D52",
                      "#F08DC6",
                      "#E9D7C8",
                      "#444444",
                    ]}
                    selected="#225EA8"
                    onSelect={() => {}}
                  />

                  <div className="mt-12">
                    <StyleOnlyPanel
                      title="Glasses"
                      selected={
                        avatar.glassesStyle
                      }
                      onSelect={(value) =>
                        updateAvatar(
                          "glassesStyle",
                          value
                        )
                      }
                    />
                  </div>
                </>
              )}

              {activeTab === "facial" && (
                <>
                  <ColorPanel
                    title="Facial hair color"
                    colors={
                      facialHairColors
                    }
                    selected={
                      avatar.facialHairColor
                    }
                    onSelect={(value) =>
                      updateAvatar(
                        "facialHairColor",
                        value
                      )
                    }
                  />

                  <div className="mt-12">
                    <StyleOnlyPanel
                      title="Facial hair"
                      selected={
                        avatar.facialHairStyle
                      }
                      onSelect={(value) =>
                        updateAvatar(
                          "facialHairStyle",
                          value
                        )
                      }
                    />
                  </div>
                </>
              )}

              {activeTab === "headwear" && (
                <>
                  <ColorPanel
                    title="Headwear color"
                    colors={
                      headwearColors
                    }
                    selected={
                      avatar.headwearColor
                    }
                    onSelect={(value) =>
                      updateAvatar(
                        "headwearColor",
                        value
                      )
                    }
                  />

                  <div className="mt-12">
                    <StyleOnlyPanel
                      title="Headwear"
                      selected={
                        avatar.headwearStyle
                      }
                      onSelect={(value) =>
                        updateAvatar(
                          "headwearStyle",
                          value
                        )
                      }
                    />
                  </div>
                </>
              )}

              {activeTab === "clothing" && (
                <ColorPanel
                  title="Clothing color"
                  colors={
                    clothingColors
                  }
                  selected={
                    avatar.clothingColor
                  }
                  onSelect={(value) =>
                    updateAvatar(
                      "clothingColor",
                      value
                    )
                  }
                />
              )}

              {activeTab === "background" && (
                <ColorPanel
                  title="Background color"
                  colors={backgrounds}
                  selected={
                    avatar.background
                  }
                  onSelect={(value) =>
                    updateAvatar(
                      "background",
                      value
                    )
                  }
                />
              )}
            </div>
          </section>
        </div>

        {/* =================================================
            DONE
        ================================================= */}

        <div className="mx-auto flex max-w-[1500px] justify-end pt-7">
          <button
            type="button"
            onClick={handleDone}
            className="flex h-[64px] min-w-[205px] items-center justify-center rounded-[18px] border-b-[5px] border-[#46A800] bg-[#58CC02] px-10 text-[20px] font-black text-white transition hover:bg-[#61D50B] active:translate-y-[2px] active:border-b-[3px]"
          >
            DONE
          </button>
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   COLOR PANEL
========================================================= */

function ColorPanel({
  title,
  colors,
  selected,
  onSelect,
}: {
  title: string;
  colors: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div>
      <h2 className="mb-7 text-[27px] font-black">
        {title}
      </h2>

      <div className="grid grid-cols-4 gap-4 sm:grid-cols-6">
        {colors.map((color, index) => {
          const active =
            selected === color;

          return (
            <button
              key={`${color}-${index}`}
              onClick={() =>
                onSelect(color)
              }
              className={`flex h-[82px] w-[82px] items-center justify-center rounded-[18px] border-[3px] ${
                active
                  ? "border-[#35BDF5] bg-[#20343C]"
                  : "border-[#344850] bg-[#101F24]"
              }`}
            >
              <span
                className="h-[58px] w-[58px] rounded-[12px]"
                style={{
                  backgroundColor:
                    color,
                }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   STYLE PANEL
========================================================= */

function StylePanel({
  title,
  selected,
  onSelect,
  skin,
  clothing,
  hairColor,
}: {
  title: string;
  selected: number;
  onSelect: (value: number) => void;
  skin: string;
  clothing: string;
  hairColor?: string;
}) {
  return (
    <div>
      <h2 className="mb-7 text-[27px] font-black">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                onSelect(item)
              }
              className={`flex h-[190px] items-center justify-center overflow-hidden rounded-[18px] border-[3px] ${
                selected === item
                  ? "border-[#35BDF5] bg-[#20343C]"
                  : "border-[#344850] bg-[#101F24]"
              }`}
            >
              <MiniStylePreview
                type={title}
                skin={skin}
                clothing={clothing}
                hairColor={
                  hairColor
                }
                style={item}
              />
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   STYLE ONLY
========================================================= */

function StyleOnlyPanel({
  title,
  selected,
  onSelect,
}: {
  title: string;
  selected: number;
  onSelect: (value: number) => void;
}) {
  return (
    <div>
      <h2 className="mb-7 text-[27px] font-black">
        {title}
      </h2>

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map(
          (item) => (
            <button
              key={item}
              onClick={() =>
                onSelect(item)
              }
              className={`flex h-[180px] items-center justify-center rounded-[18px] border-[3px] ${
                selected === item
                  ? "border-[#35BDF5] bg-[#20343C]"
                  : "border-[#344850] bg-[#101F24]"
              }`}
            >
              <div className="text-5xl">
                {title === "Glasses"
                  ? item === 0
                    ? "👀"
                    : "👓"
                  : title ===
                      "Facial hair"
                    ? item === 0
                      ? "🙂"
                      : item === 1
                        ? "🧔"
                        : "🧔🏻"
                    : item === 0
                      ? "🙂"
                      : "🧢"}
              </div>
            </button>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   AVATAR PREVIEW
========================================================= */

function AvatarPreview({
  avatar,
}: {
  avatar: AvatarData;
}) {
  return (
    <div
      className="relative flex h-[570px] w-[390px] items-end justify-center"
    >
      <div
        className="absolute bottom-0 left-1/2 flex h-[540px] w-[360px] -translate-x-1/2 items-end justify-center"
      >
        <AvatarBodyPreview avatar={avatar} />
      </div>
    </div>
  );
}

/* =========================================================
   BIG AVATAR BODY
========================================================= */

function AvatarBodyPreview({
  avatar,
}: {
  avatar: AvatarData;
}) {
  return (
    <div className="relative h-[540px] w-[360px]">
      {/* EARS */}

      <div
        className="absolute left-[0px] top-[160px] z-10 h-[68px] w-[68px] rounded-full"
        style={{
          backgroundColor:
            avatar.skin,
        }}
      />

      <div
        className="absolute right-[0px] top-[160px] z-10 h-[68px] w-[68px] rounded-full"
        style={{
          backgroundColor:
            avatar.skin,
        }}
      />

      {/* HEAD */}

      <div
        className="absolute left-[38px] top-[75px] z-20 h-[330px] w-[284px] rounded-[85px]"
        style={{
          backgroundColor:
            avatar.skin,
        }}
      >
        {/* EYES */}

        <BigEye
          left={72}
          color={avatar.eyeColor}
        />

        <BigEye
          right={72}
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
              backgroundColor:
                avatar.hairColor,
            }}
          />
        )}

        {/* GLASSES */}

        {avatar.glassesStyle > 0 && (
          <div className="absolute left-1/2 top-[160px] z-[55] flex -translate-x-1/2 gap-1">
            <div className="h-[68px] w-[100px] rounded-[24px] border-[7px] border-[#2364AA]" />
            <div className="h-[68px] w-[100px] rounded-[24px] border-[7px] border-[#2364AA]" />
          </div>
        )}

        {/* FACIAL HAIR */}

        {avatar.facialHairStyle > 0 && (
          <div
            className={`absolute bottom-[38px] left-1/2 z-40 -translate-x-1/2 rounded-b-[60px] ${
              avatar.facialHairStyle ===
              1
                ? "h-[38px] w-[72px]"
                : "h-[65px] w-[130px]"
            }`}
            style={{
              backgroundColor:
                avatar.facialHairColor,
            }}
          />
        )}

        {/* HEADWEAR */}

        {avatar.headwearStyle > 0 && (
          <>
            <div
              className={`absolute z-[70] ${
                avatar.headwearStyle ===
                1
                  ? "left-[12px] top-[-45px] h-[75px] w-[260px] rounded-t-[90px]"
                  : avatar.headwearStyle ===
                      2
                    ? "left-[5px] top-[-35px] h-[75px] w-[275px] rounded-t-[80px]"
                    : "left-[30px] top-[-40px] h-[70px] w-[225px] rounded-t-[80px]"
              }`}
              style={{
                backgroundColor:
                  avatar.headwearColor,
              }}
            />

            {avatar.headwearStyle ===
              2 && (
              <div
                className="absolute left-[-10px] top-[8px] z-[71] h-[15px] w-[305px] rounded-full"
                style={{
                  backgroundColor:
                    avatar.headwearColor,
                }}
              />
            )}
          </>
        )}
      </div>

      {/* NECK */}

      <div
        className="absolute left-[128px] top-[390px] z-10 h-[95px] w-[105px]"
        style={{
          backgroundColor:
            avatar.skin,
        }}
      />

      {/* BODY */}

      <div
        className="absolute bottom-[-20px] left-[25px] h-[245px] w-[310px] rounded-t-[95px]"
        style={{
          backgroundColor:
            avatar.clothingColor,
        }}
      />
    </div>
  );
}

/* =========================================================
   BIG EYE
========================================================= */

function BigEye({
  left,
  right,
  color,
}: {
  left?: number;
  right?: number;
  color: string;
}) {
  return (
    <div
      className="absolute top-[95px] flex h-[100px] w-[72px] items-center justify-center rounded-[40px] bg-white"
      style={{
        left,
        right,
      }}
    >
      <div
        className="relative h-[58px] w-[32px] rounded-full"
        style={{
          backgroundColor: color,
        }}
      >
        <div className="absolute left-[5px] top-[5px] h-[10px] w-[10px] rounded-full bg-white" />
      </div>
    </div>
  );
}

/* =========================================================
   MINI STYLE PREVIEW
========================================================= */

function MiniStylePreview({
  type,
  skin,
  clothing,
  hairColor,
  style,
}: {
  type: string;
  skin: string;
  clothing: string;
  hairColor?: string;
  style: number;
}) {
  return (
    <div className="relative h-[150px] w-[125px]">
      <div
        className="absolute left-[23px] top-[25px] h-[75px] w-[80px] rounded-[28px]"
        style={{
          backgroundColor: skin,
        }}
      />

      <div
        className="absolute bottom-[-5px] left-[22px] h-[70px] w-[82px] rounded-t-[30px]"
        style={{
          backgroundColor:
            clothing,
        }}
      />

      <div
        className={`absolute z-20 ${
          style === 1
            ? "left-[12px] top-[15px] h-[28px] w-[100px] rounded-t-full"
            : style === 2
              ? "left-[22px] top-[8px] h-[35px] w-[80px] rounded-t-full"
              : style === 3
                ? "left-[10px] top-[30px] h-[60px] w-[20px] rounded-full"
                : "left-[18px] top-[15px] h-[28px] w-[90px] rounded-t-full"
        }`}
        style={{
          backgroundColor:
            hairColor || skin,
        }}
      />
    </div>
  );
}

/* =========================================================
   EXPRESSION
========================================================= */

function ExpressionPreview({
  eyeColor,
  expression,
}: {
  eyeColor: string;
  expression: number;
}) {
  return (
    <div className="relative h-[170px] w-[150px]">
      <div className="absolute left-[20px] top-[20px] h-[125px] w-[110px] rounded-[35px] bg-[#78423E]" />

      <div className="absolute left-[42px] top-[48px] h-[38px] w-[28px] rounded-full bg-white">
        <div
          className="mx-auto mt-[8px] h-[20px] w-[12px] rounded-full"
          style={{
            backgroundColor:
              eyeColor,
          }}
        />
      </div>

      <div className="absolute right-[42px] top-[48px] h-[38px] w-[28px] rounded-full bg-white">
        <div
          className="mx-auto mt-[8px] h-[20px] w-[12px] rounded-full"
          style={{
            backgroundColor:
              eyeColor,
          }}
        />
      </div>

      <div className="absolute left-1/2 top-[90px] h-[14px] w-[10px] -translate-x-1/2 rounded-full bg-[#5E3029]" />

      <div className="absolute bottom-[30px] left-1/2 h-[12px] w-[40px] -translate-x-1/2 rounded-b-full border-b-4 border-[#5E3029]" />
    </div>
  );
}