// ** Icon imports
import HomeOutline from 'mdi-material-ui/HomeOutline'
import ShieldOutline from 'mdi-material-ui/ShieldOutline'
import PlusOutline from 'mdi-material-ui/PlusOutline'
import CloudUploadOutline from 'mdi-material-ui/CloudUploadOutline'

// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [{
    title: 'Top',
    icon: HomeOutline,
    path: '/top'
  },
  {
    title: 'Jobs',
    icon: ShieldOutline,
    path: '/jobs'
  },
  {
    title: 'Work',
    icon: ShieldOutline,
    path: '/work',
    action: 'read',
    subject: 'acl-page'
  },
  {
    title: 'Boost',
    icon: PlusOutline,
    path: '/boost',
    action: 'read',
    subject: 'acl-page'
  },
  {
    title: 'Post',
    icon: CloudUploadOutline,
    path: '/boost',
    action: 'read',
    subject: 'acl-page'
  }]
}

export default navigation
