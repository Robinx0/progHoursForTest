import { Box, Button, Group, Menu, Modal, Stack, Text, Title, useMantineTheme } from "@mantine/core"
import getOJProfileURL from "~/utils/getOJProfileUrl"
import { useState } from "react"
import { IconDotsVertical, IconEdit, IconExternalLink, IconTrash } from "@tabler/icons"
import { useMutation, useQueryClient } from "react-query"
import { deleteHandle } from "~/api/handle"
import showToast from "~/utils/showToast"
import SettingsHandleForm from "../settings-handle-form/SettingsHandleForm"

export default function SettingsHandleCard({ icon, handle, onlineJudge }: any) {
  const client = useQueryClient()
  const theme = useMantineTheme()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  // delete mutation
  const { mutate } = useMutation(deleteHandle, {
    onSuccess() {
      client.invalidateQueries("handles")
      showToast("success", "Handle deleted")
      setDeleteOpen(false)
    },
    onError(err: any) {
      showToast("error", err.response.data.message)
      setDeleteOpen(false)
    },
  })

  return (
    <Box
      p="lg"
      sx={(theme) => ({
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        borderRadius: theme.radius.md,
        background: theme.colorScheme === "dark" ? "#272a3c" : theme.colors.gray[0],
      })}
    >
      <Group>
        <Box
          sx={(theme) => ({
            width: 48,
            height: 48,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            background: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.white,
            borderRadius: "50%",
          })}
        >
          {icon}
        </Box>
        <Stack spacing={1}>
          <Title order={5}>{onlineJudge.name}</Title>
          <Text size="sm" color="dimmed">
            {handle}
          </Text>
        </Stack>
      </Group>

      <Menu>
        <Menu.Target>
          <Button
            color="gray"
            variant="subtle"
            size="xs"
            sx={{ position: "absolute", top: 8, right: 8, padding: 4 }}
          >
            <IconDotsVertical size={16} />
          </Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            component="a"
            icon={<IconExternalLink size={14} />}
            target="_blank"
            href={getOJProfileURL(onlineJudge.name, handle)}
            sx={{ height: 36 }}
          >
            Visit Profile
          </Menu.Item>
          <Menu.Item icon={<IconEdit size={14} />} onClick={() => setEditOpen(true)}>
            Edit Handle
          </Menu.Item>
          <Menu.Item icon={<IconTrash size={14} />} onClick={() => setDeleteOpen(true)}>
            Delete Handle
          </Menu.Item>

          {/* Other items ... */}
        </Menu.Dropdown>
      </Menu>

      {/* edit handle modal */}
      <Modal
        opened={editOpen}
        onClose={() => setEditOpen(false)}
        title={<Title order={4}>Edit {onlineJudge.name} handle</Title>}
      >
        <SettingsHandleForm setIsOpen={setEditOpen} handle={handle} onlineJudge={onlineJudge} />
      </Modal>

      {/* delete modal */}
      <Modal
        opened={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={<Title order={4}>Delete {onlineJudge.name}</Title>}
      >
        <Text>Are you sure you want to delete ?</Text>
        <Group mt={20} sx={{ justifyContent: "flex-end" }}>
          <Button variant="white" color="dark" onClick={() => setDeleteOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={() => {
              mutate(onlineJudge.id)
              setDeleteOpen(false)
            }}
          >
            Delete
          </Button>
        </Group>
      </Modal>
    </Box>
  )
}
