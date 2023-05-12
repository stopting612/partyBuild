import { ConnectedRouter } from 'connected-react-router'
import FoodDetails from 'pages/FoodDetails/FoodDetails'
import { Provider } from 'react-redux'
import { Redirect, Route, Switch } from 'react-router-dom'
import './App.css'
import Footer from './components/common/Footer/Footer'
import Navbar from './components/common/Navbars/Navbar'
import BeverageList from './pages/BeverageList/BeverageList'
import Home from './pages/Home/Home'
import UserLogin from './pages/UserLogin/UserLogin'
import PartyRoomDetails from './pages/PartyRoomDetails/PartyRoomDetails'
import PartyRoomList from './pages/PartyRoomList/PartyRoomList'
import FoodList from './pages/FoodList/FoodList'
import store, { history } from './store'
import BeverageDetails from 'pages/BeverageDetails/BeverageDetails'
import HoldAParty from 'pages/HoldAParty/HoldAParty'
import OrderDetail from 'pages/OrderDetail/OrderDetail'
import UserRegister from 'pages/UserRegister/UserRegister'
import User from 'pages/User/User'
import React from 'react'
import BusinessLogin from 'pages/BusinessLogin/BusinessLogin'
import AdminLogin from 'pages/AdminLogin/AdminLogin'
import { BusinessRoute } from 'components/PrivateRoute/BusinessRoute'
import Business from 'pages/Business/Business'
import BusinessOrder from 'pages/Business/BusinessOrder'
import BusinessBranch from 'pages/Business/BusinessBranch'
import BusinessData from 'pages/Business/BusinessData'
import { AdminRoute } from 'components/PrivateRoute/AdminRoute'
import AccountApplications from 'pages/Admin/AccountApplications/AccountApplications'
import RegisterBusiness from 'pages/Admin/RegisterBusiness'
import RegisterStore from 'pages/Admin/RegisterStore'
import EditStore from 'pages/Admin/EditStore'
import ScrollToTop from 'components/common/ScrollToTop'
import BranchInfo from 'pages/Business/BranchInfo'
import Loading from 'components/common/Loading/Loading'
import UserVerification from 'pages/UserRegister/UserVerification'
import Checkout from 'pages/Checkout/Checkout'
import { UserRoute } from 'components/PrivateRoute/UserRoute'
import Toasts from 'components/common/Toasts/Toasts'
import OnlyReadOrderDetail from 'pages/OrderDetail/OnlyReadOrderDetail'
import BussinessOrderDetail from 'pages/Business/BusinessOrderDetail'
import { BecomeCopartner } from 'pages/BecomeCopartner/BecomeCopartner'

function App() {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className='App'>
          <Loading />
          <nav>
            <Navbar />
          </nav>
          <main>
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route path='/hold-a-party'>
                <HoldAParty />
              </Route>
              <Route path='/party-room/:id'>
                <PartyRoomDetails />
              </Route>
              <Route path='/food/:id'>
                <FoodDetails />
              </Route>
              <Route path='/party-room'>
                <PartyRoomList />
              </Route>
              <Route path='/food'>
                <FoodList />
              </Route>
              <Route path='/become-copartner'>
                <BecomeCopartner />
              </Route>
              <Route path='/beverage/:id'>
                <BeverageDetails />
              </Route>
              <Route path='/beverage'>
                <BeverageList />
              </Route>
              <Route path='/only-read-order-detail/:token'>
                <OnlyReadOrderDetail />
              </Route>
              <Route path='/login'>
                <UserLogin />
              </Route>
              <Route path='/register'>
                <UserRegister />
              </Route>
              <Route path='/users/email-verification'>
                <UserVerification />
              </Route>
              <Route path='/business/login'>
                <BusinessLogin />
              </Route>
              <Route path='/admin/login'>
                <AdminLogin />
              </Route>
              <Route path='/user'>
                <User />
              </Route>
              <BusinessRoute path='/business'>
                <Switch>
                  <Route exact path='/business'>
                    <Business />
                  </Route>
                  <Route path='/business/orderdetail/:id'>
                    <BussinessOrderDetail />
                  </Route>
                  <Route path='/business/order'>
                    <BusinessOrder />
                  </Route>
                  <Route path='/business/branch/:id'>
                    <BranchInfo />
                  </Route>
                  <Route path='/business/branch'>
                    <BusinessBranch />
                  </Route>
                  <Route path='/business/data'>
                    <BusinessData />
                  </Route>
                  <Route>
                    <Redirect to='/business' />
                  </Route>
                </Switch>
              </BusinessRoute>
              <AdminRoute path='/admin'>
                <Route path='/admin/account-applications'>
                  <AccountApplications />
                </Route>
                <Route path='/admin/register-business'>
                  <RegisterBusiness />
                </Route>
                <Route path='/admin/register-store'>
                  <RegisterStore />
                </Route>
                <Route path='/admin/edit-store'>
                  <EditStore />
                </Route>
                <Route>
                  <Redirect to='/admin/account-applications' />
                </Route>
              </AdminRoute>
              <UserRoute>
                <Switch>
                  <Route path='/orderdetail/:id'>
                    <OrderDetail />
                  </Route>
                  <Route path='/checkout/:id'>
                    <Checkout />
                  </Route>
                  <Route>
                    <Redirect to='/' />
                  </Route>
                </Switch>
              </UserRoute>
            </Switch>
            <Toasts />
            <ScrollToTop />
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      </ConnectedRouter>
    </Provider>
  )
}

export default App
