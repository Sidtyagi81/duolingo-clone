"use client";

import Link from "next/link";

export default function Homepage() {
  return (
    <main className="fixed inset-0 z-[9999] min-h-screen overflow-y-auto bg-white text-[#4B4B4B]">
      <style jsx global>{`
        @keyframes owlFloat {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-14px) rotate(-2deg);
          }
        }

        @keyframes characterFloat {
          0%, 100% {
            transform: translateY(0) rotate(-25deg);
          }
          50% {
            transform: translateY(-16px) rotate(-20deg);
          }
        }

        @keyframes characterFloatRight {
          0%, 100% {
            transform: translateY(0) rotate(18deg);
          }
          50% {
            transform: translateY(-14px) rotate(23deg);
          }
        }

        @keyframes characterFloatThird {
          0%, 100% {
            transform: translateY(0) rotate(15deg);
          }
          50% {
            transform: translateY(-18px) rotate(10deg);
          }
        }

        @keyframes coinsBounce {
          0%, 100% {
            transform: translateY(0) rotate(-8deg);
          }
          50% {
            transform: translateY(-12px) rotate(-3deg);
          }
        }

        @keyframes birdFly {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          50% {
            transform: translate(-18px, -15px) rotate(-8deg);
          }
        }

        @keyframes circlePulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.025);
          }
        }

        @keyframes blink {
          0%, 42%, 48%, 100% {
            transform: scaleY(1);
          }
          45% {
            transform: scaleY(0.08);
          }
        }

        .duolearn-owl {
          animation: owlFloat 3.2s ease-in-out infinite;
          transform-origin: center bottom;
        }

        .duolearn-circle {
          animation: circlePulse 4s ease-in-out infinite;
          transform-origin: center;
        }

        .duolearn-eye {
          animation: blink 4.5s ease-in-out infinite;
          transform-origin: center;
        }

        .duolearn-character-one {
          animation: characterFloat 3s ease-in-out infinite;
        }

        .duolearn-character-two {
          animation: characterFloatRight 3.4s ease-in-out infinite;
        }

        .duolearn-character-three {
          animation: characterFloatThird 3.2s ease-in-out infinite;
        }

        .duolearn-coins {
          animation: coinsBounce 2.4s ease-in-out infinite;
        }

        .duolearn-bird {
          animation: birdFly 2.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .duolearn-owl,
          .duolearn-circle,
          .duolearn-eye,
          .duolearn-character-one,
          .duolearn-character-two,
          .duolearn-character-three,
          .duolearn-coins,
          .duolearn-bird {
            animation: none !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="mx-auto flex min-h-screen w-full max-w-[1400px] items-center px-6 pb-10 pt-28 md:px-12">
        <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* LEFT ILLUSTRATION */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative h-[400px] w-[500px] max-w-full md:h-[520px] md:w-[620px]">

              {/* GREEN CIRCLE */}
              <div className="duolearn-circle absolute left-[25%] top-[25%] h-[250px] w-[250px] rounded-full bg-[#58CC02] md:h-[330px] md:w-[330px]" />

              {/* MAIN OWL */}
              <div className="duolearn-owl absolute left-[39%] top-[30%] z-20">
                <div className="relative h-[190px] w-[170px] md:h-[240px] md:w-[210px]">

                  {/* BODY */}
                  <div className="absolute bottom-0 left-[10px] h-[155px] w-[150px] rounded-[48%] bg-[#58CC02] md:left-[15px] md:h-[195px] md:w-[180px]" />

                  {/* LEFT EYE */}
                  <div className="duolearn-eye absolute left-[28px] top-[10px] z-30 h-[65px] w-[65px] rounded-full bg-white md:left-[38px] md:h-[75px] md:w-[75px]">
                    <div className="absolute left-[23px] top-[15px] h-[35px] w-[25px] rounded-full bg-[#4B4B4B] md:left-[27px] md:h-[40px] md:w-[28px]" />
                  </div>

                  {/* RIGHT EYE */}
                  <div className="duolearn-eye absolute right-[20px] top-[10px] z-30 h-[65px] w-[65px] rounded-full bg-white md:right-[25px] md:h-[75px] md:w-[75px]">
                    <div className="absolute left-[15px] top-[15px] h-[35px] w-[25px] rounded-full bg-[#4B4B4B] md:left-[18px] md:h-[40px] md:w-[28px]" />
                  </div>

                  {/* BEAK */}
                  <div className="absolute left-1/2 top-[70px] z-40 -translate-x-1/2">
                    <div className="h-0 w-0 border-l-[18px] border-r-[18px] border-t-[30px] border-l-transparent border-r-transparent border-t-[#FFB900]" />
                  </div>

                  {/* FEET */}
                  <div className="absolute bottom-[-8px] left-[20px] h-[25px] w-[38px] rotate-[-12deg] rounded-full bg-[#FF9600]" />
                  <div className="absolute bottom-[-8px] right-[20px] h-[25px] w-[38px] rotate-[12deg] rounded-full bg-[#FF9600]" />
                </div>
              </div>

              {/* FLOATING CHARACTER */}
              <div className="duolearn-character-one absolute left-[5%] top-[30%] z-30">
                <div className="relative h-[110px] w-[85px]">
                  <div className="absolute left-[18px] top-[30px] h-[65px] w-[55px] rounded-full bg-[#1CB0F6]" />
                  <div className="absolute left-[25px] top-[7px] h-[45px] w-[45px] rounded-full bg-[#FFB6A3]" />
                  <div className="absolute left-[18px] top-[7px] h-[18px] w-[55px] rounded-full bg-[#FF9600]" />
                </div>
              </div>

              {/* SECOND CHARACTER */}
              <div className="duolearn-character-two absolute right-[8%] top-[12%] z-30">
                <div className="relative h-[110px] w-[90px]">
                  <div className="absolute bottom-[3px] left-[15px] h-[70px] w-[55px] rounded-[45%] bg-[#FF9600]" />
                  <div className="absolute left-[22px] top-[4px] h-[45px] w-[45px] rounded-full bg-[#FFB6A3]" />
                  <div className="absolute left-[12px] top-[5px] h-[16px] w-[60px] rounded-full bg-[#1CB0F6]" />
                </div>
              </div>

              {/* THIRD CHARACTER */}
              <div className="duolearn-character-three absolute bottom-[8%] left-[15%] z-30">
                <div className="relative h-[120px] w-[100px]">
                  <div className="absolute bottom-0 left-[20px] h-[70px] w-[60px] rounded-[45%] bg-[#1CB0F6]" />
                  <div className="absolute left-[28px] top-[5px] h-[48px] w-[48px] rounded-full bg-[#FFB6A3]" />
                  <div className="absolute left-[20px] top-[5px] h-[17px] w-[60px] rounded-full bg-[#FF9600]" />
                </div>
              </div>

              {/* COINS */}
              <div className="duolearn-coins absolute bottom-[5%] left-[39%] z-40">
                <div className="relative h-[100px] w-[140px]">
                  <div className="absolute bottom-0 left-[20px] h-[35px] w-[75px] rounded-full border-[5px] border-[#FFB900] bg-[#FFD633]" />
                  <div className="absolute bottom-[25px] left-[5px] h-[35px] w-[75px] rounded-full border-[5px] border-[#FFB900] bg-[#FFD633]" />
                  <div className="absolute bottom-[50px] left-[35px] h-[35px] w-[75px] rounded-full border-[5px] border-[#FFB900] bg-[#FFD633]" />
                </div>
              </div>

              {/* SMALL BIRD */}
              <div className="duolearn-bird absolute right-[3%] top-[4%] z-40">
                <div className="h-[30px] w-[50px] rounded-full bg-[#1CB0F6]" />
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <h1 className="max-w-[650px] text-5xl font-black leading-[1.05] tracking-[-2px] text-[#4B4B4B] md:text-6xl lg:text-[68px]">
              Welcome to Duolingo!
            </h1>

            <p className="mt-6 max-w-[590px] text-xl font-semibold leading-8 text-[#777777] md:text-2xl">
              Open the app to start your first lesson
            </p>

            {/* GET STARTED */}
            <Link
              href="/login"
              className="mt-10 flex h-[70px] w-full max-w-[500px] items-center justify-center rounded-2xl border-b-[6px] border-[#46A900] bg-[#58CC02] px-8 text-xl font-black uppercase tracking-wide text-white transition hover:bg-[#61D507] active:translate-y-1 active:border-b-0"
            >
              Get Started
            </Link>

            <p className="mt-6 text-sm font-semibold text-[#999999]">
              Free to start • Learn every day • Have fun
            </p>
          </div>
        </div>
      </section>

      {/* BOTTOM GREEN LINE */}
      <div className="fixed bottom-0 left-0 right-0 h-2 bg-[#58CC02]" />
    </main>
  );
}
