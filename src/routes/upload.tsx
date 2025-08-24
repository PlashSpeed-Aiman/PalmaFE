// @ts-nocheck

import { createFileRoute } from '@tanstack/react-router'
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
  const API_BASE = import.meta.env.VITE_API_URL || "https://localhost:7024"

  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [gpsData, setGpsData] = useState<GpsCoordinates | null>(null)
  const [uploadComplete, setUploadComplete] = useState(false)

  // New state for processing/results
  const [processing, setProcessing] = useState(false)
  const [uploadedId, setUploadedId] = useState<string | null>(null)
  const [resultImageSrc, setResultImageSrc] = useState<string | null>(null)
  const [resultData, setResultData] = useState<any | null>(null)

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
      setProcessing(false)
      setUploadedId(null)
      setResultImageSrc(null)
      setResultData(null)
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
    // Reset previous results state when picking a new file
    setProcessing(false)
    setUploadedId(null)
    setResultImageSrc(null)
    setResultData(null)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
      // Try to extract GPS metadata
      // extractImageMetadata(selectedFile)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleUpload = async () => {
    if (!file) return
    setUploadError(null)
    setUploading(true)
    setUploadProgress(0)
    setUploadComplete(false)
    setProcessing(false)
    setResultImageSrc(null)
    setResultData(null)

    try {
      const formData = new FormData()
      // Assuming backend expects key name "file"
      formData.append("file", file, file.name)

      // Simulate progress up to 90% while uploading
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? prev : Math.min(90, prev + 5)))
      }, 200)

      const uploadRes = await fetch(`${API_BASE}/Images/upload`, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressTimer)

      if (!uploadRes.ok) {
        const text = await uploadRes.text().catch(() => '')
        throw new Error(`Upload failed (${uploadRes.status}): ${text || uploadRes.statusText}`)
      }

      const uploadJson = await uploadRes.json()
      setUploadedId(uploadJson.id)

      setUploading(false)
      setUploadProgress(100)
      setUploadComplete(true)

      // Start polling for results
      setProcessing(true)

      const maxAttempts = 20 // ~40s total if interval=2000ms
      const intervalMs = 2000

      let attempt = 0
      let lastError: unknown = null

      while (attempt < maxAttempts) {
        attempt += 1
        try {
          const res = await fetch(`${API_BASE}/Images/${uploadJson.id}/results`, {
            method: 'GET',
          })
          if (!res.ok) {
            lastError = new Error(`Results fetch failed (${res.status})`)
          } else {
            const json = await res.json()
            if (json && json.success && json.annotated_image?.data) {
              setResultData(json)
              const dataUrl = `data:image/jpeg;base64,${json.annotated_image.data}`
              setResultImageSrc(dataUrl)
              setProcessing(false)
              return
            }
            lastError = new Error('Results not ready yet')
          }
        } catch (err) {
          lastError = err
        }

        await new Promise((r) => setTimeout(r, intervalMs))
      }

      setProcessing(false)
      throw lastError || new Error('Timed out waiting for results')
    } catch (err: any) {
      console.error(err)
      setUploading(false)
      setProcessing(false)
      setUploadError(err?.message || 'An error occurred during upload or processing.')
    }
  }

  return (
    <div className="grid-container">
      {/*<div className="left-panel">*/}
      {/*  <Card>*/}
      {/*    <H3>Analytics</H3>*/}
      {/*    <Callout title="Palm Tree Analysis" intent="primary">*/}
      {/*      View analytics on your annotated palm tree data*/}
      {/*    </Callout>*/}

      {/*    <H4 style={{ marginTop: '20px' }}>Tree Statistics</H4>*/}
      {/*    <HTMLTable striped style={{ width: '100%' }}>*/}
      {/*      <thead>*/}
      {/*        <tr>*/}
      {/*          <th>Tree Type</th>*/}
      {/*          <th>Count</th>*/}
      {/*        </tr>*/}
      {/*      </thead>*/}
      {/*      <tbody>*/}
      {/*        <tr>*/}
      {/*          <td>Young Trees</td>*/}
      {/*          <td>143</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>Mature Trees</td>*/}
      {/*          <td>287</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>Total Trees</td>*/}
      {/*          <td>430</td>*/}
      {/*        </tr>*/}
      {/*      </tbody>*/}
      {/*    </HTMLTable>*/}

      {/*    <H4 style={{ marginTop: '20px' }}>Upload Statistics</H4>*/}
      {/*    <HTMLTable striped style={{ width: '100%' }}>*/}
      {/*      <thead>*/}
      {/*        <tr>*/}
      {/*          <th>Metric</th>*/}
      {/*          <th>Value</th>*/}
      {/*        </tr>*/}
      {/*      </thead>*/}
      {/*      <tbody>*/}
      {/*        <tr>*/}
      {/*          <td>Total Images</td>*/}
      {/*          <td>24</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>Processed</td>*/}
      {/*          <td>18</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>Pending</td>*/}
      {/*          <td>6</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>Success Rate</td>*/}
      {/*          <td>92%</td>*/}
      {/*        </tr>*/}
      {/*      </tbody>*/}
      {/*    </HTMLTable>*/}

      {/*    <H4 style={{ marginTop: '20px' }}>Recent Activity</H4>*/}
      {/*    <HTMLTable striped style={{ width: '100%' }}>*/}
      {/*      <thead>*/}
      {/*        <tr>*/}
      {/*          <th>Date</th>*/}
      {/*          <th>Action</th>*/}
      {/*        </tr>*/}
      {/*      </thead>*/}
      {/*      <tbody>*/}
      {/*        <tr>*/}
      {/*          <td>2025-07-18</td>*/}
      {/*          <td>3 images uploaded</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>2025-07-17</td>*/}
      {/*          <td>5 images processed</td>*/}
      {/*        </tr>*/}
      {/*        <tr>*/}
      {/*          <td>2025-07-16</td>*/}
      {/*          <td>Analysis completed</td>*/}
      {/*        </tr>*/}
      {/*      </tbody>*/}
      {/*    </HTMLTable>*/}
      {/*  </Card>*/}
      {/*</div>*/}

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


          {processing && (
            <Callout intent={Intent.PRIMARY} title="Processing..." style={{ marginTop: '20px' }}>
              We are analyzing your image. This may take a little while.
            </Callout>
          )}

          {resultImageSrc && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <H4>Annotated Result</H4>
              <img
                src={resultImageSrc}
                alt="Annotated Result"
                style={{
                  maxWidth: '100%',
                  border: '1px solid #d8e1e8',
                  borderRadius: '3px',
                }}
              />
            </div>
          )}

          {resultData?.results?.counts && (
            <Card style={{ marginTop: '20px', backgroundColor: '#f5f8fa' }}>
              <H4>Detection Summary</H4>
              <HTMLTable condensed style={{ width: '100%' }}>
                <tbody>
                  <tr>
                    <td><strong>Mature (Healthy)</strong></td>
                    <td>{resultData.results.counts["Mature(Healthy)"] ?? 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Mature (Yellow)</strong></td>
                    <td>{resultData.results.counts["Mature(Yellow)"] ?? 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Mature (Dead)</strong></td>
                    <td>{resultData.results.counts["Mature(Dead)"] ?? 0}</td>
                  </tr>
                  <tr>
                    <td><strong>Young</strong></td>
                    <td>{resultData.results.counts.Young ?? 0}</td>
                  </tr>
                </tbody>
              </HTMLTable>
              {resultData.results.summary && (
                <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#5c7080' }}>
                  Total palms: {resultData.results.summary.total_palms} | Total mature: {resultData.results.summary.total_mature} | Total young: {resultData.results.summary.total_young}
                </p>
              )}
            </Card>
          )}

          {uploadComplete && !processing && !resultImageSrc && (
            <Callout 
              intent={Intent.SUCCESS} 
              title="Upload Complete" 
              style={{ marginTop: '20px' }}
            >
              <p>Your image has been successfully uploaded and is being processed.</p>
            </Callout>
          )}
        </Card>
      </div>
    </div>
  )
}
