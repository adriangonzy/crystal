import { Route, Routes } from 'react-router-dom'
import { AddBundleTransactionModal } from './Bundles/AddBundleTransactionModal'
import { Bundles } from './Bundles/Bundles'
import { CreateBundleModal } from './Bundles/CreateBundleModal'
import FlashbotApp from './FlashbotApp'
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FlashbotApp />} />
      <Route path="/bundles" element={<Bundles />}>
        <Route path="add" element={<CreateBundleModal />} />
        <Route path=":bundleId/add" element={<AddBundleTransactionModal />} />
      </Route>
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>{"There's nothing here!"}</p>
          </main>
        }
      />
    </Routes>
  )
}
