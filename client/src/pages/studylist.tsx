import { getAllUserStudy } from "~/api/userStudies"
import { DashboardLayout } from "~/components/layouts/Dashboard"
import StudyCard from "~/components/study/StudyCard"
import StudyForm from "~/components/study/StudyForm"
import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { useQuery } from "react-query"
import { Box, Button, Grid, Group, Modal, Text, Title } from "@mantine/core"
import { IconPlus } from "@tabler/icons"

const StudyPage = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userStudies, setUserStudies] = useState([])

  useQuery("userStudies", getAllUserStudy, {
    onSuccess(data: any) {
      setUserStudies(data?.body.studies)
    },
  })

  return (
    <DashboardLayout>
      <Helmet>
        <title>Study List</title>
      </Helmet>

      <Group position="apart" mb="md">
        <Title order={3}>Study List</Title>
        <Button size="xs" onClick={() => setIsOpen(true)} type="button" leftIcon={<IconPlus size={16} />}>
          Add New
        </Button>
      </Group>

      <Box>
        {userStudies.length === 0 ? (
          <Text>No resources added.</Text>
        ) : (
          <Grid>
            {userStudies.map((item: any) => (
              <Grid.Col key={item.id} md={6} lg={3}>
                <StudyCard {...item} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Box>

      {/* add study modal */}
      <Modal opened={isOpen} onClose={() => setIsOpen(false)} title={<Title order={4}>Add new resource</Title>}>
        <StudyForm setIsOpen={setIsOpen} isCreate={true} />
      </Modal>
    </DashboardLayout>
  )
}

export default StudyPage