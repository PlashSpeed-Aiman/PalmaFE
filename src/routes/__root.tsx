import { Outlet, createRootRoute, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { Navbar, Button, Alignment, Menu, MenuItem, Popover, Position } from '@blueprintjs/core'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '../styles.css'
import {navigateToRoute} from "@/helpers/routingHelper.ts";
import { useAuth } from '../contexts/AuthContext';

export const Route = createRootRoute({
  component: () => {
    const { isAuthenticated, user, logout } = useAuth();
    
    const handleLogout = async () => {
      await logout();
      // Redirect to home page after logout
      window.location.href = '/';
    };
    
    return (
      <div className="app-container">
        <Navbar className="bp4-dark">
          <Navbar.Group align={Alignment.START}>
            <Navbar.Heading>PalmaCount</Navbar.Heading>
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
            {isAuthenticated && (
              <Link to="/history" className="bp4-button bp4-minimal" style={{marginRight: '0.5rem'}}>
                History
              </Link>
            )}
          </Navbar.Group>
          <Navbar.Group align={Alignment.END}>
            {isAuthenticated ? (
              <>
                <span style={{ color: 'black', marginRight: '1rem' }}>
                  Welcome, {user?.username || 'User'}
                </span>
                <Popover
                  content={
                    <Menu>
                      <MenuItem icon="user" text="Profile" onClick={navigateToRoute("/profile")} />
                      <MenuItem icon="log-out" text="Logout" onClick={handleLogout} />
                    </Menu>
                  }
                  position={Position.BOTTOM}
                >
                  <Button icon="user" rightIcon="caret-down" style={{ marginRight: '0.25rem' }} />
                </Popover>
              </>
            ) : (
              <>
                <Button icon="user" onClick={navigateToRoute("/login")} text="Login" style={{ marginRight: '0.25rem' }} />
                <Button icon="new-person" onClick={navigateToRoute("/register")} text="Register" style={{ marginRight: '0.25rem' }} />
              </>
            )}
            <Button icon="help" text="Help" />
          </Navbar.Group>
        </Navbar>
        <div className="content-container">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    );
  },
})
