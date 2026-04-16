export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid place-items-center w-full h-screen">
      {children}
    </div>
  )
}