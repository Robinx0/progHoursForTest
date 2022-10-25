import { Helmet } from "react-helmet-async"
import { DashboardLayout } from "@/components/layouts/Dashboard"
import { useContext } from "react"
import { GlobalContext } from "@/GlobalStateProvider"
import { GeneralInformationForm } from "@/components/settings/GeneralInformationForm"
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react"
import { UpdatePasswordForm } from "@/components/settings/UpdatePasswordForm"
import HandleSettings from "@/components/settings/handles/HandleSettings"
import useUser from "@/hooks/useUser"

const Settings = () => {
  const { user } = useUser()

  return (
    <DashboardLayout>
      {/* @ts-ignore */}
      <Helmet>
        <title>Settings</title>
      </Helmet>
      {user && (
        <Tabs>
          <TabList>
            <Tab fontSize={["xs", "sm", "16px"]}>General Information</Tab>
            <Tab fontSize={["xs", "sm", "16px"]}>Update Password</Tab>
            <Tab fontSize={["xs", "sm", "16px"]}>Online Judge Handles</Tab>
            {/* <Tab>Preferences</Tab> */}
          </TabList>
          <TabPanels>
            <TabPanel>
              <GeneralInformationForm />
            </TabPanel>
            <TabPanel>
              <UpdatePasswordForm />
            </TabPanel>
            <TabPanel>
              <HandleSettings />
            </TabPanel>
            {/* <TabPanel>Upcoming!</TabPanel> */}
          </TabPanels>
        </Tabs>
      )}
    </DashboardLayout>
  )
}

export default Settings
