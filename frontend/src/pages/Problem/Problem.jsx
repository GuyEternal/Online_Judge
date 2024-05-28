import {
  Flex,
  Box,
  Button,
  useColorModeValue,
  Text,
  useColorMode,
  Center,
  Stack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  EditableTextarea,
  Editable,
  EditablePreview,
  Textarea,
  Table,
  Skeleton,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CodeMirror, { basicSetup } from "@uiw/react-codemirror";
import { cpp, cppLanguage } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-themes-all";
import { useCallback, useEffect, useState } from "react";
import ColorModeSwitcher from "../../components/ColorModeSwitcher/ColorModeSwitcher";
import VerdictContainer from "../../components/VerdictContainer/VerdictContainer";
import Navbar from "../../components/Navbar/Navbar";

function Problem() {
  const [problem, setProblem] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [username, setusername] = useState();
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const editorTheme = colorMode === "dark" ? "darcula" : "default";
  const heightMax = "70vh";
  const { pid } = useParams();

  const onChangeOfCode = useCallback((code) => {
    console.log("val:", code);
    setCode(code);
  }, []);

  const handleRun = () => {
    console.log("Handle running the code here");
    console.log(code);
  };

  const handleSubmit = () => {
    console.log("Handle Submission of code here");
    setTrigger((prev) => !prev);
    console.log(code);
  };

  const handleLogout = () => {
    axios.post(`http://localhost:3001/api/auth/logout`).then(() => {
      navigate("/");
    });
  };

  useEffect(() => {
    // check auth
    axios
      .get("http://localhost:3001/api/auth/checkAuth")
      .then((response) => {
        setIsLoggedIn(response.data.success);
        setusername(response.data.username);
        0;
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);

        setIsLoggedIn(false);
      });

    axios
      .get(`http://localhost:3001/api/problem/${pid}`)
      .then((response) => {
        setProblem(response.data);
        setIsLoading(false); // Set loading to false after data is fetched
        console.log("Got the problem object on the frontned!!");
      })
      .catch((error) => {
        console.error(
          "There was an error in fetching a single problem!",
          error
        );
      });
  }, []);

  if (problem === undefined) {
    return (
      <>
        <Skeleton h="100%" w="100%" />
      </>
    );
  }
  return (
    <>
      <Navbar loggedIn={isLoggedIn} username_prop={username} />
      <Box>
        <Box>
          <Stack>
            <Text
              _dark={{ bgColor: "gray.900", color: "gray.200" }}
              _light={{ bgColor: "gray.200", color: "gray.900" }}
              fontSize={"x-large"}
              fontFamily={"Noto Sans"}
            >
              {problem.name}
            </Text>
          </Stack>
        </Box>

        <Flex direction="row">
          <Box flex="1" maxW={"50vw"} maxH={heightMax} overflowY="auto">
            <Text
              whiteSpace={"preserve-breaks"}
              overflowY={scroll}
              padding={5}
              fontSize="lg"
            >
              {problem.statement}
            </Text>
            <Flex direction="row" padding={"2rem"}>
              <Box flex="1" pr={2} maxW={"50vw"} overflowY="auto">
                <Text p={3}>Sample Input: </Text>
                <Text
                  whiteSpace={"preserve-breaks"}
                  textAlign={"left"}
                  border="1px"
                  borderColor="cyan.700"
                  padding={"1rem"}
                >
                  {problem.sampleInput}
                </Text>
              </Box>
              <Box flex="1" pr={2} maxW={"50vw"} overflowY="auto">
                <Text p={3}>Sample Output: </Text>
                <Text
                  whiteSpace={"preserve-breaks"}
                  textAlign={"left"}
                  border="1px"
                  borderColor="cyan.700"
                  padding={"1rem"}
                >
                  {problem.sampleOutput}
                </Text>
              </Box>
            </Flex>
            <Tabs variant="solid-rounded">
              <TabList ml={5} p={3}>
                <Tab>Custom Input</Tab>
                <Tab>Output</Tab>
                {isLoggedIn && <Tab>Verdicts</Tab>}
              </TabList>
              <TabPanels p={2} marginBottom={5}>
                <TabPanel>
                  <Textarea
                    height="100px"
                    resize={"none"}
                    defaultValue={problem.sampleInput}
                  ></Textarea>
                </TabPanel>
                <TabPanel>
                  <Textarea
                    height="100px"
                    resize={"none"}
                    defaultValue={problem.sampleOutput}
                    readOnly
                  ></Textarea>
                </TabPanel>
                {isLoggedIn && (
                  <TabPanel>
                    <VerdictContainer
                      username_prop={username}
                      trigger={trigger}
                      problemID_prop={pid}
                    />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Box>
          <Box
            flex="1"
            pl={2}
            textAlign={"left"}
            _light={{ bgColor: "white" }}
            _dark={{ bgColor: "grey.800" }}
            maxH={heightMax}
            overflowY="auto"
          >
            <CodeMirror
              height={heightMax}
              extensions={[
                cpp(),
                basicSetup({
                  extraKeys: { "Ctrl-Space": "autocomplete" },
                  highlightActiveLine: true,
                  foldGutter: false,
                  dropCursor: false,
                  allowMultipleSelections: false,
                  indentOnInput: false,
                }),
              ]}
              value={code}
              lang="cpp"
              theme={dracula}
              options={{
                mode: "text/x-c++src", // for C++ support
                theme: editorTheme, // set theme based on color mode
              }}
              style={{
                fontSize: "1rem",
                maxHeight: heightMax,
                maxWidth: "50vw",
                overflow: "auto",
              }}
              onChange={onChangeOfCode}
            ></CodeMirror>
          </Box>
        </Flex>

        <Flex w="100%" justifyContent={"space-around"}>
          <Button colorScheme="yellow" m={3} p={4} onClick={handleRun}>
            Run
          </Button>
          <Button colorScheme="red" m={3} p={4} onClick={handleSubmit}>
            Submit
          </Button>
        </Flex>
      </Box>
    </>
  );
}

export default Problem;
