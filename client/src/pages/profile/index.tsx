import { useQuery } from "react-query"
import { useState } from "react"
import { useParams } from "react-router-dom"
import { Grid, Stack, Tabs, Box, SimpleGrid, Paper, Text, Title } from "@mantine/core"
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons"
import { Skeleton, useToast, useColorModeValue as mode } from "@chakra-ui/react"

/**
 * Import Components
 */
import Navbar from "~/components/navbar"

/**
 * Import API
 */
import { getSubmissionsByUsername } from "~/api/submissions"

/**
 * Import helpers
 */
import { getUserByUsername } from "~/api/user"
import { UserCard } from "~/components/profile/UserCard"
import { Helmet } from "react-helmet-async"
import { SubmissionsTable } from "~/components/submissions-table"
import { DEFAULT_TOAST_OPTIONS } from "~/configs/toast-config"
import { getStatsByUsername } from "~/api/leaderboard"
import UserStats from "~/components/stats/UserStats"
import TagsFreqChart from "~/components/stats/visualizations/TagsFreqChart"
import { UserAbout } from "~/components/profile/UserAbout"
import { getWeekRanges } from "~/utils/getWeekRanges"
import WeeklySolvedChart from "~/components/stats/visualizations/WeeklySolvedChart"
import { AnimateLoading } from "~/components/AnimateLoading"
import { Container } from "@mantine/core"
import { motion } from "framer-motion"
import Icon100Solved from "~/components/assets/medals/Icon100Solved"
import Icon250Solved from "~/components/assets/medals/Icon250Solved"
import Icon500Solved from "~/components/assets/medals/Icon500Solved"
import Icon750Solved from "~/components/assets/medals/Icon750Solved"
import Icon1000Solved from "~/components/assets/medals/Icon1000Solved"
import MedalsTab from "~/components/profile/MedalsTab"
import UserSubmissionTable from "~/components/profile/UserSubmission"

interface User {
  name: string
  username: string
  email: string
  id: number
  memberSince: string
  department: string
  mobile: string
  batch: number
  role: string
}

interface Frequency {
  [name: string]: number
}

export default function Profile() {
  const toast = useToast(DEFAULT_TOAST_OPTIONS)
  const { username } = useParams()

  /**
   * Get statistics
   */
  let [user, setUser] = useState<User | null>(null)
  let [submissions, setSubmissions] = useState([])

  /**
   * Get submissions
   */
  let [frequency, setFrequency] = useState<Frequency | null>(null)

  const submissionQuery = useQuery(
    `submissions/${username}`,
    () => getSubmissionsByUsername(username ? username : "-1"),
    {
      onSuccess: (res) => {
        const frequency: Frequency = {}
        const weekRanges = getWeekRanges(res.body.submissions)
        /**
         * For each week k, calculate how many problems are solved in the k'th week
         */
        for (let i = 0; i < res.body.submissions.length; ++i) {
          for (let j = 0; j < weekRanges.length; ++j) {
            const solvedAt = new Date(res.body.submissions[i].solvedAt)
            if (solvedAt >= weekRanges[j].from && solvedAt <= weekRanges[j].to) {
              if (!frequency[j + 1]) frequency[j + 1] = 0
              frequency[j + 1]++
            }
          }
        }
        setFrequency(frequency)
        setSubmissions(res.body.submissions)
      },
    }
  )

  useQuery(`users/${username}`, () => getUserByUsername(username ? username : "-1"), {
    retry: 1,
    onSuccess: (res) => {
      setUser(res.body.user)
    },
    onError: (err) => {
      // showErrorToasts(toast, err.response?.data.message)
    },
  })

  const [userStats, setUserStats] = useState<any>(null)
  useQuery(`stats/${username}`, () => getStatsByUsername(username || ""), {
    onSuccess: (res) => {
      setUserStats(res.body.stats)
    },
  })

  return (
    <Box>
      <Navbar />
      <Container size="xl">
        {user && userStats && frequency && submissionQuery.data && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.35 }}>
            <Box>
              <Helmet>
                <title>{user?.name}</title>
              </Helmet>
              <UserCard name={user.name} username={user.username} member_since={user.memberSince} role={user.role} />
              <Tabs defaultValue="stats">
                <Tabs.List>
                  <Tabs.Tab value="stats" icon={<IconPhoto size={16} />}>
                    STATS
                  </Tabs.Tab>
                  <Tabs.Tab value="medals" icon={<IconMessageCircle size={16} />}>
                    MEDALS
                  </Tabs.Tab>
                  <Tabs.Tab value="activity" icon={<IconSettings size={16} />}>
                    ACTIVITY
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="stats" py="xs">
                  <Stack>
                    <UserStats progress={userStats} />
                    <Grid>
                      <Grid.Col span={6}>
                        <WeeklySolvedChart data={frequency} />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TagsFreqChart data={userStats["tagsFrequency"]} />
                      </Grid.Col>
                    </Grid>
                  </Stack>
                </Tabs.Panel>
                <Tabs.Panel value="medals" pt="xs">
                  <MedalsTab userStats={userStats} />
                </Tabs.Panel>
                <Tabs.Panel value="activity" pt="xs">
                  <UserSubmissionTable submissions={submissions} />
                </Tabs.Panel>
              </Tabs>
            </Box>
          </motion.div>
        )}
      </Container>
    </Box>
  )
}
