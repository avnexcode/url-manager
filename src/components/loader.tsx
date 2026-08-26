import * as m from '@/generated/paraglide/messages'

export const Loader = () => {
  return (
    <div className="bg-background flex h-screen w-full flex-col items-center justify-center gap-6">
      {/* Neobrutalism loader: bordered box with bouncing inner block */}
      <div className="border-border shadow-shadow relative flex h-20 w-20 items-center justify-center border-2 bg-main">
        <div className="border-border h-8 w-8 animate-bounce border-2 bg-background" />
      </div>
      <p className="text-foreground font-heading text-sm tracking-widest uppercase">
        {m.common_loading()}...
      </p>
    </div>
  )
}
