import { Card } from './components'

export default function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-pink-500 to-indigo-500">
      <div className="py-16 px-4 mx-auto max-w-screen-xl">
        <div className="text-center">
          <p className="my-3 text-4xl font-bold text-white">Crystal</p>
        </div>
        <div className="mt-8">
          <Card>TEST</Card>
        </div>
        <div className="mt-8">
          <Card>TEST</Card>
        </div>
      </div>
    </div>
  )
}
