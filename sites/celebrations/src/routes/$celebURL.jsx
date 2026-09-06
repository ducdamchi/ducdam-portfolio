import {
  createFileRoute,
  useParams,
  useSearch,
  useNavigate,
} from '@tanstack/react-router'
import { GalleryModal, useWindowSize } from '@ducdam/shared'
import { celebrationsConfig } from '../components/gallery/configs'

function CelebModal() {
  const { celebURL } = useParams({ strict: false })
  const { from: initialIndex } = useSearch({ strict: false })
  const navigate = useNavigate()
  const { width: screenWidth, height: screenHeight } = useWindowSize()
  const isMobileMode = screenWidth <= 820 || screenHeight <= 768

  const album = celebrationsConfig.data.find((a) => a.url === celebURL)

  if (!album) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Project not found
      </div>
    )
  }

  return (
    <GalleryModal
      config={celebrationsConfig}
      album={album}
      openModalId={album.id}
      closeModal={() => navigate({ to: '/' })}
      screenHeight={screenHeight}
      screenWidth={screenWidth}
      isMobileMode={isMobileMode}
      initialIndex={initialIndex ?? 0}
    />
  )
}

export const Route = createFileRoute('/$celebURL')({
  component: CelebModal,
})
