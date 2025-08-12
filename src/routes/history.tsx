// @ts-nocheck
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
} from '@blueprintjs/core'
import { Select, type ItemRendererProps} from '@blueprintjs/select'
import { useAuth } from '../contexts/AuthContext'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

// Sample data for demonstration
const sampleImages = [
  {
    id: 'img001',
    name: 'Palm Plantation East',
    uploadDate: '2025-07-20',
    status: 'Processed',
    treeCount: 430,
    thumbnail: 'https://via.placeholder.com/150?text=Palm+Trees'
  },
  {
    id: 'img002',
    name: 'North Field Survey',
    uploadDate: '2025-07-18',
    status: 'Processed',
    treeCount: 215,
    thumbnail: 'https://via.placeholder.com/150?text=Palm+Trees'
  },
  {
    id: 'img003',
    name: 'New Plantation Area',
    uploadDate: '2025-07-15',
    status: 'Processing',
    treeCount: null,
    thumbnail: 'https://via.placeholder.com/150?text=Processing'
  },
  {
    id: 'img004',
    name: 'Drone Survey West',
    uploadDate: '2025-07-10',
    status: 'Processed',
    treeCount: 178,
    thumbnail: 'https://via.placeholder.com/150?text=Palm+Trees'
  },
  {
    id: 'img005',
    name: 'Coastal Plantation',
    uploadDate: '2025-07-05',
    status: 'Processed',
    treeCount: 302,
    thumbnail: 'https://via.placeholder.com/150?text=Palm+Trees'
  },
  {
    id: 'img006',
    name: 'Hillside Survey',
    uploadDate: '2025-07-01',
    status: 'Failed',
    treeCount: null,
    thumbnail: 'https://via.placeholder.com/150?text=Failed'
  },
]

// Filter options
const statusOptions = ["All", "Processed", "Processing", "Failed"]
const dateOptions = ["All Time", "Last Week", "Last Month", "Last 3 Months"]

function HistoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('All Time')
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' })
    }
  }, [isAuthenticated, navigate])

  // Filter images based on search query and filters
  const filteredImages = sampleImages.filter(img => {
    // Search filter
    const matchesSearch = searchQuery === '' ||
        img.name.toLowerCase().includes(searchQuery.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === 'All' || img.status === statusFilter

    // For demo purposes, we're not implementing actual date filtering logic
    return matchesSearch && matchesStatus
  })

  return (
      <div className="history-container" style={{padding: '20px'}}>
        <div className="history-header" style={{marginBottom: '20px'}}>
          <H3>Image History</H3>
          <p>View and manage your previously uploaded palm tree images</p>
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
                  placeholder="Search images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{width: '100%'}}
              />
            </div>

            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
            {/*  <Select*/}
            {/*      items={statusOptions}*/}
            {/*      activeItem={statusFilter}*/}
            {/*      onItemSelect={(item) => setStatusFilter(item)}*/}
            {/*      filterable={false}*/}
            {/*      popoverProps={{minimal: true}}*/}
            {/*      itemRenderer={function (item: string, itemProps: ItemRendererProps): React.JSX.Element | null {*/}
            {/*        */}
            {/*      }}            >*/}
            {/*  <Button rightIcon="caret-down" text={`Status: ${statusFilter}`} />*/}
            {/*</Select>*/}
            
            {/*<Select*/}
            {/*  items={dateOptions}*/}
            {/*  activeItem={dateFilter}*/}
            {/*  onItemSelect={(item) => setDateFilter(item)}*/}
            {/*  filterable={false}*/}
            {/*  popoverProps={{ minimal: true }}*/}
            {/*>*/}
            {/*  <Button rightIcon="caret-down" text={`Date: ${dateFilter}`} />*/}
            {/*</Select>*/}
            
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
        </div>
      </Card>
      
      {filteredImages.length === 0 ? (
        <Callout intent={Intent.WARNING} title="No Images Found">
          <p>No images match your current filters. Try adjusting your search criteria.</p>
        </Callout>
      ) : viewMode === 'grid' ? (
        <div className="image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {filteredImages.map(img => (
            <Card key={img.id} elevation={2} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={img.thumbnail} 
                  alt={img.name} 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '3px' }} 
                />
                <Tag 
                  intent={
                    img.status === 'Processed' ? Intent.SUCCESS : 
                    img.status === 'Processing' ? Intent.PRIMARY : 
                    Intent.DANGER
                  }
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                >
                  {img.status}
                </Tag>
              </div>
              
              <H4 style={{ marginTop: '15px', marginBottom: '5px' }}>{img.name}</H4>
              <p style={{ margin: '0', color: '#5c7080' }}>Uploaded: {img.uploadDate}</p>
              {img.treeCount && <p style={{ margin: '5px 0' }}>Trees: {img.treeCount}</p>}
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', paddingTop: '15px' }}>
                {img.status === 'Processed' ? (
                  <Button icon="document-open" text="View Results" intent={Intent.PRIMARY} small />
                ) : (
                  <Button icon="refresh" text="Check Status" small disabled={img.status === 'Failed'} />
                )}
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
              <th>Status</th>
              <th>Tree Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredImages.map(img => (
              <tr key={img.id}>
                <td>{img.name}</td>
                <td>{img.uploadDate}</td>
                <td>
                  <Tag 
                    intent={
                      img.status === 'Processed' ? Intent.SUCCESS : 
                      img.status === 'Processing' ? Intent.PRIMARY : 
                      Intent.DANGER
                    }
                    minimal
                  >
                    {img.status}
                  </Tag>
                </td>
                <td>{img.treeCount || '-'}</td>
                <td>
                  <ButtonGroup minimal>
                    {img.status === 'Processed' ? (
                      <Button icon="document-open" text="View" small />
                    ) : (
                      <Button icon="refresh" text="Check" small disabled={img.status === 'Failed'} />
                    )}
                    <Button icon="download" small />
                    <Button icon="more" small />
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </HTMLTable>
      )}
      
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button icon="arrow-left" text="Back to Upload" />
        <Button icon="upload" text="Upload New Image" intent={Intent.PRIMARY} />
      </div>
    </div>
  )
}