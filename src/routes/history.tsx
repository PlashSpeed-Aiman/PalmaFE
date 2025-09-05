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
  InputGroup,
  ButtonGroup,
  Tag,
  Spinner,
} from '@blueprintjs/core'
import { useAuth } from '../contexts/AuthContext'
import { AnnotationService, type Annotation } from '../services/AnnotationService'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function HistoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' })
      return
    }

    const fetchAnnotations = async () => {
      try {
        setLoading(true)
        const annotationService = new AnnotationService()
        const data = await annotationService.getAnnotations()
        setAnnotations(data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch annotations.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnnotations()
  }, [isAuthenticated, navigate])

  // Filter images based on search query
  const filteredAnnotations = annotations.filter(ann => {
    if (searchQuery === '') return true
    const lowerCaseQuery = searchQuery.toLowerCase()

    const name = ann.metadata?.originalFileName || ''
    if (name.toLowerCase().includes(lowerCaseQuery)) {
      return true
    }

    if (ann.id.toLowerCase().includes(lowerCaseQuery)) {
      return true
    }

    return false
  })

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

  return (
      <div className="history-container" style={{padding: '20px'}}>
        <div className="history-header" style={{marginBottom: '20px'}}>
          <H3>Annotation History</H3>
          <p>View and manage your previously saved annotations</p>
        </div>

        <Card elevation={2} style={{marginBottom: '20px'}}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{flex: '1', minWidth: '200px'}}>
              <InputGroup
                  leftIcon="search"
                  placeholder="Search by filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{width: '100%'}}
              />
            </div>
            
            <ButtonGroup>
              <Button 
                icon="grid-view" 
                active={viewMode === 'grid'} 
                onClick={() => setViewMode('grid')} 
              />
              <Button 
                icon="th-list" 
                active={viewMode === 'list'} 
                onClick={() => setViewMode('list')} 
              />
            </ButtonGroup>
          </div>
        </Card>
      
      {filteredAnnotations.length === 0 ? (
        <Callout intent={Intent.PRIMARY} title="No Annotations Found">
          <p>You have not saved any annotations yet. Upload an image and save the results to see them here.</p>
        </Callout>
      ) : viewMode === 'grid' ? (
        <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredAnnotations.map(ann => (
            <Card key={ann.id} elevation={2} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={`data:image/jpeg;base64,${ann.annotatedImage.data}`}
                  alt={ann.metadata?.originalFileName || 'Annotated image'}
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '3px' }} 
                />
              </div>
              
              <H4 style={{ marginTop: '15px', marginBottom: '5px' }}>{ann.metadata?.originalFileName || 'Untitled'}</H4>
              <p style={{ margin: '0', color: '#5c7080' }}>Uploaded: {new Date(ann.metadata?.uploadDate).toLocaleString()}</p>
              {ann.results?.summary?.totalPalms && <p style={{ margin: '5px 0' }}>Trees: {ann.results.summary.totalPalms}</p>}
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: '15px' }}>
                <Button icon="document-open" text="View Details" intent={Intent.PRIMARY} small onClick={() => navigate({ to: `/history/${ann.id}` })} />
                <Button icon="more" small minimal />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <HTMLTable interactive striped style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Upload Date</th>
              <th>Total Palms</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAnnotations.map(ann => (
              <tr key={ann.id}>
                <td>{ann.metadata?.originalFileName || 'Untitled'}</td>
                <td>{new Date(ann.metadata?.uploadDate).toLocaleString()}</td>
                <td>{ann.results?.summary?.totalPalms || '-'}</td>
                <td>
                  <ButtonGroup minimal>
                    <Button icon="document-open" text="View" small onClick={() => navigate({ to: `/history/${ann.id}` })} />
                    <Button icon="edit" text="Edit" small onClick={() => navigate({ to: `/history/${ann.id}` })} />
                    <Button icon="more" small />
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
      
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'end' }}>
        <Button icon="upload" text="Upload New Image" intent={Intent.PRIMARY} onClick={() => navigate({ to: '/upload' })}/>
      </div>
    </div>
  )
}