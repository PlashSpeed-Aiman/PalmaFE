import { createFileRoute, Link } from '@tanstack/react-router'
import { Button, Card, H1, H3 } from '@blueprintjs/core'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div>
      <section className="hero-section">
        <H1>Analyze your palm trees</H1>
        <Link to="/upload">
          <Button intent="primary" large>
            Get Started
          </Button>
        </Link>
      </section>

      <section className="features-section">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
          <H3 style={{ textAlign: 'center', marginBottom: '40px' }}>Advanced Palm Tree Analysis</H3>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
            <Card style={{ width: '300px', margin: '10px' }} elevation={2}>
              <H3>Upload Images</H3>
              <p>Upload your palm tree images for instant analysis and identification.</p>
            </Card>

            <Card style={{ width: '300px', margin: '10px' }} elevation={2}>
              <H3>Get Insights</H3>
              <p>Receive detailed analytics and insights about your palm trees.</p>
            </Card>

            <Card style={{ width: '300px', margin: '10px' }} elevation={2}>
              <H3>Take Action</H3>
              <p>Use our recommendations to better care for your palm trees.</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
