export default function SceneBackground() {
  return (
    <>
      <style>{`
        .rc-scene {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .rc-scene__space {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 120% 60% at 50% 100%, #0d1a3a 0%, transparent 70%),
            linear-gradient(180deg, #05050f 0%, #080818 50%, #0a0d22 100%);
        }
        .rc-scene__stars {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(1px 1px at 8%  12%, rgba(255,255,255,0.75) 0%, transparent 100%),
            radial-gradient(1px 1px at 22%  6%, rgba(255,255,255,0.5)  0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 38% 18%, rgba(255,255,255,0.65) 0%, transparent 100%),
            radial-gradient(1px 1px at 55%  4%, rgba(255,255,255,0.4)  0%, transparent 100%),
            radial-gradient(1px 1px at 72% 14%, rgba(255,255,255,0.7)  0%, transparent 100%),
            radial-gradient(1px 1px at 86% 20%, rgba(255,255,255,0.5)  0%, transparent 100%),
            radial-gradient(1px 1px at 14% 32%, rgba(255,255,255,0.45) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 48% 28%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1px 1px at 67% 24%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 91% 38%, rgba(255,255,255,0.5)  0%, transparent 100%),
            radial-gradient(1px 1px at 4%  48%, rgba(255,255,255,0.4)  0%, transparent 100%),
            radial-gradient(1px 1px at 31% 42%, rgba(255,255,255,0.55) 0%, transparent 100%),
            radial-gradient(1px 1px at 79% 46%, rgba(255,255,255,0.3)  0%, transparent 100%),
            radial-gradient(1px 1px at 58% 52%, rgba(255,255,255,0.4)  0%, transparent 100%),
            radial-gradient(1px 1px at 17% 58%, rgba(255,255,255,0.35) 0%, transparent 100%),
            radial-gradient(1px 1px at 44% 62%, rgba(255,255,255,0.25) 0%, transparent 100%);
        }
        /* Earth — rises from the very bottom */
        .rc-scene__earth {
          position: absolute;
          bottom: -460px;
          left: 50%;
          transform: translateX(-50%);
          width: 1000px;
          height: 1000px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 90% 90% at 48% 45%,
            #1e5799 0%,
            #1a4a8a 20%,
            #0e2d5c 45%,
            #080f28 70%,
            transparent 100%
          );
          box-shadow:
            0 0 80px  30px rgba(30, 80, 200, 0.20),
            0 0 200px 80px rgba(20, 60, 160, 0.12),
            0 0 400px 140px rgba(10, 30, 100, 0.08);
          animation: rcEarthPulse 9s ease-in-out infinite alternate;
        }
        /* Continent blobs */
        .rc-scene__earth::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background:
            radial-gradient(ellipse 28% 18% at 32% 55%, rgba(34,110,54,0.18) 0%, transparent 100%),
            radial-gradient(ellipse 18% 12% at 62% 65%, rgba(34,100,48,0.12) 0%, transparent 100%),
            radial-gradient(ellipse 12%  8% at 52% 42%, rgba(50,130,70,0.10) 0%, transparent 100%),
            radial-gradient(ellipse 10%  6% at 74% 48%, rgba(40,115,60,0.09) 0%, transparent 100%);
        }
        /* Atmosphere rim */
        .rc-scene__earth::after {
          content: "";
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 100% 100% at 50% 50%,
            transparent 68%,
            rgba(80,150,255,0.14) 82%,
            rgba(60,120,240,0.06) 100%
          );
        }
        /* Warm gold spotlight from above */
        .rc-scene__spotlight {
          position: absolute;
          top: -180px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 700px;
          background: conic-gradient(
            from 270deg at 50% 0%,
            transparent    0deg,
            transparent   72deg,
            rgba(240,192,96,0.055) 90deg,
            rgba(240,192,96,0.03)  100deg,
            transparent   128deg
          );
        }
        .rc-scene__spotlight2 {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 560px;
          background: radial-gradient(
            ellipse 45% 55% at 50% 0%,
            rgba(240,192,96,0.07) 0%,
            rgba(200,155,60,0.03) 40%,
            transparent 68%
          );
        }
        /* Subtle side ambient blobs */
        .rc-scene__blob-l {
          position: absolute;
          top: 15%; left: -8%;
          width: 480px; height: 480px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96,165,250,0.045) 0%, transparent 70%);
          animation: rcBlob 13s ease-in-out infinite alternate;
        }
        .rc-scene__blob-r {
          position: absolute;
          top: 8%; right: -8%;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(192,132,252,0.04) 0%, transparent 70%);
          animation: rcBlob 17s ease-in-out infinite alternate-reverse;
        }
        /* Grain overlay */
        .rc-scene__grain {
          position: absolute;
          inset: 0;
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        @keyframes rcEarthPulse {
          0%   { box-shadow: 0 0 80px 30px rgba(30,80,200,.20), 0 0 200px 80px rgba(20,60,160,.12); }
          100% { box-shadow: 0 0 110px 45px rgba(30,80,200,.26), 0 0 260px 100px rgba(20,60,160,.16); }
        }
        @keyframes rcBlob {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(35px,55px) scale(1.08); }
        }
      `}</style>
      <div className="rc-scene">
        <div className="rc-scene__space" />
        <div className="rc-scene__stars" />
        <div className="rc-scene__blob-l" />
        <div className="rc-scene__blob-r" />
        <div className="rc-scene__spotlight" />
        <div className="rc-scene__spotlight2" />
        <div className="rc-scene__earth" />
        <div className="rc-scene__grain" />
      </div>
    </>
  );
}