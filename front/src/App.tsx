import { Card, Line, Table } from './components'
import { data as testData } from './test-data'

export default function App() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="py-4 px-8 mx-auto h-full">
        <div className="my-12 text-center">
          <p className="text-4xl font-bold text-white">Crystal</p>
        </div>
        <div className="space-y-8">
          <Card title="Lorem" key="lorem">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi
            doloremque quo iste architecto ducimus dignissimos saepe placeat
            quaerat quibusdam quam aperiam quas, omnis repellat laborum beatae
            facilis totam, impedit quasi?
          </Card>
          <Card>
            <div className="h-96" key="chart">
              <Line data={testData} />
            </div>
          </Card>
          <Card>
            <div className="h-96" key="table">
              <Table />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
