/** Soft ambient glow for hero sections — particles come from site-wide layer */
export default function Background3D() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div className="absolute w-[500px] h-[500px] rounded-full bg-blue-accent/8 top-[-10%] right-[-5%] blur-3xl" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/6 bottom-[-5%] left-[-5%] blur-3xl" />
    </div>
  )
}
