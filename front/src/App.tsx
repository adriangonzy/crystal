import { Card, Line, Table } from './components'
import { lineData, tableColumns, tableData } from './test-data'

export default function App() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      {/* Container */}
      <div className="py-4 px-8 mx-auto h-full">
        {/* Title */}
        <div className="my-12 text-center">
          <p className="text-4xl font-bold text-white">Crystal</p>
        </div>
        {/* Cards */}
        <div className="space-y-8">
          <Card title="Lorem" key="lorem">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi
            doloremque quo iste architecto ducimus dignissimos saepe placeat
            quaerat quibusdam quam aperiam quas, omnis repellat laborum beatae
            facilis totam, impedit quasi?
          </Card>
          <Card>
            <div className="h-96" key="chart">
              <Line data={lineData} />
            </div>
          </Card>
          <Card>
            <div className="h-96" key="table">
              <Table data={tableData} columns={tableColumns} />
            </div>
          </Card>
        </div>
        {/* Footer */}
        <div className="mt-8 text-xs text-center text-white text-opacity-50">
          Copyright BRC - 2021
        </div>
      </div>
    </div>
  )
}
