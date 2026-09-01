import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => (
    <div className="flex items-center justify-center p-20">
      <h1 className="text-2xl font-light">Coming Soon</h1>
    </div>
  ),
})
