import { Button, Menu, Text } from "@mantine/core"
import { useNavigate } from "react-router-dom"
import { IconChevronDown, IconLogout, IconSettings, IconUser } from "@tabler/icons"
import { User } from "~/contexts/UserContext"
import { FC } from "react"
import useLogout from "~/hooks/useLogout"
import { Avatar } from "~/components/atoms"

export default function NavbarUserMenu({ user }: NavbarUserMenuProps) {
  const navigate = useNavigate()
  const handleLogout = useLogout()
  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          size="sm"
          variant="subtle"
          color="dark"
          leftIcon={<Avatar name={user.name} width={28} height={28} />}
          px="sm"
        >
          <Text
            mr="xs"
            sx={(theme) => ({
              color: theme.colorScheme === "dark" ? theme.white : theme.colors.dark[6],
              [`@media (max-width: ${theme.breakpoints.md}px)`]: {
                display: "none",
              },
            })}
          >
            {user.name}
          </Text>
          <IconChevronDown size={16} />
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={<IconUser size={14} />}
          onClick={() => navigate(`/${user.username.toUpperCase()}`)}
        >
          Profile
        </Menu.Item>
        <Menu.Item icon={<IconSettings size={14} />} onClick={() => navigate("/settings")}>
          Settings
        </Menu.Item>
        <Menu.Item icon={<IconLogout size={14} />} onClick={handleLogout}>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}

export interface NavbarUserMenuProps {
  user: User
}
