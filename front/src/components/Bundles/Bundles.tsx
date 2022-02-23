import { CgMathPlus } from 'react-icons/cg'
import { Link, Outlet } from 'react-router-dom'
import { Button } from '../Button/Button'
import AppLayout from '../Layout/AppLayout'
import { Bundle } from './Bundle'
import { StoredBundle, useStore } from './useBundles'

export const Bundles = () => {
  const { bundles } = useStore()

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <Outlet />
        <div className="flex flex-row flex-shrink-0 text-purple-700">
          <Link to="/bundles/add">
            <Button icon={<CgMathPlus className="text-2xl" />}>
              <span className="font-bold">Create Bundle</span>
            </Button>
          </Link>
        </div>

        <div className="flex overflow-auto flex-col mt-4 space-y-2 h-full rounded-lg shadow-inner no-scroll-bars">
          {bundles.map((bundle: StoredBundle) => (
            <Bundle key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
