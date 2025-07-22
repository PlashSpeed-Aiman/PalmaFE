import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar, Button, Alignment, Menu, MenuItem, Popover, Position } from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '../styles.css'
import {navigateToRoute} from "@/helpers/routingHelper.ts";

export const Route = createRootRoute({
  component: () => (
    <div className="app-container">
      <Navbar className="bp4-dark">
        <Navbar.Group align={Alignment.START}>
          <Navbar.Heading>Palm Tree Analyzer</Navbar.Heading>
          <Navbar.Divider />
          <Link to="/" className="bp4-button bp4-minimal" style={{marginRight: '0.5rem'}}>
            Home
          </Link>
          <Link to="/upload" className="bp4-button bp4-minimal" style={{marginRight: '0.5rem'}}>
            Upload
          </Link>
          <Link to="/results" className="bp4-button bp4-minimal" style={{marginRight: '0.5rem'}}>
            Results
          </Link>
          <Link to="/history" className="bp4-button bp4-minimal" style={{marginRight: '0.5rem'}}>
            History
          </Link>
        </Navbar.Group>
        <Navbar.Group align={Alignment.END}>
          <Button icon="user" onClick={navigateToRoute("/login")} text="Login" style={{ marginRight: '0.25rem' }} />
          <Button icon="help" text="Help" />
        </Navbar.Group>
      </Navbar>
      <div className="content-container">
        <Outlet />
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
})
