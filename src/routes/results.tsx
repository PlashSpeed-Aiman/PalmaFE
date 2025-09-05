import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useEffect, useState} from 'react'
import {
  Card,
  Button,
  H3,
  H4,
  Callout,
  HTMLTable,
  Intent,
  Tab,
  Tabs
} from '@blueprintjs/core'
import Map from '../components/Map'

export const Route = createFileRoute('/results')({
  component: ResultsPage,
})

function ResultsPage() {
  const [selectedTabId, setSelectedTabId] = useState("map")
  const [mapZoom, setMapZoom] = useState(14)
  const navigate = useNavigate()

    // Sample tree data - in a real app, this would come from an API
  const treeData = [
    { id: 'T001', latitude: 3.1390, longitude: 101.6869, type: 'Mature' },
    { id: 'T002', latitude: 3.1392, longitude: 101.6872, type: 'Young' },
    { id: 'T003', latitude: 3.1395, longitude: 101.6875, type: 'Mature' },
    { id: 'T004', latitude: 3.1398, longitude: 101.6878, type: 'Mature' }
  ]
    useEffect(() => {
        navigate({to: '/upload'})
    })

  // Map zoom handlers
  const handleZoomIn = () => setMapZoom(prev => Math.min(prev + 1, 20))
  const handleZoomOut = () => setMapZoom(prev => Math.max(prev - 1, 1))

  return (
    <div className="results-container">
      <div className="results-header">
        <H3>Palm Tree Analysis Results</H3>
        <p>View detailed analysis of your uploaded palm tree images</p>
      </div>

      <Tabs 
        id="resultsTabs" 
        selectedTabId={selectedTabId} 
        onChange={(newTabId) => setSelectedTabId(newTabId as string)}
        large
      >
        <Tab 
          id="map" 
          title="Interactive Map" 
          panel={
            <div className="map-container">
              <Card elevation={2} style={{ marginBottom: '20px' }}>
                <Callout intent={Intent.PRIMARY} title="Map View">
                  <p>This interactive map shows the distribution of palm trees based on GPS coordinates extracted from your uploaded images.</p>
                </Callout>

                <div style={{ marginTop: '20px' }}>
                  <Map trees={treeData} zoom={mapZoom} />
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                  <Button icon="filter" text="Filter Trees" />
                  <Button icon="zoom-in" text="Zoom In" onClick={handleZoomIn} />
                  <Button icon="zoom-out" text="Zoom Out" onClick={handleZoomOut} />
                </div>
              </Card>
            </div>
          } 
        />

        <Tab 
          id="analysis" 
          title="Detailed Analysis" 
          panel={
            <div className="analysis-container">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <Card elevation={2} style={{ flex: '1', minWidth: '300px' }}>
                  <H4>Tree Count</H4>
                  <HTMLTable striped style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Tree Type</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Young Trees</td>
                        <td>143</td>
                      </tr>
                      <tr>
                        <td>Mature Trees</td>
                        <td>287</td>
                      </tr>
                      <tr>
                        <td>Total</td>
                        <td>430</td>
                      </tr>
                    </tbody>
                  </HTMLTable>
                </Card>

                <Card elevation={2} style={{ flex: '1', minWidth: '300px' }}>
                  <H4>Area Coverage</H4>
                  <HTMLTable striped style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Metric</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Total Area</td>
                        <td>12.5 hectares</td>
                      </tr>
                      <tr>
                        <td>Tree Density</td>
                        <td>34.4 trees/hectare</td>
                      </tr>
                      <tr>
                        <td>Coverage Percentage</td>
                        <td>78%</td>
                      </tr>
                    </tbody>
                  </HTMLTable>
                </Card>
              </div>

              <Card elevation={2} style={{ marginTop: '20px' }}>
                <H4>GPS Coordinates</H4>
                <HTMLTable striped style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>Tree ID</th>
                      <th>Latitude</th>
                      <th>Longitude</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>T001</td>
                      <td>3.1390° N</td>
                      <td>101.6869° E</td>
                      <td>Mature</td>
                    </tr>
                    <tr>
                      <td>T002</td>
                      <td>3.1392° N</td>
                      <td>101.6872° E</td>
                      <td>Young</td>
                    </tr>
                    <tr>
                      <td>T003</td>
                      <td>3.1395° N</td>
                      <td>101.6875° E</td>
                      <td>Mature</td>
                    </tr>
                    <tr>
                      <td>T004</td>
                      <td>3.1398° N</td>
                      <td>101.6878° E</td>
                      <td>Mature</td>
                    </tr>
                  </tbody>
                </HTMLTable>
              </Card>
            </div>
          } 
        />

        <Tab 
          id="download" 
          title="Download Report" 
          panel={
            <div className="download-container">
              <Card elevation={2}>
                <H4>Download Options</H4>
                <p>Download your analysis results in various formats</p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px' }}>
                  <Button icon="document" text="PDF Report" intent={Intent.PRIMARY} />
                  <Button icon="th" text="CSV Data" intent={Intent.SUCCESS} />
                  <Button icon="map" text="GeoJSON" intent={Intent.WARNING} />
                  <Button icon="media" text="Map Image" intent={Intent.DANGER} />
                </div>

                <Callout style={{ marginTop: '20px' }}>
                  <p>Reports include detailed analysis of tree counts, distribution, and health metrics.</p>
                </Callout>
              </Card>
            </div>
          } 
        />
      </Tabs>

      <div className="action-buttons" style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <Button icon="arrow-left" text="Back to Upload" />
        <Button icon="share" text="Share Results" intent={Intent.PRIMARY} />
      </div>
    </div>
  )
}
