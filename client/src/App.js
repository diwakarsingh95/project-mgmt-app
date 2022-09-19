import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import Header from './components/Header'
import Home from './pages/Home'
import Spinner from './components/Spinner'
const Project = lazy(() => import('./pages/Project'))
const NotFound = lazy(() => import('./pages/NotFound'))

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(_, incoming) {
            return incoming
          }
        },
        projects: {
          merge(_, incoming) {
            return incoming
          }
        }
      }
    }
  }
})

const url = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'

const client = new ApolloClient({
  uri: `${url}/graphql`,
  cache
})

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <Header />
          <div className='container'>
            <Suspense fallback={<Spinner />}>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/projects/:id' element={<Project />} />
                <Route path='*' element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ApolloProvider>
    </>
  )
}

export default App
