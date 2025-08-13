import dynamic from 'next/dynamic'

const Editor = dynamic(() => import('@/components/Editor').then(m => m.Editor), { ssr: false })

export default function Page() {
  return <Editor />
}