import { FC } from "react"
import { User } from "@/contexts/UserContext"
import { Box, Loader, MantineProvider } from "@mantine/core"
import { NotificationsProvider } from "@mantine/notifications"
import { ReactQueryDevtools } from "react-query/devtools"
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight"

// routes
import routes from "@/routes"

// hooks
import {
  Navigate,
  NavigateFunction,
  useNavigate,
  useRoutes,
} from "react-router-dom"
import useUser from "@/hooks/useUser"

// styles
import theme from "@/styles/theme"
import "@/styles/custom.css"
import {
  IconChartBar,
  IconDashboard,
  IconHome,
  IconLogout,
  IconSearch,
} from "@tabler/icons"
import useLogout from "./hooks/useLogout"

const App = () => {
  const { user } = useUser()
  const isLoading = user === undefined

  /**
   * Show a loading animation until the request is finished
   */
  if (isLoading)
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Loader></Loader>
      </Box>
    )

  /**
   * user is null when no user is logged in
   */
  const isLoggedIn = user !== null
  return <Entry isLoggedIn={isLoggedIn} user={user} />
}

const Entry: FC<{ isLoggedIn: boolean; user: User | null }> = ({
  isLoggedIn,
  user,
}) => {
  const handleLogout = useLogout()
  const navigate = useNavigate()
  const role: string = user ? user.role : "GUEST"
  const matchedPage = useRoutes(routes(isLoggedIn, role))
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <NotificationsProvider position="top-right" transitionDuration={250}>
        <SpotlightProvider
          actions={getActions(navigate, handleLogout, user)}
          searchIcon={<IconSearch size={18} />}
          searchPlaceholder="Search..."
          shortcut="mod + shift + p"
          nothingFoundMessage="Nothing found..."
        >
          <Box
            sx={(theme) => ({
              background: theme.colors.gray[0],
              minHeight: "100vh",
            })}
          >
            <main>{matchedPage}</main>
          </Box>
        </SpotlightProvider>
        <ReactQueryDevtools position="bottom-right" />
      </NotificationsProvider>
    </MantineProvider>
  )
}

const getActions = (
  navigate: NavigateFunction,
  handleLogout: Function,
  user: User | null
): SpotlightAction[] => {
  // user not logged in
  if (!user) {
    return [
      {
        title: "Register",
        description: "Visit the dashboard page",
        onTrigger: () => navigate("/dasboard"),
        icon: <IconDashboard size={18} />,
      },
      {
        title: "Login",
        description: "Visit the dashboard page",
        onTrigger: () => navigate("/login"),
        icon: <IconDashboard size={18} />,
      },
    ]
  }
  // if user is logged in
  return [
    {
      title: "Dashboard",
      description: "Visit the dashboard page",
      onTrigger: () => navigate("/dashboard"),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "Your Profile",
      description: "Visit your profile",
      onTrigger: () => user && navigate(`/users/${user.username}`),
      icon: <IconDashboard size={18} />,
    },
    {
      title: "Leaderboard",
      description: "Visit the leaderboard page",
      onTrigger: () => navigate("/leaderboard"),
      icon: <IconChartBar size={18} />,
    },
    {
      title: "Logout",
      description: "Logout from progHours",
      onTrigger: () => handleLogout(),
      icon: <IconLogout size={18} />,
    },
  ]
}

export default App
