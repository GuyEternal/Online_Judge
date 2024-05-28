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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { redirect, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Problem from "../Problem/Problem";

function ProblemSet() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setusername] = useState();
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const handleLinkToProblem = (pid) => {};
  useEffect(() => {
    // checkAuth
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
      .get("http://localhost:3001/api/problem")
      .then((response) => {
        console.log(response.data.length);
        setProblems(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  return (
    <div>
      <Navbar loggedIn={isLoggedIn} username_prop={username} />
      <>
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
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th maxW={1}>PID: </Th>
                <Th>Problem Name</Th>
                <Th>Tags</Th>
                <Th isNumeric>Submitted By</Th>
              </Tr>
            </Thead>
            <Tbody>
              {problems.map((problem, srNo = 0) => (
                <Tr key={problem._id}>
                  <Td>{srNo++}</Td>
                  <Td>
                    <Link
                      onClick={() => {
                        navigate("/problem/" + problem._id);
                      }}
                    >
                      {problem.name}
                    </Link>
                  </Td>
                  <Td>{problem.difficulty}</Td>
                  <Td isNumeric>45</Td>
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
