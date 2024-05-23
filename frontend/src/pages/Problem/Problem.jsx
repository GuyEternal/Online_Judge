import {
  Flex,
  Box,
  Button,
  useColorModeValue,
  Text,
  useColorMode,
  Center,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CodeMirror from "@uiw/react-codemirror";
import { cpp, cppLanguage } from "@codemirror/lang-cpp";
import { dracula } from "@uiw/codemirror-themes-all";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import ColorModeSwitcher from "../../components/ColorModeSwitcher/ColorModeSwitcher";

function Problem() {
  const { pid } = useParams();
  const [problem, setProblem] = useState({});
  const [code, setCode] = useState();
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const editorTheme = colorMode === "dark" ? "darcula" : "default";

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
        console.error("There was an error!", error);
      });
  }, [pid]);

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Box
          flex={3}
          fontSize={25}
          color={useColorModeValue("grey.800", "white")}
        >
          Problem Description
        </Box>
        <Flex>
          <Button mr={2} onClick={handleLogout}>
            Logout
          </Button>
          <ColorModeSwitcher />
        </Flex>
      </Flex>

      <Flex direction="row">
        <Box flex="1" pr={2} maxW={"50vw"} overflowY={scroll} height={"75vh"}>
          <Text>{problem.statement}</Text>
        </Box>
        <Box
          flex="1"
          pl={2}
          textAlign={"left"}
          color={useColorModeValue("grey.800", "white")}
        >
          <CodeMirror
            extensions={[cpp()]}
            value={code}
            lang="cpp"
            theme={dracula}
            options={{
              mode: "text/x-c++src", // for C++ support
              theme: editorTheme, // set theme based on color mode
            }}
            style={{
              fontSize: "1rem",
              maxHeight: "400px",
              maxWidth: "50vw",
              overflow: "scroll",
            }}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          ></CodeMirror>
        </Box>
      </Flex>
    </Box>
  );
}

export default Problem;
