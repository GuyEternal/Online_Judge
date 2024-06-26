import {
  Table,
  Thead,
  Tbody,
  Text,
  Tr,
  Th,
  Td,
  TableContainer,
  Stack,
  Box,
  Link,
  useColorModeValue,
  useColorMode,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Problem from "../Problem/Problem";
import { ToastContainer, toast, Zoom, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DifficultyTag from "../../components/DifficultyTag/DifficultyTag";

function ProblemSet() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setusername] = useState();
  const [problems, setProblems] = useState([]);

  const navigate = useNavigate();
  let srNo = 1;
  const handleLinkToProblem = (pid) => {};
  useEffect(() => {
    // checkAuth
    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/auth/checkAuth")
      .then((response) => {
        setIsLoggedIn(response.data.success);
        setusername(response.data.username);
        0;
      })
      .catch((error) => {
        toast.error(
          <p>{"Error checking authentication status" + error.message}</p>
        );
        console.error("Error checking authentication status:", error);
        setIsLoggedIn(false);
      });

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/problem")
      .then((response) => {
        console.log(response.data.length);
        setProblems(response.data);
      })
      .catch((error) => {
        toast.error(<p>{error.message}</p>);
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div>
      <Navbar loggedIn={isLoggedIn} username_prop={username} />
      <>
        <ToastContainer draggable={false} transition={Zoom} autoClose={8000} />
        <Box>
          <Stack>
            <Text
              fontSize={"x-large"}
              bgColor={useColorModeValue("gray.200", "gray.900")}
              color={useColorModeValue("gray.900", "gray.200")}
              fontFamily={"Noto Sans"}
            >
              Problem Set
            </Text>
          </Stack>
        </Box>
        <TableContainer bgColor={useColorModeValue("gray.200", "gray.900")}>
          <Table
            variant="simple"
            _light={{ bgColor: "red.100", border: "1px solid black" }}
          >
            <Thead>
              <Tr _light={{ bgColor: "red.100", border: "1px solid black" }}>
                <Th
                  _light={{ bgColor: "red.100", border: "1px solid black" }}
                  maxW={1}
                >
                  PID:{" "}
                </Th>
                <Th _light={{ bgColor: "red.100", border: "1px solid black" }}>
                  Problem Name
                </Th>
                <Th _light={{ bgColor: "red.100", border: "1px solid black" }}>
                  Tags
                </Th>
                {/* <Th
                  _light={{ bgColor: "red.100", border: "1px solid black" }}
                  isNumeric
                >
                  Submitted By
                </Th> */}
              </Tr>
            </Thead>
            <Tbody>
              {problems
                .slice()
                .reverse()
                .map((problem) => (
                  <Tr key={problem._id}>
                    <Td
                      _light={{ bgColor: "red.100", border: "1px solid black" }}
                    >
                      {srNo++}
                    </Td>
                    <Td
                      _light={{ bgColor: "red.100", border: "1px solid black" }}
                    >
                      <Link
                        onClick={() => {
                          navigate("/problem/" + problem._id);
                        }}
                      >
                        {problem.name}
                      </Link>
                    </Td>
                    <Td
                      _light={{ bgColor: "red.100", border: "1px solid black" }}
                    >
                      <DifficultyTag difficulty={problem.difficulty} />
                    </Td>
                    {/* <Td
                      _light={{ bgColor: "red.100", border: "1px solid black" }}
                      isNumeric
                    >
                      45
                    </Td> */}
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </>
    </div>
  );
}

export default ProblemSet;
