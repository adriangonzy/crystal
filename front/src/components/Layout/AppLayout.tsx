import { PropsWithChildren } from 'react'
import { Footer } from '../Footer.tsx/Footer'
import Header from '../Header/Header'

export default function AppLayout({
  children,
}: PropsWithChildren<any>): JSX.Element {
  return (
    <div className="w-screen h-screen bg-gradient">
      {/* Container */}
      <div className="container flex flex-col py-8 mx-auto h-full">
        <Header />
        {/* Content */}
        <div
          className="my-8 flex-1 py-6 px-6 text-purple-700 bg-white bg-opacity-25 
          rounded-lg border border-r-0 border-b-0 border-l-0 backdrop-filter backdrop-blur-sm shadow-3xl max-h-[calc(100vh_-_192px)]"
        >
          {children}
        </div>
        <Footer />
      </div>
    </div>
  )
}
