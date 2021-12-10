import { useTable } from 'react-table'
interface TableProps {
  data: { [k: string]: string }[]
  columns: { Header: string; accessor: string }[]
}

export const Table: React.FunctionComponent<TableProps> = ({
  columns,
  data,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data })

  return (
    <table
      {...getTableProps()}
      className="min-w-full divide-y divide-gray-200 table-fixed"
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} key="headers">
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                key={column.id}
                className="py-3 px-6 text-xs font-medium
                tracking-wider text-left text-gray-100 uppercase"
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="divide-y divide-gray-200">
        {rows.map((row) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()} key={row.id}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={cell.row.id + cell.column.id + ''}
                    className="py-4 px-6 whitespace-nowrap"
                  >
                    {cell.render('Cell')}
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
