import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Card,
  Button,
  H3,
  H4,
  Callout,
  HTMLTable,
  Intent,
  Spinner,
  InputGroup,
  FormGroup,
} from '@blueprintjs/core'
import { useAuth } from '../contexts/AuthContext'
import { AnnotationService, type AnnotationUpdateDto, type Annotation } from '../services/AnnotationService'

export const Route = createFileRoute('/history/$annotationId')({
  component: AnnotationPage,
})

function AnnotationPage() {
  const { annotationId } = Route.useParams()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [annotation, setAnnotation] = useState<Annotation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [fileName, setFileName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login' })
      return
    }

    const fetchAnnotation = async () => {
      try {
        setLoading(true)
        const annotationService = new AnnotationService()
        const data = await annotationService.getAnnotation(annotationId)
        setAnnotation(data)
        setFileName(data.metadata?.originalFileName || '')
      } catch (err: any) {
        setError(err.message || 'Failed to fetch annotation.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnnotation()
  }, [isAuthenticated, navigate, annotationId])

  const handleSaveMetadata = async () => {
    if (!annotation) return

    setIsSaving(true)
    setSaveError(null)
    try {
      const annotationService = new AnnotationService()
      const payload: AnnotationUpdateDto = {
        results: annotation.results,
        success: annotation.success,
        metadata: {
          ...annotation.metadata,
          originalFileName: fileName,
        },
      }
      const updatedAnnotation = await annotationService.updateAnnotationMetadata(annotationId, payload)
      setAnnotation(updatedAnnotation)
      setIsEditing(false)
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save metadata.')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return <Spinner style={{ margin: '20px' }} />
  }

  if (error) {
    return (
      <Callout intent={Intent.DANGER} title="Error" style={{ margin: '20px' }}>
        {error}
      </Callout>
    )
  }

  if (!annotation) {
    return (
      <Callout intent={Intent.WARNING} title="Not Found" style={{ margin: '20px' }}>
        Annotation not found.
      </Callout>
    )
  }

  return (
    <div className="annotation-container" style={{ padding: '20px' }}>
      <Button
        icon="arrow-left"
        text="Back to History"
        onClick={() => navigate({ to: '/history' })}
        style={{ marginBottom: '20px' }}
      />
      <Card>
        {isEditing ? (
          <FormGroup label="Image Filename" labelFor="filename-input">
            <InputGroup
              id="filename-input"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              style={{ maxWidth: '400px' }}
            />
            <Button
              text="Save"
              intent={Intent.SUCCESS}
              onClick={handleSaveMetadata}
              style={{ marginTop: '10px' }}
              loading={isSaving}
              disabled={isSaving}
            />
            <Button
              text="Cancel"
              onClick={() => {
                setIsEditing(false)
                setFileName(annotation.metadata?.originalFileName || '')
              }}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            />
            {saveError && (
              <Callout intent={Intent.DANGER} title="Save Error" style={{ marginTop: '10px' }}>
                {saveError}
              </Callout>
            )}
          </FormGroup>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <H3>{annotation.metadata?.originalFileName || 'Untitled'}</H3>
            <Button icon="edit" text="Edit Metadata" onClick={() => setIsEditing(true)} />
          </div>
        )}
        <p style={{ margin: '0 0 20px 0', color: '#5c7080' }}>
          Uploaded on: {new Date(annotation.metadata?.uploadDate).toLocaleString()}
        </p>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <H4>Annotated Image</H4>
          <img
            src={`data:image/jpeg;base64,${annotation.annotatedImage.data}`}
            alt={annotation.metadata?.originalFileName || 'Annotated image'}
            style={{
              maxWidth: '100%',
              border: '1px solid #d8e1e8',
              borderRadius: '3px',
            }}
          />
        </div>

        {annotation.results?.counts && (
          <Card style={{ marginTop: '20px', backgroundColor: '#f5f8fa' }}>
            <H4>Detection Summary</H4>
            <HTMLTable style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <td><strong>Mature (Healthy)</strong></td>
                  <td>{annotation.results.counts["Mature(Healthy)"] ?? 0}</td>
                </tr>
                <tr>
                  <td><strong>Mature (Yellow)</strong></td>
                  <td>{annotation.results.counts["Mature(Yellow)"] ?? 0}</td>
                </tr>
                <tr>
                  <td><strong>Mature (Dead)</strong></td>
                  <td>{annotation.results.counts["Mature(Dead)"] ?? 0}</td>
                </tr>
                <tr>
                  <td><strong>Young</strong></td>
                  <td>{annotation.results.counts.young ?? 0}</td>
                </tr>
              </tbody>
            </HTMLTable>
            {annotation.results.summary && (
              <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#5c7080' }}>
                Total palms: {annotation.results.summary.totalPalms} | Total mature: {annotation.results.summary.totalMature} | Total young: {annotation.results.summary.totalYoung}
              </p>
            )}
          </Card>
        )}
      </Card>
    </div>
  )
}
