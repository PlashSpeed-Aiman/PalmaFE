// @ts-nocheck

import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Card,
  FileInput,
  Button,
  ProgressBar,
  H3,
  H4,
  Callout,
  HTMLTable,
  Intent,
  Tag,
  Divider,
  Icon
} from '@blueprintjs/core'

export const Route = createFileRoute('/upload')({
  component: UploadPage,
})

// Interface for GPS coordinates
interface GpsCoordinates {
  latitude: string;
  longitude: string;
  altitude?: string;
  timestamp?: string;
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [gpsData, setGpsData] = useState<GpsCoordinates | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)

  // Extract GPS data from image if available
  // @ts-ignore
  const extractImageMetadata = (imageFile: File) => {
    // In a real application, you would use EXIF.js or a similar library
    // to extract actual GPS coordinates from the image metadata

    // For demo purposes, we'll simulate finding GPS data
    setTimeout(() => {
      // Simulate GPS data for demo purposes
      const simulatedGpsData: GpsCoordinates = {
        latitude: "3.1390° N",
        longitude: "101.6869° E",
        altitude: "45m",
        timestamp: new Date().toISOString()
      }
      setGpsData(simulatedGpsData)
    }, 500)
  }

  const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files || files.length === 0) {
      setFile(null)
      setPreviewUrl(null)
      setGpsData(null)
      setUploadComplete(false)
      return
    }

    const selectedFile = files[0]

    // Check if file is an image
    if (!selectedFile.type.startsWith('image/')) {
      setUploadError('Please upload an image file (.jpg, .png, .webp, etc.)')
      setFile(null)
      setPreviewUrl(null)
      setGpsData(null)
      setUploadComplete(false)
      return
    }

    setUploadError(null)
    setFile(selectedFile)
    setUploadComplete(false)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
      // Try to extract GPS metadata
      extractImageMetadata(selectedFile)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)
    setUploadComplete(false)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploadComplete(true)
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  return (
    <div className="grid-container">
      <div className="left-panel">
        <Card>
          <H3>Analytics</H3>
          <Callout title="Palm Tree Analysis" intent="primary">
            View analytics on your annotated palm tree data
          </Callout>

          <H4 style={{ marginTop: '20px' }}>Tree Statistics</H4>
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
                <td>Total Trees</td>
                <td>430</td>
              </tr>
              <tr>
                <td>Estimated Area</td>
                <td>12.5 hectares</td>
              </tr>
            </tbody>
          </HTMLTable>

          <H4 style={{ marginTop: '20px' }}>Upload Statistics</H4>
          <HTMLTable striped style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total Images</td>
                <td>24</td>
              </tr>
              <tr>
                <td>Processed</td>
                <td>18</td>
              </tr>
              <tr>
                <td>Pending</td>
                <td>6</td>
              </tr>
              <tr>
                <td>Success Rate</td>
                <td>92%</td>
              </tr>
            </tbody>
          </HTMLTable>

          <H4 style={{ marginTop: '20px' }}>Recent Activity</H4>
          <HTMLTable striped style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-07-18</td>
                <td>3 images uploaded</td>
              </tr>
              <tr>
                <td>2025-07-17</td>
                <td>5 images processed</td>
              </tr>
              <tr>
                <td>2025-07-16</td>
                <td>Analysis completed</td>
              </tr>
            </tbody>
          </HTMLTable>
        </Card>
      </div>

      <div className="center-panel">
        <Card>
          <H3>Upload Palm Tree Images</H3>
          <p>Upload satellite imagery of palm oil trees for processing. Supported formats: JPG, PNG, WEBP.</p>

          {uploadError && (
            <Callout intent="danger" title="Upload Error">
              {uploadError}
            </Callout>
          )}

          <div style={{ marginTop: '20px' }}>
            <FileInput
              text={file ? file.name : "Choose file..."}
              onInputChange={handleFileChange}
              inputProps={{ accept: "image/*" }}
              fill
              large
            />
          </div>

          {uploading && (
            <ProgressBar
              value={uploadProgress / 100}
              intent={Intent.PRIMARY}
              stripes
              style={{ marginTop: '20px' }}
            />
          )}

          {gpsData && (
            <Card style={{ marginTop: '20px', backgroundColor: '#f5f8fa' }}>
              <H4 style={{ display: 'flex', alignItems: 'center' }}>
                <Icon icon="geolocation" style={{ marginRight: '8px' }} /> GPS Data Detected
              </H4>
              <p>The following location data was extracted from your image:</p>
              <HTMLTable condensed style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><strong>Latitude:</strong></td>
                    <td>{gpsData.latitude}</td>
                  </tr>
                  <tr>
                    <td><strong>Longitude:</strong></td>
                    <td>{gpsData.longitude}</td>
                  </tr>
                  {gpsData.altitude && (
                    <tr>
                      <td><strong>Altitude:</strong></td>
                      <td>{gpsData.altitude}</td>
                    </tr>
                  )}
                </tbody>
              </HTMLTable>
              <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#5c7080' }}>
                This data will be used to map the palm trees in your image.
              </p>
            </Card>
          )}

          {previewUrl && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <H4>Preview</H4>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  border: '1px solid #d8e1e8',
                  borderRadius: '3px'
                }} 
              />
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <Button 
              intent="primary" 
              text="Upload and Process" 
              onClick={handleUpload} 
              disabled={!file || uploading}
              fill
              large
            />
          </div>

          {uploadComplete && (
            <Callout 
              intent={Intent.SUCCESS} 
              title="Upload Complete" 
              style={{ marginTop: '20px' }}
            >
              <p>Your image has been successfully uploaded and is being processed.</p>
              <div style={{ marginTop: '10px' }}>
                <Link to="/results">
                  <Button intent={Intent.SUCCESS} icon="document-open">
                    View Results
                  </Button>
                </Link>
              </div>
            </Callout>
          )}
        </Card>
      </div>
    </div>
  )
}
