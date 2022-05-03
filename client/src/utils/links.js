
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'

const links = [
    {
        id: 2,
        text: 'Dashboard',
        path: '/',
        icon: <MdQueryStats />
    },
    {
        id: 3,
        text: 'Add Job',
        path: 'add-job',
        icon: <FaWpforms />
    },
    {
        id: 4,
        text: 'Profile',
        path: 'profile',
        icon: <ImProfile />
    }
]

export default links