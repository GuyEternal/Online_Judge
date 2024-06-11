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
  Tbody,
  Tr,
  Td,
  IconButton,
} from "@chakra-ui/react";
import { ObjectId, Types } from "mongoose";
import styles from "./styles.module.css";
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
import {
  AddIcon,
  CheckCircleIcon,
  CheckIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Problem from "../Problem/Problem";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProblem() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setusername] = useState();
  const navigate = useNavigate();
  const heightMax = "70vh";
  const [problem, setProblem] = useState({
    name: "",
    statement: "",
    sampleInput: "",
    sampleOutput: "",
    difficulty: "easy",
  });
  const handleCreateProblem = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/problem",
        problem
      );
      const pid = response.data._id;
      console.log(pid);
      await axios.post(
        import.meta.env.VITE_BACKEND_URL + `/api/testcase/problem/${pid}`,
        testcases
      );
    } catch (error) {
      toast.error(<p>{error.message}</p>);
      console.log(error);
    }
  };
  const handleProblemChange = (event) => {
    setProblem({
      ...problem,
      [event.target.name]: event.target.value,
    });
  };

  const [testcases, setTestcases] = useState([{ input: "", output: "" }]);

  const addTestcase = () => {
    setTestcases([...testcases, { id: uuidv4(), input: "", output: "" }]);
  };

  const removeTestcase = (index) => {
    setTestcases(testcases.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, value) => {
    const newTestcases = [...testcases];
    newTestcases[index].input = value;
    setTestcases(newTestcases);
  };

  const handleOutputChange = (index, value) => {
    const newTestcases = [...testcases];
    newTestcases[index].output = value;
    setTestcases(newTestcases);
  };

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
        toast.error(<p>{error.message}</p>);
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false);
        navigate("/login");
      });
    console.log(import.meta.env.VITE_BACKEND_URL);
    console.log(testcases, problem);
  }, [problem, testcases]);
  return (
    <>
      <Navbar loggedIn={isLoggedIn} username_prop={username} />
      <ToastContainer draggable={false} transition={Zoom} autoClose={8000} />
      <Box>
        <Box>
          <Flex flexDirection={"column"} alignItems={"center"}>
            <Text
              w={"100%"}
              _dark={{ bgColor: "gray.900", color: "gray.200" }}
              _light={{ bgColor: "gray.200", color: "gray.900" }}
              fontSize={"x-large"}
              fontFamily={"Noto Sans"}
            >
              Problem Setting Page
            </Text>
            <Box w={"100%"} padding={"1rem"}>
              <Textarea
                boxSizing="border-box"
                name="name"
                textAlign={"center"}
                maxW="100%"
                value={problem.name}
                _dark={{
                  bgColor: "gray.900",
                  color: "gray.200",
                  borderColor: "gray.500",
                }}
                _light={{
                  bgColor: "gray.200",
                  color: "gray.900",
                  borderColor: "gray.500",
                }}
                fontSize={"x-large"}
                fontFamily={"Noto Sans"}
                onChange={handleProblemChange}
                placeholder="Add Problem Name"
              ></Textarea>
            </Box>
          </Flex>
        </Box>

        <Flex direction="row">
          <Box flex="1" maxW={"50vw"} maxH={heightMax} overflowY="auto">
            <Box w={"100%"} padding={"1rem"}>
              <Textarea
                name="statement"
                _dark={{
                  bgColor: "gray.900",
                  color: "gray.200",
                  borderColor: "gray.500",
                }}
                _light={{
                  bgColor: "gray.200",
                  color: "gray.900",
                  borderColor: "gray.500",
                }}
                value={problem.statement}
                whiteSpace={"preserve-breaks"}
                overflowY={scroll}
                padding={5}
                fontSize="lg"
                onChange={handleProblemChange}
                placeholder="Add problem statement here"
              ></Textarea>
            </Box>
            <Flex direction="row" padding={"2rem"}>
              <Box flex="1" pr={2} maxW={"50vw"} overflowY="auto">
                <Text p={3}>Sample Input: </Text>
                <Textarea
                  _dark={{ bgColor: "gray.900", color: "gray.200" }}
                  _light={{ bgColor: "gray.200", color: "gray.900" }}
                  value={problem.sampleInput}
                  name="sampleInput"
                  whiteSpace={"preserve-breaks"}
                  textAlign={"left"}
                  border="1px"
                  borderColor="cyan.700"
                  padding={"1rem"}
                  onChange={handleProblemChange}
                ></Textarea>
              </Box>
              <Box flex="1" pr={2} maxW={"50vw"} overflowY="auto">
                <Text p={3}>Sample Output: </Text>
                <Textarea
                  _dark={{ bgColor: "gray.900", color: "gray.200" }}
                  _light={{ bgColor: "gray.200", color: "gray.900" }}
                  name="sampleOutput"
                  value={problem.sampleOutput}
                  whiteSpace={"preserve-breaks"}
                  textAlign={"left"}
                  border="1px"
                  borderColor="cyan.700"
                  padding={"1rem"}
                  onChange={handleProblemChange}
                ></Textarea>
              </Box>
            </Flex>
            <Select
              name="difficulty"
              value={problem.difficulty}
              onChange={handleProblemChange}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
            <IconButton
              color={"black"}
              bgColor={"green"}
              padding={9}
              icon={<CheckIcon boxSize={9} />}
              onClick={handleCreateProblem}
            ></IconButton>
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
            <Box>
              <Text
                padding={3}
                // style={{ position: "absolute" }}
                bgColor={"blue.200"}
                width={"100%"}
                opacity="1"
                _dark={{
                  bgColor: "gray.900",
                  color: "gray.200",
                  borderColor: "gray.500",
                }}
                _light={{
                  bgColor: "gray.200",
                  color: "gray.900",
                  borderColor: "gray.500",
                }}
              >
                Add Testcases:
              </Text>
              <Box overflowY={"scroll"}>
                <Table marginTop={"2rem"} variant="simple">
                  <Tbody>
                    {testcases.map((testcase, index) => (
                      <Tr key={index}>
                        <Td>
                          <Textarea
                            _dark={{ bgColor: "gray.900", color: "gray.200" }}
                            _light={{ bgColor: "gray.200", color: "gray.900" }}
                            value={testcase.input}
                            onChange={(e) =>
                              handleInputChange(index, e.target.value)
                            }
                          />
                        </Td>
                        <Td>
                          <Textarea
                            _dark={{ bgColor: "gray.900", color: "gray.200" }}
                            _light={{ bgColor: "gray.200", color: "gray.900" }}
                            value={testcase.output}
                            onChange={(e) =>
                              handleOutputChange(index, e.target.value)
                            }
                          />
                        </Td>
                        <Td>
                          <Button
                            colorScheme="red"
                            onClick={() => removeTestcase(index)}
                          >
                            <DeleteIcon />
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                    <Tr>
                      <Td colSpan={3}>
                        <Button colorScheme="green" onClick={addTestcase}>
                          <AddIcon />
                        </Button>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default AddProblem;
