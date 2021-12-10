import _ from 'lodash'
import { Card, Line, Table } from '.'
import { useNFTEvents } from '../client/useNFTEvents'
import { lineData } from '../test-data'

export default function App() {
  const [data, loading, error] = useNFTEvents()

  console.log(loading, error)

  const projects = _(data)
    .groupBy('PROJECT_NAME')
    .mapValues((events, project) => ({
      project: project,
      avg: _(events).map('PRICE').mean().toFixed(2),
      numberOfSales: events.length.toFixed(),
      volume: _(events).map('PRICE').sum(),
      events: _(events).orderBy('BLOCK_TIMESTAMP').value(),
    }))
    .mapValues((group) => ({
      ...group,
      events: _(group.events)
        .groupBy('DATE')
        .mapValues((events) => ({
          avg: _(events).map('PRICE').mean(),
          numberOfSales: events.length,
          volume: _(events).map('PRICE').sum(),
          events: _(events).orderBy('BLOCK_TIMESTAMP').value(),
        }))
        .value(),
    }))
    .values()
    .orderBy('volume')
    .map((project) => ({
      ...project,
      volume: project.volume.toFixed(2),
    }))
    .reverse()
    .value()

  const projectColumns = [
    {
      Header: 'Name',
      accessor: 'project',
    },
    {
      Header: 'Volume (ETH)',
      accessor: 'volume',
    },
    {
      Header: 'AVG (ETH)',
      accessor: 'avg',
    },
    {
      Header: '#Sales',
      accessor: 'numberOfSales',
    },
  ]

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
            <div className="overflow-scroll max-h-96" key="table">
              <Table data={projects} columns={projectColumns} />
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
