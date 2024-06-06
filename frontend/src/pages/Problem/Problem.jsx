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
  Select,
  Input,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror, { basicSetup } from "@uiw/react-codemirror";
import ColorModeSwitcher from "../../components/ColorModeSwitcher/ColorModeSwitcher";
import VerdictContainer from "../../components/VerdictContainer/VerdictContainer";
import Navbar from "../../components/Navbar/Navbar";
import { dracula } from "@uiw/codemirror-themes-all";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

function Problem() {
  const [problem, setProblem] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [username, setusername] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [customInput, setCustomInput] = useState();
  const [customOutput, setCustomOutput] = useState("No Output");
  const navigate = useNavigate();
  const heightMax = "70vh";
  const { pid } = useParams();

  const [code, setCode] = useState(localStorage.getItem(`code`) || "");
  const onChangeOfCode = useCallback(
    (code) => {
      console.log("val:", code);
      setCode(code);
      localStorage.setItem(`code`, code);
    },
    [code]
  );

  const handleRun = async () => {
    try {
      await axios
        .post(`http://localhost:3001/api/run/`, {
          code: code,
          language: selectedLanguage,
          customInput: customInput,
        })
        .then((response) => {
          if (response.data) {
            if (response.data.op.error) {
              console.log(response.data.op.output);
              if (response.data.op.time > 1000) {
                setCustomOutput("TLE");
              } else {
                setCustomOutput(response.data.op.error.message);
              }
            }
            if (response.data.op.output) {
              setCustomOutput(
                response.data.op.output + "\n time: " + response.data.op.time
              );
            }
          } else {
            console.log("Data object empty!");
          }
        });
    } catch (error) {
      console.error(error);
    }
    console.log("Handle running the code here");
  };

  const handleSubmit = async () => {
    console.log("Handle Submission of code here");
    try {
      const response = await axios.post(
        `http://localhost:3001/api/submissions/submit/${pid}`,
        {
          problem: problem,
          code: code,
          language: selectedLanguage,
          customInput: customInput,
          username: username,
        }
      );
    } catch (err) {
      console.log(err);
    }
    setTrigger((prev) => !prev);
    console.log(code);
  };

  const handleLogout = () => {
    axios.post(`http://localhost:3001/api/auth/logout`).then(() => {
      navigate("/");
    });
  };

  const getLanguageExtension = (language) => {
    switch (language) {
      case "cpp":
        return cpp();
      case "python":
        return python();
      case "java":
        return java();
      // add other languages as needed
      default:
        return cpp(); // default language
    }
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
                    value={customInput}
                    onChange={(e) => {
                      setCustomInput(e.target.value);
                    }}
                  ></Textarea>
                </TabPanel>
                <TabPanel>
                  <Textarea
                    padding={"0.5rem"}
                    style={{
                      borderWidth: "1px",
                      borderRadius: "5px",
                    }}
                    whiteSpace="preserve-breaks"
                    textAlign="left"
                    value={customOutput}
                    readOnly
                  ></Textarea>
                </TabPanel>
                {isLoggedIn && (
                  <TabPanel>
                    <VerdictContainer
                      username_prop={username}
                      trigger_prop={trigger}
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
            <Select
              variant="flushed"
              size="sm"
              width="20%"
              style={{ padding: "8px" }}
              value={selectedLanguage}
              onChange={(e) => {
                console.log("Language Changed!!");
                setSelectedLanguage(e.target.value);
              }}
            >
              <option value="cpp">cpp</option>
              <option value="py">py</option>
              <option value="java">java</option>
            </Select>
            <CodeMirror
              height={heightMax}
              extensions={[
                getLanguageExtension(selectedLanguage),
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
              lang={selectedLanguage}
              theme={localStorage.getItem("chakra-ui-color-mode")}
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
