import { useMutation } from '@apollo/client'
import { FaTrash } from 'react-icons/fa'
import { DELETE_CLIENT } from '../mutations/clientMutations.gql'
import { GET_CLIENTS } from '../queries/clientQueries.gql'
import { GET_PROJECTS } from '../queries/projectQueries.gql'

const ClientRow = ({ client }) => {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    update(cache, { data: { deleteClient } }) {
      const { clients } = cache.readQuery({ query: GET_CLIENTS })
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: clients.filter((c) => c.id !== deleteClient.id) }
      })

      const { projects } = cache.readQuery({ query: GET_PROJECTS })
      cache.writeQuery({
        query: GET_PROJECTS,
        data: {
          projects: projects.filter((p) => {
            return p.client.id !== deleteClient.id
          })
        }
      })
    }
  })

  return (
    <tr>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button className='btn btn-danger btn-sm' onClick={deleteClient}>
          <FaTrash />
        </button>
      </td>
    </tr>
  )
}

export default ClientRow
