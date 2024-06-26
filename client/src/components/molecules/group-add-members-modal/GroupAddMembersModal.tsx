import { useMutation, useQueryClient } from "react-query"
import { useState } from "react"
import { Modal, Textarea, Title, Button, Alert, Text, Anchor } from "@mantine/core"
import { addMember } from "~/api/groups"
import showToast from "~/utils/showToast"
import { AxiosError } from "axios"
import { useForm, yupResolver } from "@mantine/form"
import * as Yup from "yup"
import { IconAlertCircle } from "@tabler/icons"

const addMembersSchema = Yup.object({
  username: Yup.string().trim().required("University IDs are required"),
})

export default function GroupAddMembersModal({ isOpen, setIsOpen, groupName, groupId, slug }: any) {
  const queryClient = useQueryClient()
  const [failed, setFailed] = useState([])

  const form = useForm({
    initialValues: {
      username: "",
    },
    validate: yupResolver(addMembersSchema),
  })

  const { mutateAsync, isLoading } = useMutation((values: any) => addMember(groupId)(values), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(`groups/${slug}`)
      showToast("success", res.message)
      // close if there is no errors
      if (res.body.failed.length === 0) {
        setIsOpen(false)
      } else {
        // show the failed entries
        setFailed(res.body.failed)
      }
    },
    onError: (err: AxiosError) => {
      const errorMessage = err?.response?.data?.message || "Something went wrong!"
      showToast("error", errorMessage)
    },
  })

  const downloadFailed = () => {
    let fileContent = ""
    failed.forEach((el: any) => (fileContent += `${el.username}\n`))
    const tempLink = document.createElement("a")
    var blob = new Blob([fileContent], { type: "text/plain" })
    tempLink.setAttribute("href", URL.createObjectURL(blob))
    tempLink.setAttribute("download", "failed.txt")
    tempLink.click()
    URL.revokeObjectURL(tempLink.href)
  }

  const handleSubmit = form.onSubmit((values) => {
    mutateAsync(values)
    form.reset()
  })

  return (
    <Modal
      opened={isOpen}
      onClose={() => setIsOpen(false)}
      title={<Title order={4}>Add Members - {groupName}</Title>}
    >
      {/* description="Enter the University IDs of the users that you want to add to the group." */}
      {failed.length > 0 && (
        <Alert icon={<IconAlertCircle size={16} />} title="Bummer!" color="red" mb="md">
          <Text size="sm">
            Failed to add {failed.length} member(s).{" "}
            <Anchor onClick={downloadFailed}>Download list</Anchor>
          </Text>
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Textarea
          label="University IDs"
          placeholder="C181065&#10;C181059&#10;C181083&#10;..."
          minRows={8}
          withAsterisk
          {...form.getInputProps("username")}
        ></Textarea>
        <Button type="submit" mt="sm" loading={isLoading}>
          Add Members
        </Button>
      </form>
    </Modal>
  )
}
