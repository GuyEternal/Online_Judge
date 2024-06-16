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
import Markdown from "react-markdown";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Problem() {
  const [problem, setProblem] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const { colorMode } = useColorMode();
  const [editorTheme, setEditorTheme] = useState(colorMode);
  const [username, setusername] = useState();
  const [selectedLanguage, setSelectedLanguage] = useState("cpp");
  const [customInput, setCustomInput] = useState();
  const [customOutput, setCustomOutput] = useState("No Output");
  const navigate = useNavigate();
  const heightMax = "70vh";
  const { pid } = useParams();

  const [code, setCode] = useState(
    localStorage.getItem(`code-${selectedLanguage}`) || ""
  );
  const onChangeOfCode = useCallback(
    (code) => {
      setCode(code);
      localStorage.setItem(`code-${selectedLanguage}`, code);
    },
    [code]
  );

  const handleRun = async () => {
    try {
      if (customInput === "") {
        toast.info(<p>"Input is empty!"</p>);
      }
      await axios
        .post(import.meta.env.VITE_BACKEND_URL + `/api/run/`, {
          code: code,
          language: selectedLanguage,
          customInput: customInput,
        })
        .then((response) => {
          if (response.data) {
            if (response.data.op.error) {
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
            toast.info(<p>Server Error!</p>);
          }
        });
    } catch (error) {
      toast.error(<p>{error.message}</p>);
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/api/submissions/submit/${pid}`,
        {
          problem: problem,
          code: code,
          language: selectedLanguage,
          customInput: customInput,
          username: username,
        }
      );
    } catch (err) {
      if (err.status === 400 || err.status === 401) {
        toast.warning(<p>{err.message}</p>);
      } else {
        toast.error(<p>{err.message}</p>);
      }
    }
    setTrigger((prev) => !prev);
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
    setEditorTheme(colorMode);
  }, [colorMode]);

  useEffect(() => {
    if (localStorage.getItem(`code-${selectedLanguage}`) === null) {
      if (selectedLanguage === "cpp") {
        localStorage.setItem(`code-${selectedLanguage}`, codeCPP);
        setCode(codeCPP);
      } else if (selectedLanguage === "java") {
        localStorage.setItem(`code-${selectedLanguage}`, codeJava);
        setCode(codeJava);
      } else if (selectedLanguage === "py") {
        localStorage.setItem(`code-${selectedLanguage}`, codePY);
        setCode(codePY);
      }
    }
  }, [selectedLanguage]);

  useEffect(() => {
    setCode(localStorage.getItem(`code-${selectedLanguage}`));
  }, [selectedLanguage]);

  useEffect(() => {
    // check auth
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/auth/checkAuth")
      .then((response) => {
        setIsLoggedIn(response.data.success);
        setusername(response.data.username);
        0;
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        toast.error(<p>{("Error checking authentication status:", error)}</p>);
        setIsLoggedIn(false);
      });

    axios
      .get(import.meta.env.VITE_BACKEND_URL + `/api/problem/${pid}`)
      .then((response) => {
        setProblem(response.data);
        setIsLoading(false); // Set loading to false after data is fetched

        setCustomInput(response.data.sampleInput);
      })
      .catch((error) => {
        toast.error(
          <p>{"There was an error in fetching a single problem!" + error}</p>
        );
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
      <ToastContainer draggable={false} transition={Zoom} autoClose={8000} />

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
              textAlign={"left"}
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
              theme={editorTheme}
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

const codeCPP = `#include<bits/stdc++.h>
using namespace std;
void solve(){
  cout << "Hello";
}
int main(){

    int tt ; 
    cin>>tt ; 
    while(tt--){
        solve() ;
    }
}`;
const codePY = `print("hello")`;
const codeJava = `import java.io.*;
import java.util.*;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // Scanning input for two numbers
        int num1 = scanner.nextInt();
        int num2 = scanner.nextInt();

        // Calculating the sum of the two numbers
        // int sum = num1 + num2;

        System.out.println("Hello, World!");
        // System.out.println(sum);
    }
}
`;
