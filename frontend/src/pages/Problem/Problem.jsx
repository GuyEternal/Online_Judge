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
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CodeMirror, { basicSetup } from "@uiw/react-codemirror";
import { cpp, cppLanguage } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-themes-all";
import { useCallback, useEffect, useState } from "react";
import Markdown from "react-markdown";
import ColorModeSwitcher from "../../components/ColorModeSwitcher/ColorModeSwitcher";

function Problem({ pid }) {
  const [problem, setProblem] = useState({});
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const editorTheme = colorMode === "dark" ? "darcula" : "default";
  const heightMax = "70vh";
  const onChangeOfCode = useCallback((code, viewUpdate) => {
    console.log("val:", code);
    setCode(code);
  }, []);

  const handleRun = () => {
    console.log("Handle running the code here");
    console.log(code);
  };

  const handleSubmit = () => {
    console.log("Handle Submission of code here");
    console.log(code);
  };

  const handleLogout = () => {
    axios.post(`http://localhost:3001/api/auth/logout`).then(() => {
      navigate("/");
    });
  };
  useEffect(() => {
    // Check if the cookie exists now or when you run / submit

    axios
      .get(`http://localhost:3001/api/problem/${pid}`)
      .then((response) => {
        setProblem(response.data);
        console.log("Got the problem object on the frontned!!");
      })
      .catch((error) => {
        console.error(
          "There was an error in fetching a sinlge problem!",
          error
        );
      });
  }, [pid]);

  return (
    <Box>
      <Box>
        <Stack>
          <Text
            fontSize={"x-large"}
            bgColor={useColorModeValue("gray.200", "gray.900")}
            color={useColorModeValue("gray.900", "gray.200")}
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
            <TabList>
              <Tab>Custom Input</Tab>
              <Tab>Output</Tab>
            </TabList>
            <TabPanels p={2} marginBottom={5}>
              <TabPanel>
                <Textarea height="100px" resize={"none"}>
                  {problem.sampleInput}
                </Textarea>
              </TabPanel>
              <TabPanel>
                <Textarea height="100px" resize={"none"} readOnly>
                  {problem.sampleOutput}
                </Textarea>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
        <Box
          flex="1"
          pl={2}
          textAlign={"left"}
          color={useColorModeValue("grey.800", "white")}
          maxH={heightMax}
          overflowY="auto"
        >
          <CodeMirror
            height={heightMax}
            overflowY={scroll}
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
  );
}

export default Problem;
