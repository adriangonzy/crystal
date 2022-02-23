import { Route, Routes } from 'react-router-dom'
import { Bundles } from './Bundles/Bundles'
import { CreateBundleModal } from './Bundles/CreateBundleModal'
import FlashbotApp from './FlashbotApp'
export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<FlashbotApp />} />
      <Route path="/bundles" element={<Bundles />}>
        <Route path="add" element={<CreateBundleModal />} />
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
