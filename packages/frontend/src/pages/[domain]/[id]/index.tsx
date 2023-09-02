import BlogPost from '@components/BlockPost'
import { HomeTopBar } from '@components/home/HomeTopBar'

export default function Index() {
  return (
    <>
      <HomeTopBar />
      <div>Index</div>
      <BlogPost />
    </>
  )
}
